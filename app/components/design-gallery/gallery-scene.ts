import * as THREE from "three";

import { getArtworkViewingPose, type CharacterState, type GalleryBounds, type QualityTier } from "./gallery-controller";
import { designServices, portfolioWorks, type GalleryArtwork } from "./gallery-data";

export interface GallerySceneOptions {
  width: number;
  height: number;
  bounds: GalleryBounds;
  quality: QualityTier;
  maxAnisotropy: number;
}

export interface GallerySceneHandle {
  scene: THREE.Scene;
  camera: THREE.PerspectiveCamera;
  character: THREE.Group;
  artworkFrames: ReadonlyMap<string, THREE.Group>;
  ready: Promise<void>;
  updateCharacter(state: CharacterState, time: number, reducedMotion: boolean): void;
  setFocusedArtwork(id: string | null): void;
  resize(width: number, height: number): void;
  dispose(): void;
}

interface CharacterRig {
  group: THREE.Group;
  leftArm: THREE.Group;
  rightArm: THREE.Group;
  leftLeg: THREE.Group;
  rightLeg: THREE.Group;
}

interface ArtworkFrameState {
  group: THREE.Group;
  frameMaterial: THREE.MeshStandardMaterial;
  artworkMaterial: THREE.MeshStandardMaterial;
}

interface ArtworkFrameResult {
  frame: ArtworkFrameState;
  ready: Promise<void>;
}

export interface FreeCameraPose {
  position: THREE.Vector3;
  lookTarget: THREE.Vector3;
}

interface GallerySceneConstruction {
  scene: THREE.Scene;
  directionalLight: THREE.DirectionalLight | null;
  disposed: boolean;
}

const BRICK_COLS = 8;
const BRICK_ROWS = 10;
const BRICK_PIXEL_WIDTH = 64;
const BRICK_PIXEL_HEIGHT = 28;
const BRICK_MORTAR_PIXELS = 4;
const BRICK_TILE_WORLD_WIDTH = 1.9;
const BRICK_TILE_WORLD_HEIGHT = 1.0;
const WALL_HEIGHT = 5.8;
const WALL_PADDING = 1.35;
const ENTRANCE_DEPTH = 5.2;
const FRONT_WALL_PADDING = 2.1;
const FRAME_DEPTH = 0.17;
const FRAME_BORDER = 0.22;
const CHARACTER_BASE_Y = 0;
const CAMERA_FOLLOW_RESPONSE: Record<QualityTier["tier"], number> = {
  mobile: 10,
  balanced: 7,
  desktop: 5.5,
};

export function getCameraFollowBlend(deltaSeconds: number, tier: QualityTier["tier"]): number {
  const boundedDelta = THREE.MathUtils.clamp(deltaSeconds, 0, 0.1);
  return 1 - Math.exp(-CAMERA_FOLLOW_RESPONSE[tier] * boundedDelta);
}

export function getFreeCameraPose(
  position: { x: number; y: number },
  tier: QualityTier["tier"],
  aspect = 16 / 9,
): FreeCameraPose {
  const isPhonePortrait = aspect < 0.62;
  const isPortrait = aspect < 0.95;
  const lateralFollow = isPhonePortrait ? 0.16 : isPortrait ? 0.27 : tier === "mobile" ? 0.34 : 0.42;
  const followDistance = isPhonePortrait ? 7.0 : isPortrait ? 6.1 : tier === "mobile" ? 5.6 : 5.2;
  const lookTargetY = isPhonePortrait ? 4.4 : isPortrait ? 3.6 : 2.6;
  return {
    position: new THREE.Vector3(
      position.x * lateralFollow,
      isPhonePortrait ? 2.58 : isPortrait ? 2.82 : tier === "mobile" ? 2.75 : 3.08,
      position.y + followDistance,
    ),
    lookTarget: new THREE.Vector3(position.x * (isPortrait ? 0.72 : 1), lookTargetY, position.y - 3.25),
  };
}

export function getResponsiveCameraFov(
  width: number,
  height: number,
  tier: QualityTier["tier"],
): number {
  const aspect = safeAspect(width, height);
  if (aspect < 0.62) return 70;
  if (aspect < 0.95) return 61;
  return tier === "mobile" ? 56 : 50;
}

// A polished hardwood gallery floor: boards run the length of the room (the
// PlaneGeometry's V axis maps to room depth once rotated flat), each board
// a narrow column with its own tint, grain streaks, and staggered end-joint
// seams so it doesn't repeat as one obvious tile. A companion bump map
// gives the seams between boards real depth under the room lights.
function createFloorPlankTextures(baseColorHex: number): { map: THREE.CanvasTexture; bumpMap: THREE.CanvasTexture } {
  const width = FLOOR_PLANK_COLS * FLOOR_PLANK_COL_PIXELS;
  const height = FLOOR_TEXTURE_HEIGHT;

  const colorCanvas = document.createElement("canvas");
  colorCanvas.width = width;
  colorCanvas.height = height;
  const colorCtx = colorCanvas.getContext("2d");

  const bumpCanvas = document.createElement("canvas");
  bumpCanvas.width = width;
  bumpCanvas.height = height;
  const bumpCtx = bumpCanvas.getContext("2d");

  if (!colorCtx || !bumpCtx) throw new Error("Unable to create gallery floor texture");

  const base = new THREE.Color(baseColorHex);
  bumpCtx.fillStyle = "#787878";
  bumpCtx.fillRect(0, 0, width, height);

  let seed = 30211;
  const random = () => {
    seed = (seed * 1664525 + 1013904223) % 4294967296;
    return seed / 4294967296;
  };

  for (let col = 0; col < FLOOR_PLANK_COLS; col += 1) {
    const x = col * FLOOR_PLANK_COL_PIXELS;
    const boardWidth = FLOOR_PLANK_COL_PIXELS - 2;
    const shade = 0.92 + random() * 0.22;
    const board = base.clone().multiplyScalar(shade);
    colorCtx.fillStyle = `rgb(${Math.round(board.r * 255)}, ${Math.round(board.g * 255)}, ${Math.round(board.b * 255)})`;
    colorCtx.fillRect(x, 0, boardWidth, height);

    for (let streak = 0; streak < 5; streak += 1) {
      colorCtx.fillStyle = `rgba(0, 0, 0, ${0.03 + random() * 0.05})`;
      const streakX = x + random() * (boardWidth - 3);
      colorCtx.fillRect(streakX, 0, 1.4, height);
    }

    let cursor = random() * 80;
    while (cursor < height) {
      const boardLength = 90 + random() * 70;
      colorCtx.fillStyle = "rgba(0, 0, 0, 0.16)";
      colorCtx.fillRect(x, cursor, boardWidth, 2);
      cursor += boardLength;
    }

    bumpCtx.fillStyle = "#dcdcdc";
    bumpCtx.fillRect(x, 0, boardWidth, height);
  }

  const map = new THREE.CanvasTexture(colorCanvas);
  map.colorSpace = THREE.SRGBColorSpace;
  map.wrapS = THREE.RepeatWrapping;
  map.wrapT = THREE.RepeatWrapping;

  const bumpMap = new THREE.CanvasTexture(bumpCanvas);
  bumpMap.wrapS = THREE.RepeatWrapping;
  bumpMap.wrapT = THREE.RepeatWrapping;

  return { map, bumpMap };
}

// A running-bond brick pattern rendered to canvas, in two aligned layers: a
// colour map (per-brick tint variance around the gallery's base wall colour,
// plus mortar joints) and a bump map (raised brick faces, recessed mortar)
// so the wall reads as real masonry under the room's lighting instead of a
// flat painted plane. Brick width/offset are chosen so the pattern tiles
// seamlessly under THREE.RepeatWrapping (offset is exactly half a brick,
// and both divide the canvas width evenly).
function createBrickTextures(baseColorHex: number): { map: THREE.CanvasTexture; bumpMap: THREE.CanvasTexture } {
  const width = BRICK_COLS * BRICK_PIXEL_WIDTH;
  const height = BRICK_ROWS * BRICK_PIXEL_HEIGHT;

  const colorCanvas = document.createElement("canvas");
  colorCanvas.width = width;
  colorCanvas.height = height;
  const colorCtx = colorCanvas.getContext("2d");

  const bumpCanvas = document.createElement("canvas");
  bumpCanvas.width = width;
  bumpCanvas.height = height;
  const bumpCtx = bumpCanvas.getContext("2d");

  if (!colorCtx || !bumpCtx) throw new Error("Unable to create brick wall texture");

  const base = new THREE.Color(baseColorHex);
  const mortarColor = "#a89178";

  colorCtx.fillStyle = mortarColor;
  colorCtx.fillRect(0, 0, width, height);
  bumpCtx.fillStyle = "#3c3c3c";
  bumpCtx.fillRect(0, 0, width, height);

  let seed = 90121;
  const random = () => {
    seed = (seed * 1664525 + 1013904223) % 4294967296;
    return seed / 4294967296;
  };

  for (let row = 0; row < BRICK_ROWS; row += 1) {
    const rowOffset = row % 2 === 0 ? 0 : BRICK_PIXEL_WIDTH / 2;
    for (let col = -1; col <= BRICK_COLS; col += 1) {
      const x = col * BRICK_PIXEL_WIDTH + rowOffset + BRICK_MORTAR_PIXELS / 2;
      const y = row * BRICK_PIXEL_HEIGHT + BRICK_MORTAR_PIXELS / 2;
      const w = BRICK_PIXEL_WIDTH - BRICK_MORTAR_PIXELS;
      const h = BRICK_PIXEL_HEIGHT - BRICK_MORTAR_PIXELS;

      const shade = 0.96 + random() * 0.3;
      const brick = base.clone().multiplyScalar(shade);
      colorCtx.fillStyle = `rgb(${Math.round(brick.r * 255)}, ${Math.round(brick.g * 255)}, ${Math.round(brick.b * 255)})`;
      colorCtx.fillRect(x, y, w, h);

      colorCtx.fillStyle = `rgba(0, 0, 0, ${0.025 + random() * 0.04})`;
      colorCtx.fillRect(x, y + h * (0.4 + random() * 0.3), w, h * 0.22);

      const bumpValue = Math.round(150 + random() * 55);
      bumpCtx.fillStyle = `rgb(${bumpValue}, ${bumpValue}, ${bumpValue})`;
      bumpCtx.fillRect(x, y, w, h);
    }
  }

  const map = new THREE.CanvasTexture(colorCanvas);
  map.colorSpace = THREE.SRGBColorSpace;
  map.wrapS = THREE.RepeatWrapping;
  map.wrapT = THREE.RepeatWrapping;

  const bumpMap = new THREE.CanvasTexture(bumpCanvas);
  bumpMap.wrapS = THREE.RepeatWrapping;
  bumpMap.wrapT = THREE.RepeatWrapping;

  return { map, bumpMap };
}

function createBrickWallMaterial(
  baseColorHex: number,
  worldWidth: number,
  worldHeight: number,
  maxAnisotropy: number,
): THREE.MeshStandardMaterial {
  const { map, bumpMap } = createBrickTextures(baseColorHex);
  const repeatX = Math.max(2, worldWidth / BRICK_TILE_WORLD_WIDTH);
  const repeatY = Math.max(2, worldHeight / BRICK_TILE_WORLD_HEIGHT);
  map.repeat.set(repeatX, repeatY);
  bumpMap.repeat.set(repeatX, repeatY);
  map.anisotropy = maxAnisotropy;
  bumpMap.anisotropy = maxAnisotropy;
  return new THREE.MeshStandardMaterial({
    map,
    bumpMap,
    bumpScale: 0.032,
    roughness: 0.88,
    metalness: 0,
  });
}

const FLOOR_PLANK_COLS = 10;
const FLOOR_PLANK_COL_PIXELS = 56;
const FLOOR_TEXTURE_HEIGHT = 384;
const FLOOR_TILE_WORLD_WIDTH = 2.2;
const FLOOR_TILE_WORLD_LENGTH = 3.6;
const CEILING_PLANK_COUNT = 9;
const CEILING_PLANK_PIXELS = 64;
const CEILING_TILE_WORLD_LENGTH = 2.6;

// A painted plank ceiling, banded with subtle per-plank tone variance and a
// seam line at each board edge — this is what actually sells the pitched
// roof as a built structure once it's lit (see the MeshStandardMaterial
// swap below); the previous MeshBasicMaterial ignored scene lighting
// entirely and read as a flat, unshaded cutout regardless of texture.
function createCeilingPlankTexture(baseColorHex: number): THREE.CanvasTexture {
  const width = 512;
  const height = CEILING_PLANK_COUNT * CEILING_PLANK_PIXELS;
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Unable to create ceiling panel texture");

  const base = new THREE.Color(baseColorHex);
  let seed = 51173;
  const random = () => {
    seed = (seed * 1664525 + 1013904223) % 4294967296;
    return seed / 4294967296;
  };

  for (let row = 0; row < CEILING_PLANK_COUNT; row += 1) {
    const y = row * CEILING_PLANK_PIXELS;
    const shade = 0.95 + random() * 0.14;
    const plank = base.clone().multiplyScalar(shade);
    ctx.fillStyle = `rgb(${Math.round(plank.r * 255)}, ${Math.round(plank.g * 255)}, ${Math.round(plank.b * 255)})`;
    ctx.fillRect(0, y, width, CEILING_PLANK_PIXELS - 3);
    ctx.fillStyle = "rgba(0, 0, 0, 0.16)";
    ctx.fillRect(0, y + CEILING_PLANK_PIXELS - 3, width, 3);

    for (let streak = 0; streak < 3; streak += 1) {
      ctx.fillStyle = `rgba(0, 0, 0, ${0.02 + random() * 0.03})`;
      const streakY = y + random() * (CEILING_PLANK_PIXELS - 6);
      ctx.fillRect(0, streakY, width, 1.5);
    }
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  return texture;
}

export function createGalleryScene(options: GallerySceneOptions): GallerySceneHandle {
  const construction: GallerySceneConstruction = {
    scene: new THREE.Scene(),
    directionalLight: null,
    disposed: false,
  };

  try {
    return buildGalleryScene(options, construction);
  } catch (error) {
    construction.disposed = true;
    disposeSceneResources(construction.scene, construction.directionalLight);
    throw error;
  }
}

function buildGalleryScene(
  options: GallerySceneOptions,
  construction: GallerySceneConstruction,
): GallerySceneHandle {
  const { bounds, quality, maxAnisotropy } = options;
  const roomHalfWidth = Math.max(Math.abs(bounds.minX), Math.abs(bounds.maxX)) + WALL_PADDING;
  const roomMinZ = bounds.minY - FRONT_WALL_PADDING;
  const roomMaxZ = bounds.maxY + WALL_PADDING + ENTRANCE_DEPTH;
  const roomDepth = roomMaxZ - roomMinZ;
  const roomCenterZ = (roomMinZ + roomMaxZ) / 2;
  const { scene } = construction;
  scene.background = new THREE.Color(0xd9c7a3);
  scene.fog = new THREE.Fog(0xd9c7a3, quality.tier === "mobile" ? 16 : 22, quality.tier === "mobile" ? 34 : 46);

  let viewportAspect = safeAspect(options.width, options.height);
  const camera = new THREE.PerspectiveCamera(getResponsiveCameraFov(options.width, options.height, quality.tier), viewportAspect, 0.1, quality.tier === "mobile" ? 42 : 58);
  camera.position.set(0, 3.15, Math.min(roomMaxZ - 0.5, bounds.maxY + 7.8));
  camera.lookAt(0, 1.15, bounds.maxY - 2.5);

  const architecture = new THREE.Group();
  architecture.name = "Gallery architecture";
  scene.add(architecture);

  // Polished hardwood boards instead of one flat tan colour — same warm
  // tone as before, now with real grain and board-seam depth.
  const floorTextures = createFloorPlankTextures(0xcdb992);
  floorTextures.map.repeat.set((roomHalfWidth * 2) / FLOOR_TILE_WORLD_WIDTH, roomDepth / FLOOR_TILE_WORLD_LENGTH);
  floorTextures.bumpMap.repeat.copy(floorTextures.map.repeat);
  floorTextures.map.anisotropy = maxAnisotropy;
  floorTextures.bumpMap.anisotropy = maxAnisotropy;
  const floorMaterial = new THREE.MeshStandardMaterial({
    map: floorTextures.map,
    bumpMap: floorTextures.bumpMap,
    bumpScale: 0.014,
    roughness: 0.52,
    metalness: 0.04,
  });
  const blackMaterial = new THREE.MeshStandardMaterial({ color: 0x111111, roughness: 0.45, metalness: 0.25 });
  const floorGeometry = new THREE.PlaneGeometry(roomHalfWidth * 2, roomDepth);
  const wallGeometry = new THREE.BoxGeometry(0.18, WALL_HEIGHT, roomDepth);
  const frontWallGeometry = new THREE.BoxGeometry(roomHalfWidth * 2 + 0.18, WALL_HEIGHT, 0.18);
  const railGeometry = new THREE.CylinderGeometry(0.06, 0.06, roomDepth - 0.6, 16);
  const postGeometry = new THREE.CylinderGeometry(0.03, 0.03, 0.92, 8);

  const floor = new THREE.Mesh(floorGeometry, floorMaterial);
  floor.name = "Gallery floor";
  floor.rotation.x = -Math.PI / 2;
  floor.position.z = roomCenterZ;
  floor.receiveShadow = quality.tier !== "mobile";
  architecture.add(floor);

  // Same terracotta gallery colour as before, now rendered as brick — a
  // per-brick tint texture plus a bump map for real recessed mortar lines,
  // instead of one flat colour. Side and front walls get their own texture
  // instance since their physical dimensions differ (repeat is tuned per
  // wall so brick size reads consistently around the room).
  const plasterMaterial = createBrickWallMaterial(0xc79a76, roomDepth, WALL_HEIGHT, maxAnisotropy);

  for (const side of [-1, 1] as const) {
    const wall = new THREE.Mesh(wallGeometry, plasterMaterial);
    wall.name = side < 0 ? "Left gallery wall" : "Right gallery wall";
    wall.position.set(side * roomHalfWidth, WALL_HEIGHT / 2, roomCenterZ);
    wall.receiveShadow = quality.tier !== "mobile";
    architecture.add(wall);

    const rail = new THREE.Mesh(railGeometry, blackMaterial);
    rail.name = `${wall.name} rail`;
    rail.rotation.x = Math.PI / 2;
    rail.position.set(side * (roomHalfWidth - 0.55), 1.02, roomCenterZ);
    rail.castShadow = quality.tier !== "mobile";
    architecture.add(rail);

    const postCount = Math.max(10, Math.floor(roomDepth / 1.3));
    for (let index = 0; index <= postCount; index += 1) {
      const post = new THREE.Mesh(postGeometry, blackMaterial);
      post.name = `${wall.name} rail post ${index + 1}`;
      post.position.set(
        side * (roomHalfWidth - 0.55),
        0.56,
        THREE.MathUtils.lerp(roomMinZ + 0.45, roomMaxZ - 0.45, index / postCount),
      );
      post.castShadow = quality.tier !== "mobile";
      architecture.add(post);
    }
  }

  const frontWallMaterial = createBrickWallMaterial(0xc79a76, roomHalfWidth * 2, WALL_HEIGHT, maxAnisotropy);
  const frontWall = new THREE.Mesh(frontWallGeometry, frontWallMaterial);
  frontWall.name = "Services wall";
  frontWall.position.set(0, WALL_HEIGHT / 2, roomMinZ);
  frontWall.receiveShadow = quality.tier !== "mobile";
  architecture.add(frontWall);

  addPitchedRoof(architecture, roomHalfWidth, roomDepth, roomCenterZ, blackMaterial, maxAnisotropy);
  addCeilingLights(scene, architecture, roomMinZ, roomMaxZ, quality.tier === "mobile");

  const ambientLight = new THREE.AmbientLight(0xffffff, 1.85);
  ambientLight.name = "Gallery ambient light";
  scene.add(ambientLight);

  const directionalLight = new THREE.DirectionalLight(0xffffff, 2.4);
  construction.directionalLight = directionalLight;
  directionalLight.name = "Gallery directional light";
  directionalLight.position.set(-4, WALL_HEIGHT + 3, roomMaxZ - 2);
  directionalLight.target.position.set(0, 1, roomCenterZ);
  directionalLight.castShadow = quality.tier === "desktop";
  if (directionalLight.castShadow) {
    directionalLight.shadow.mapSize.set(2048, 2048);
    directionalLight.shadow.camera.near = 1;
    directionalLight.shadow.camera.far = 60;
    directionalLight.shadow.camera.left = -(roomHalfWidth + 4);
    directionalLight.shadow.camera.right = roomHalfWidth + 4;
    directionalLight.shadow.camera.top = roomDepth * 0.75;
    directionalLight.shadow.camera.bottom = -(roomDepth * 0.35);
    directionalLight.shadow.bias = -0.0015;
  }
  scene.add(directionalLight, directionalLight.target);

  addServiceWall(scene, roomMinZ, maxAnisotropy);

  const frameStates = new Map<string, ArtworkFrameState>();
  const artworkFrames = new Map<string, THREE.Group>();
  const frameBarGeometry = new THREE.BoxGeometry(1, 1, FRAME_DEPTH);
  const artworkBackingGeometry = new THREE.BoxGeometry(1, 1, FRAME_DEPTH * 0.55);
  const artworkPlaneGeometry = new THREE.PlaneGeometry(1, 1);
  const textureLoader = new THREE.TextureLoader();
  const artworkTextureReadiness: Promise<void>[] = [];

  for (const artwork of portfolioWorks) {
    const frameResult = createArtworkFrame(
      scene,
      artwork,
      roomHalfWidth,
      frameBarGeometry,
      artworkBackingGeometry,
      artworkPlaneGeometry,
      textureLoader,
      () => construction.disposed,
      maxAnisotropy,
    );
    const frameState = frameResult.frame;
    frameStates.set(artwork.id, frameState);
    artworkFrames.set(artwork.id, frameState.group);
    artworkTextureReadiness.push(frameResult.ready);
  }
  addViewingMarkers(scene);
  const ready = Promise.all(artworkTextureReadiness).then(() => undefined);

  const rig = createCharacterRig(scene);

  let focusedArtworkId: string | null = null;
  let previousUpdateTime: number | null = null;
  const desiredCameraPosition = new THREE.Vector3();
  const cameraLookTarget = new THREE.Vector3();

  function updateCharacter(state: CharacterState, time: number, reducedMotion: boolean): void {
    const depth = state.position.y;
    rig.group.position.set(state.position.x, CHARACTER_BASE_Y + state.bobOffset, depth);
    const focusedArtwork = focusedArtworkId
      ? portfolioWorks.find((artwork) => artwork.id === focusedArtworkId) ?? null
      : null;
    rig.group.rotation.y = focusedArtwork
      ? getArtworkViewingPose(focusedArtwork).facingAngle
      : state.facingAngle;

    const speed = Math.hypot(state.velocity.x, state.velocity.y);
    const walkStrength = reducedMotion ? 0 : THREE.MathUtils.clamp(speed / 4, 0, 1);
    const stride = reducedMotion ? 0 : Math.sin(time * 8.5) * 0.52 * walkStrength;
    rig.leftArm.rotation.x = stride;
    rig.rightArm.rotation.x = -stride;
    rig.leftLeg.rotation.x = -stride * 0.72;
    rig.rightLeg.rotation.x = stride * 0.72;

    if (focusedArtwork) {
      const wallDirection = focusedArtwork.wallSide === "left" ? -1 : 1;
      const inspectionDistance = viewportAspect < 0.62 ? 6.15 : viewportAspect < 0.95 ? 5.15 : 4.15;
      desiredCameraPosition.set(
        state.position.x - wallDirection * inspectionDistance,
        viewportAspect < 0.95 ? 2.72 : 2.35,
        focusedArtwork.zPosition + 0.08,
      );
      cameraLookTarget.set(
        focusedArtwork.wallSide === "left" ? -roomHalfWidth + 0.12 : roomHalfWidth - 0.12,
        2.5,
        focusedArtwork.zPosition,
      );
    } else {
      const freePose = getFreeCameraPose(state.position, quality.tier, viewportAspect);
      desiredCameraPosition.copy(freePose.position);
      cameraLookTarget.copy(freePose.lookTarget);
    }
    const deltaSeconds = previousUpdateTime === null ? 1 / 60 : Math.max(0, time - previousUpdateTime);
    previousUpdateTime = time;
    if (reducedMotion) camera.position.copy(desiredCameraPosition);
    else camera.position.lerp(desiredCameraPosition, getCameraFollowBlend(deltaSeconds, quality.tier));

    camera.lookAt(cameraLookTarget);
  }

  function setFocusedArtwork(id: string | null): void {
    if (focusedArtworkId === id) return;
    focusedArtworkId = id;

    for (const [artworkId, frame] of frameStates) {
      const isFocused = artworkId === id;
      frame.group.scale.setScalar(isFocused ? 1.045 : 1);
      frame.frameMaterial.emissive.setHex(isFocused ? 0xffffff : 0x000000);
      frame.frameMaterial.emissiveIntensity = isFocused ? 0.34 : 0;
      frame.artworkMaterial.emissive.setHex(isFocused ? 0xffffff : 0x000000);
      frame.artworkMaterial.emissiveIntensity = isFocused ? 0.075 : 0;
      frame.artworkMaterial.needsUpdate = true;
    }
  }

  function resize(width: number, height: number): void {
    viewportAspect = safeAspect(width, height);
    camera.aspect = viewportAspect;
    camera.fov = getResponsiveCameraFov(width, height, quality.tier);
    camera.updateProjectionMatrix();
  }

  function dispose(): void {
    if (construction.disposed) return;
    construction.disposed = true;
    disposeSceneResources(scene, directionalLight);

    frameStates.clear();
    artworkFrames.clear();
  }

  return {
    scene,
    camera,
    character: rig.group,
    artworkFrames,
    ready,
    updateCharacter,
    setFocusedArtwork,
    resize,
    dispose,
  };
}

function addViewingMarkers(scene: THREE.Scene): void {
  const markers = new THREE.Group();
  markers.name = "Artwork viewing markers";
  scene.add(markers);
  const geometry = new THREE.RingGeometry(0.5, 0.565, 64);
  const material = new THREE.MeshBasicMaterial({
    color: 0x0a0a0a,
    transparent: true,
    opacity: 0.88,
    side: THREE.DoubleSide,
    depthWrite: false,
  });

  for (const artwork of portfolioWorks) {
    const marker = new THREE.Mesh(geometry, material);
    marker.name = `Viewing marker: ${artwork.id}`;
    marker.rotation.x = -Math.PI / 2;
    marker.position.set(artwork.position.x, 0.014, artwork.position.y);
    markers.add(marker);
  }
}

function addPitchedRoof(
  architecture: THREE.Group,
  roomHalfWidth: number,
  roomDepth: number,
  roomCenterZ: number,
  blackMaterial: THREE.Material,
  maxAnisotropy: number,
): void {
  const roofRise = 2.15;
  const pitch = Math.atan2(roofRise, roomHalfWidth);
  const panelWidth = Math.hypot(roomHalfWidth, roofRise);
  const ridgeY = WALL_HEIGHT + roofRise;
  const glassMaterial = new THREE.MeshStandardMaterial({
    color: 0xe9eceb,
    roughness: 0.42,
    metalness: 0,
  });
  const ceilingTexture = createCeilingPlankTexture(0xe6c793);
  ceilingTexture.repeat.set(Math.max(1, panelWidth / 1.4), Math.max(1, roomDepth / CEILING_TILE_WORLD_LENGTH));
  ceilingTexture.anisotropy = maxAnisotropy;
  const ceilingMaterial = new THREE.MeshStandardMaterial({ map: ceilingTexture, roughness: 0.82, metalness: 0 });
  const beamCount = Math.max(3, Math.round(roomDepth / 3.2));
  for (const side of [-1, 1] as const) {
    const panel = new THREE.Mesh(
      new THREE.BoxGeometry(panelWidth, 0.1, roomDepth),
      ceilingMaterial,
    );
    panel.name = side < 0 ? "Left pitched ceiling" : "Right pitched ceiling";
    panel.position.set(side * roomHalfWidth * 0.5, WALL_HEIGHT + roofRise * 0.5, roomCenterZ);
    panel.rotation.z = -side * pitch;
    architecture.add(panel);

    // Exposed rafters crossing the pitch — real structural definition
    // instead of a bare plane, and it pairs naturally with the brick walls
    // and black rail trim for a converted-industrial gallery look.
    for (let index = 0; index <= beamCount; index += 1) {
      const beam = new THREE.Mesh(new THREE.BoxGeometry(panelWidth + 0.08, 0.12, 0.14), blackMaterial);
      beam.name = `${side < 0 ? "Left" : "Right"} ceiling rafter ${index + 1}`;
      beam.position.set(
        side * roomHalfWidth * 0.5,
        WALL_HEIGHT + roofRise * 0.5 - 0.07,
        THREE.MathUtils.lerp(roomCenterZ - roomDepth / 2 + 0.6, roomCenterZ + roomDepth / 2 - 0.6, index / beamCount),
      );
      beam.rotation.z = -side * pitch;
      architecture.add(beam);
    }

    const skylightCount = 3;
    for (let index = 0; index < skylightCount; index += 1) {
      const frame = new THREE.Group();
      frame.name = `${side < 0 ? "Left" : "Right"} skylight frame ${index + 1}`;
      frame.position.set(
        side * roomHalfWidth * 0.53,
        WALL_HEIGHT + roofRise * 0.54 + 0.045,
        roomCenterZ + (index - 1) * roomDepth * 0.27,
      );
      frame.rotation.z = -side * pitch;

      const glass = new THREE.Mesh(new THREE.BoxGeometry(1.45, 0.045, 2.05), glassMaterial);
      glass.name = `${frame.name} glass`;
      frame.add(glass);
      for (const z of [-1.06, 1.06]) {
        const border = new THREE.Mesh(new THREE.BoxGeometry(1.65, 0.075, 0.1), blackMaterial);
        border.position.z = z;
        frame.add(border);
      }
      for (const x of [-0.78, 0.78]) {
        const border = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.075, 2.22), blackMaterial);
        border.position.x = x;
        frame.add(border);
      }
      architecture.add(frame);
    }
  }

  const ridge = new THREE.Mesh(new THREE.BoxGeometry(0.11, 0.11, roomDepth), blackMaterial);
  ridge.name = "Ceiling ridge rail";
  ridge.position.set(0, ridgeY + 0.025, roomCenterZ);
  architecture.add(ridge);
}

function addCeilingLights(
  scene: THREE.Scene,
  architecture: THREE.Group,
  roomMinZ: number,
  roomMaxZ: number,
  isMobile: boolean,
): void {
  const fixtureY = WALL_HEIGHT + 1.55;
  const shadeGeometry = new THREE.CylinderGeometry(0.22, 0.16, 0.28, 24, 1, true);
  const shadeMaterial = new THREE.MeshStandardMaterial({ color: 0x161616, roughness: 0.4, metalness: 0.4, side: THREE.DoubleSide });
  const bulbGeometry = new THREE.SphereGeometry(0.1, 20, 20);
  const bulbMaterial = new THREE.MeshStandardMaterial({ color: 0xfff0d4, emissive: 0xffb457, emissiveIntensity: 2.4, roughness: 0.25 });

  const count = 4;
  for (let index = 0; index < count; index += 1) {
    const z = THREE.MathUtils.lerp(roomMinZ + 1.5, roomMaxZ - 1.5, index / (count - 1));
    const fixture = new THREE.Group();
    fixture.name = `Ceiling pendant light ${index + 1}`;
    fixture.position.set(0, fixtureY, z);
    architecture.add(fixture);

    const cord = new THREE.Mesh(new THREE.CylinderGeometry(0.015, 0.015, 0.5, 6), shadeMaterial);
    cord.position.y = 0.25;
    fixture.add(cord);

    const shade = new THREE.Mesh(shadeGeometry, shadeMaterial);
    fixture.add(shade);

    const bulb = new THREE.Mesh(bulbGeometry, bulbMaterial);
    bulb.position.y = -0.12;
    fixture.add(bulb);

    {
      const glow = new THREE.PointLight(0xffc27a, isMobile ? 4 : 6, 6.5, 2);
      glow.position.set(0, fixtureY - 0.15, z);
      scene.add(glow);
    }
  }
}

function createArtworkFrame(
  scene: THREE.Scene,
  artwork: GalleryArtwork,
  roomHalfWidth: number,
  frameBarGeometry: THREE.BoxGeometry,
  artworkBackingGeometry: THREE.BoxGeometry,
  artworkPlaneGeometry: THREE.PlaneGeometry,
  textureLoader: THREE.TextureLoader,
  isDisposed: () => boolean,
  maxAnisotropy: number,
): ArtworkFrameResult {
  const { width, height } = artwork.dimensions;
  const group = new THREE.Group();
  group.name = `Artwork: ${artwork.title}`;
  scene.add(group);
  group.position.set(
    artwork.wallSide === "left" ? -roomHalfWidth + 0.13 : roomHalfWidth - 0.13,
    2.55,
    artwork.zPosition,
  );
  group.rotation.y = artwork.wallSide === "left" ? Math.PI / 2 : -Math.PI / 2;

  const frameMaterial = new THREE.MeshStandardMaterial({
    color: 0x101010,
    roughness: 0.72,
    metalness: 0.08,
    emissive: 0x000000,
  });
  const backingMaterial = new THREE.MeshStandardMaterial({ color: 0x080808, roughness: 0.86 });
  const artworkMaterial = new THREE.MeshStandardMaterial({
    color: 0xffffff,
    roughness: 0.88,
    metalness: 0,
    emissive: 0x000000,
    side: THREE.FrontSide,
  });

  const horizontalScale = new THREE.Vector3(width + FRAME_BORDER * 2, FRAME_BORDER, FRAME_DEPTH);
  const verticalScale = new THREE.Vector3(FRAME_BORDER, height, FRAME_DEPTH);
  for (const y of [-(height + FRAME_BORDER) / 2, (height + FRAME_BORDER) / 2]) {
    const bar = new THREE.Mesh(frameBarGeometry, frameMaterial);
    bar.scale.copy(horizontalScale);
    bar.position.set(0, y, 0);
    group.add(bar);
  }
  for (const x of [-(width + FRAME_BORDER) / 2, (width + FRAME_BORDER) / 2]) {
    const bar = new THREE.Mesh(frameBarGeometry, frameMaterial);
    bar.scale.copy(verticalScale);
    bar.position.set(x, 0, 0);
    group.add(bar);
  }

  const backing = new THREE.Mesh(artworkBackingGeometry, backingMaterial);
  backing.scale.set(width, height, 1);
  backing.position.z = -FRAME_DEPTH * 0.3;
  group.add(backing);

  const mat = new THREE.Mesh(
    artworkPlaneGeometry,
    new THREE.MeshStandardMaterial({ color: 0xfaf9f5, roughness: 0.94 }),
  );
  mat.name = "Artwork presentation mat";
  mat.scale.set(width + 0.34, height + 0.34, 1);
  mat.position.z = FRAME_DEPTH * 0.43;
  group.add(mat);

  const image = new THREE.Mesh(artworkPlaneGeometry, artworkMaterial);
  image.name = `${artwork.title} image`;
  image.scale.set(width, height, 1);
  image.position.z = FRAME_DEPTH * 0.56;
  group.add(image);

  const textureLoadError = (cause: unknown) => (
    new Error(`Artwork ${artwork.id} texture failed to load`, { cause })
  );
  let texture: THREE.Texture | undefined;
  const ready = new Promise<void>((resolve, reject) => {
    try {
      texture = textureLoader.load(
        artwork.imageSrc,
        (loadedTexture) => {
          if (isDisposed()) {
            loadedTexture.dispose();
            resolve();
            return;
          }
          loadedTexture.colorSpace = THREE.SRGBColorSpace;
          loadedTexture.anisotropy = maxAnisotropy;
          artworkMaterial.map = loadedTexture;
          artworkMaterial.emissiveMap = loadedTexture;
          artworkMaterial.needsUpdate = true;
          resolve();
        },
        undefined,
        (cause) => {
          reject(textureLoadError(cause));
        }
      );
    } catch (cause) {
      reject(textureLoadError(cause));
    }
  });
  // TextureLoader returns the same placeholder that it fills asynchronously.
  // Applying it now lets Three upload the completed image on the first ready render.
  if (texture) {
    texture.colorSpace = THREE.SRGBColorSpace;
    texture.anisotropy = maxAnisotropy;
    artworkMaterial.map = texture;
    artworkMaterial.emissiveMap = texture;
  }

  return {
    frame: { group, frameMaterial, artworkMaterial },
    ready,
  };
}

function addServiceWall(scene: THREE.Scene, frontWallZ: number, maxAnisotropy: number): void {
  const wallCopy = new THREE.Group();
  wallCopy.name = "Design services wall copy";
  wallCopy.position.set(0, 0, frontWallZ + 0.101);
  scene.add(wallCopy);

  const heading = createTextPanel("COMPASSNCREW / DESIGN STUDIO", {
    width: 1920,
    height: 232,
    font: "600 96px Arial, sans-serif",
    letterSpacing: 10,
  }, maxAnisotropy);
  heading.name = "Services wall heading";
  heading.scale.set(6.45, 0.79, 1);
  heading.position.set(0, 4.28, 0);
  wallCopy.add(heading);

  const statement = createTextPanel("IDENTITIES, CAMPAIGNS, AND DIGITAL EXPERIENCES BUILT TO MOVE.", {
    width: 2160,
    height: 184,
    font: "400 56px Arial, sans-serif",
    letterSpacing: 4,
  }, maxAnisotropy);
  statement.name = "Services wall statement";
  statement.scale.set(6.75, 0.58, 1);
  statement.position.set(0, 3.48, 0);
  wallCopy.add(statement);

  designServices.forEach((service, index) => {
    const label = createTextPanel(`${String(index + 1).padStart(2, "0")}  ${service.toUpperCase()}`, {
      width: 1640,
      height: 208,
      font: "500 84px Arial, sans-serif",
      letterSpacing: 6,
    }, maxAnisotropy);
    label.name = `Services wall item ${index + 1}`;
    label.scale.set(5.95, 0.74, 1);
    label.position.set(0, 2.5 - index * 0.7, 0);
    wallCopy.add(label);
  });
}

function createTextPanel(
  text: string,
  options: { width: number; height: number; font: string; letterSpacing: number },
  maxAnisotropy: number,
): THREE.Mesh<THREE.PlaneGeometry, THREE.MeshBasicMaterial> {
  const canvas = document.createElement("canvas");
  canvas.width = options.width;
  canvas.height = options.height;
  const context = canvas.getContext("2d");
  if (!context) throw new Error("Unable to create gallery text texture");

  context.clearRect(0, 0, canvas.width, canvas.height);
  context.font = options.font;
  context.textAlign = "center";
  context.textBaseline = "middle";

  // Embossed relief: a dark recessed shadow and a light raised highlight,
  // offset either side of the main fill, fake carved-into-the-wall depth
  // on what is otherwise a flat texture.
  const cx = canvas.width / 2;
  const cy = canvas.height / 2;
  const depth = Math.max(1.5, options.height * 0.018);

  context.fillStyle = "rgba(0, 0, 0, 0.5)";
  drawLetterSpacedText(context, text, cx + depth, cy + depth, options.letterSpacing);

  context.fillStyle = "rgba(255, 255, 255, 0.55)";
  drawLetterSpacedText(context, text, cx - depth * 0.6, cy - depth * 0.6, options.letterSpacing);

  context.fillStyle = "#111111";
  drawLetterSpacedText(context, text, cx, cy, options.letterSpacing);

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.minFilter = THREE.LinearMipmapLinearFilter;
  texture.generateMipmaps = true;
  texture.anisotropy = maxAnisotropy;
  texture.userData.generatedCanvas = canvas;
  const material = new THREE.MeshBasicMaterial({ map: texture, transparent: true, depthWrite: false });
  return new THREE.Mesh(new THREE.PlaneGeometry(1, 1), material);
}

function drawLetterSpacedText(
  context: CanvasRenderingContext2D,
  text: string,
  centerX: number,
  centerY: number,
  spacing: number,
): void {
  const glyphs = Array.from(text);
  const measuredWidth = glyphs.reduce((width, glyph) => width + context.measureText(glyph).width, 0);
  const totalWidth = measuredWidth + Math.max(0, glyphs.length - 1) * spacing;
  let cursor = centerX - totalWidth / 2;
  context.textAlign = "left";
  for (const glyph of glyphs) {
    context.fillText(glyph, cursor, centerY);
    cursor += context.measureText(glyph).width + spacing;
  }
}

function createCharacterRig(scene: THREE.Scene): CharacterRig {
  const group = new THREE.Group();
  group.name = "Sketch character";
  scene.add(group);

  const inkMaterial = new THREE.MeshStandardMaterial({ color: 0x080808, roughness: 0.93, flatShading: true });
  const shadowMaterial = new THREE.MeshBasicMaterial({
    color: 0x000000,
    transparent: true,
    opacity: 0.17,
    depthWrite: false,
  });

  const shadow = new THREE.Mesh(new THREE.CircleGeometry(0.58, 20), shadowMaterial);
  shadow.name = "Character blob shadow";
  shadow.rotation.x = -Math.PI / 2;
  shadow.scale.set(1.25, 0.7, 1);
  shadow.position.y = 0.012;
  group.add(shadow);

  const body = new THREE.Mesh(new THREE.CapsuleGeometry(0.19, 0.44, 5, 10), inkMaterial);
  body.name = "Character torso";
  body.position.y = 0.76;
  body.rotation.z = -0.04;
  group.add(body);

  const headGeometry = new THREE.SphereGeometry(0.34, 16, 12);
  const head = new THREE.Mesh(headGeometry, inkMaterial);
  head.name = "Irregular sketch head";
  head.position.set(0.02, 1.36, 0);
  head.rotation.set(0.08, -0.12, -0.06);
  group.add(head);

  const scribbleMaterial = new THREE.MeshBasicMaterial({ color: 0x050505 });
  for (let index = 0; index < 14; index += 1) {
    const loop = new THREE.Mesh(
      new THREE.TorusGeometry(0.35 + Math.sin(index * 2.13) * 0.035, 0.008, 4, 28),
      scribbleMaterial,
    );
    loop.name = `Sketch head line ${index + 1}`;
    loop.position.set(
      0.02 + Math.sin(index * 4.17) * 0.035,
      1.36 + Math.cos(index * 2.81) * 0.035,
      Math.sin(index * 1.73) * 0.025,
    );
    loop.rotation.set(index * 0.71, index * 1.13, index * 0.37);
    group.add(loop);
  }

  const leftArm = createLimbPivot("Left arm", -0.24, 1.0, 0.08, 0.36, inkMaterial);
  const rightArm = createLimbPivot("Right arm", 0.24, 1.0, -0.06, 0.36, inkMaterial);
  const leftLeg = createLimbPivot("Left leg", -0.105, 0.5, 0.04, 0.42, inkMaterial);
  const rightLeg = createLimbPivot("Right leg", 0.105, 0.5, -0.04, 0.42, inkMaterial);
  group.add(leftArm, rightArm, leftLeg, rightLeg);

  group.position.y = CHARACTER_BASE_Y;
  group.scale.setScalar(0.88);
  return { group, leftArm, rightArm, leftLeg, rightLeg };
}

function createLimbPivot(
  name: string,
  x: number,
  y: number,
  z: number,
  length: number,
  material: THREE.Material,
): THREE.Group {
  const pivot = new THREE.Group();
  pivot.name = `${name} pivot`;
  pivot.position.set(x, y, z);
  const limb = new THREE.Mesh(new THREE.CapsuleGeometry(0.075, length, 2, 5), material);
  limb.name = name;
  limb.position.y = -length / 2;
  limb.rotation.z = name.includes("Left") ? -0.08 : 0.08;
  pivot.add(limb);
  return pivot;
}

function collectMaterialTextures(material: THREE.Material, textures: Set<THREE.Texture>): void {
  for (const value of Object.values(material)) {
    if (value instanceof THREE.Texture) textures.add(value);
  }
}

function disposeSceneResources(
  scene: THREE.Scene,
  directionalLight: THREE.DirectionalLight | null,
): void {
  const geometries = new Set<THREE.BufferGeometry>();
  const materials = new Set<THREE.Material>();
  const textures = new Set<THREE.Texture>();

  scene.traverse((object) => {
    if (!(object instanceof THREE.Mesh)) return;
    geometries.add(object.geometry);
    const meshMaterials = Array.isArray(object.material) ? object.material : [object.material];
    for (const material of meshMaterials) {
      materials.add(material);
      collectMaterialTextures(material, textures);
    }
  });

  for (const texture of textures) {
    const canvas = texture.userData.generatedCanvas;
    if (typeof HTMLCanvasElement !== "undefined" && canvas instanceof HTMLCanvasElement) {
      canvas.width = 0;
      canvas.height = 0;
    }
    texture.dispose();
  }
  for (const material of materials) material.dispose();
  for (const geometry of geometries) geometry.dispose();
  directionalLight?.shadow.dispose();
  scene.clear();
}

function safeAspect(width: number, height: number): number {
  return Math.max(1, width) / Math.max(1, height);
}
