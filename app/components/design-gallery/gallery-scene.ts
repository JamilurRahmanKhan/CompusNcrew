import * as THREE from "three";

import type { CharacterState, GalleryBounds, QualityTier } from "./gallery-controller";
import { designServices, portfolioWorks, type GalleryArtwork } from "./gallery-data";

export interface GallerySceneOptions {
  width: number;
  height: number;
  bounds: GalleryBounds;
  quality: QualityTier;
}

export interface GallerySceneHandle {
  scene: THREE.Scene;
  camera: THREE.PerspectiveCamera;
  character: THREE.Group;
  artworkFrames: ReadonlyMap<string, THREE.Group>;
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

interface GallerySceneConstruction {
  scene: THREE.Scene;
  directionalLight: THREE.DirectionalLight | null;
  disposed: boolean;
}

const WALL_HEIGHT = 5.6;
const WALL_PADDING = 1.35;
const FRONT_WALL_PADDING = 2.1;
const FRAME_DEPTH = 0.12;
const FRAME_BORDER = 0.12;
const CHARACTER_BASE_Y = 0.08;
const CAMERA_FOLLOW_RESPONSE: Record<QualityTier["tier"], number> = {
  mobile: 10,
  balanced: 7,
  desktop: 5.5,
};

export function getCameraFollowBlend(deltaSeconds: number, tier: QualityTier["tier"]): number {
  const boundedDelta = THREE.MathUtils.clamp(deltaSeconds, 0, 0.1);
  return 1 - Math.exp(-CAMERA_FOLLOW_RESPONSE[tier] * boundedDelta);
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
  const { bounds, quality } = options;
  const roomHalfWidth = Math.max(Math.abs(bounds.minX), Math.abs(bounds.maxX)) + WALL_PADDING;
  const roomMinZ = bounds.minY - FRONT_WALL_PADDING;
  const roomMaxZ = bounds.maxY + WALL_PADDING;
  const roomDepth = roomMaxZ - roomMinZ;
  const roomCenterZ = (roomMinZ + roomMaxZ) / 2;
  const { scene } = construction;
  scene.background = new THREE.Color(0xf3f1eb);
  scene.fog = new THREE.Fog(0xf3f1eb, quality.tier === "mobile" ? 16 : 22, quality.tier === "mobile" ? 34 : 46);

  const camera = new THREE.PerspectiveCamera(43, safeAspect(options.width, options.height), 0.1, quality.tier === "mobile" ? 42 : 58);
  camera.position.set(0, 3.4, Math.min(roomMaxZ - 0.5, bounds.maxY + 5.5));
  camera.lookAt(0, 1.15, bounds.maxY - 2.5);

  const architecture = new THREE.Group();
  architecture.name = "Gallery architecture";
  scene.add(architecture);

  const plasterMaterial = new THREE.MeshStandardMaterial({ color: 0xf5f3ed, roughness: 0.92, metalness: 0 });
  const floorMaterial = new THREE.MeshStandardMaterial({ color: 0xe8e5dd, roughness: 0.96, metalness: 0 });
  const blackMaterial = new THREE.MeshStandardMaterial({ color: 0x111111, roughness: 0.78, metalness: 0.03 });
  const floorGeometry = new THREE.PlaneGeometry(roomHalfWidth * 2, roomDepth);
  const wallGeometry = new THREE.BoxGeometry(0.18, WALL_HEIGHT, roomDepth);
  const frontWallGeometry = new THREE.BoxGeometry(roomHalfWidth * 2 + 0.18, WALL_HEIGHT, 0.18);
  const unitBoxGeometry = new THREE.BoxGeometry(1, 1, 1);

  const floor = new THREE.Mesh(floorGeometry, floorMaterial);
  floor.name = "Gallery floor";
  floor.rotation.x = -Math.PI / 2;
  floor.position.z = roomCenterZ;
  floor.receiveShadow = quality.tier !== "mobile";
  architecture.add(floor);

  for (const side of [-1, 1] as const) {
    const wall = new THREE.Mesh(wallGeometry, plasterMaterial);
    wall.name = side < 0 ? "Left gallery wall" : "Right gallery wall";
    wall.position.set(side * roomHalfWidth, WALL_HEIGHT / 2, roomCenterZ);
    wall.receiveShadow = quality.tier !== "mobile";
    architecture.add(wall);

    const rail = new THREE.Mesh(unitBoxGeometry, blackMaterial);
    rail.name = `${wall.name} rail`;
    rail.scale.set(0.08, 0.08, roomDepth - 0.6);
    rail.position.set(side * (roomHalfWidth - 0.14), 1.02, roomCenterZ);
    architecture.add(rail);
  }

  const frontWall = new THREE.Mesh(frontWallGeometry, plasterMaterial);
  frontWall.name = "Services wall";
  frontWall.position.set(0, WALL_HEIGHT / 2, roomMinZ);
  frontWall.receiveShadow = quality.tier !== "mobile";
  architecture.add(frontWall);

  const beamCount = quality.tier === "mobile" ? 3 : 6;
  for (let index = 0; index < beamCount; index += 1) {
    const beam = new THREE.Mesh(unitBoxGeometry, blackMaterial);
    const progress = index / (beamCount - 1);
    beam.name = `Roof beam ${index + 1}`;
    beam.scale.set(roomHalfWidth * 2, 0.1, 0.1);
    beam.position.set(0, WALL_HEIGHT - 0.12, THREE.MathUtils.lerp(roomMinZ + 0.4, roomMaxZ - 0.4, progress));
    architecture.add(beam);
  }

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
    directionalLight.shadow.mapSize.set(1024, 1024);
    directionalLight.shadow.camera.near = 1;
    directionalLight.shadow.camera.far = 40;
    directionalLight.shadow.camera.left = -9;
    directionalLight.shadow.camera.right = 9;
    directionalLight.shadow.camera.top = 14;
    directionalLight.shadow.camera.bottom = -4;
  }
  scene.add(directionalLight, directionalLight.target);

  addServiceWall(scene, roomMinZ);

  const frameStates = new Map<string, ArtworkFrameState>();
  const artworkFrames = new Map<string, THREE.Group>();
  const frameBarGeometry = new THREE.BoxGeometry(1, 1, FRAME_DEPTH);
  const artworkBackingGeometry = new THREE.BoxGeometry(1, 1, FRAME_DEPTH * 0.55);
  const artworkPlaneGeometry = new THREE.PlaneGeometry(1, 1);
  const textureLoader = new THREE.TextureLoader();

  for (const artwork of portfolioWorks) {
    const frameState = createArtworkFrame(
      scene,
      artwork,
      roomHalfWidth,
      frameBarGeometry,
      artworkBackingGeometry,
      artworkPlaneGeometry,
      textureLoader,
      () => construction.disposed,
    );
    frameStates.set(artwork.id, frameState);
    artworkFrames.set(artwork.id, frameState.group);
  }

  const rig = createCharacterRig(scene);

  let focusedArtworkId: string | null = null;
  let previousUpdateTime: number | null = null;
  const desiredCameraPosition = new THREE.Vector3();
  const cameraLookTarget = new THREE.Vector3();

  function updateCharacter(state: CharacterState, time: number, reducedMotion: boolean): void {
    const depth = state.position.y;
    rig.group.position.set(state.position.x, CHARACTER_BASE_Y + state.bobOffset, depth);
    rig.group.scale.x = state.facing === "left" ? -1 : 1;

    const speed = Math.hypot(state.velocity.x, state.velocity.y);
    const walkStrength = reducedMotion ? 0 : THREE.MathUtils.clamp(speed / 4, 0, 1);
    const stride = reducedMotion ? 0 : Math.sin(time * 8.5) * 0.52 * walkStrength;
    rig.leftArm.rotation.x = stride;
    rig.rightArm.rotation.x = -stride;
    rig.leftLeg.rotation.x = -stride * 0.72;
    rig.rightLeg.rotation.x = stride * 0.72;

    desiredCameraPosition.set(state.position.x, 3.4, depth + 6.25);
    const deltaSeconds = previousUpdateTime === null ? 1 / 60 : Math.max(0, time - previousUpdateTime);
    previousUpdateTime = time;
    if (reducedMotion) camera.position.copy(desiredCameraPosition);
    else camera.position.lerp(desiredCameraPosition, getCameraFollowBlend(deltaSeconds, quality.tier));

    cameraLookTarget.set(state.position.x, 1.12, depth - 2.6);
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
    camera.aspect = safeAspect(width, height);
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
    updateCharacter,
    setFocusedArtwork,
    resize,
    dispose,
  };
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
): ArtworkFrameState {
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

  const image = new THREE.Mesh(artworkPlaneGeometry, artworkMaterial);
  image.name = `${artwork.title} image`;
  image.scale.set(width, height, 1);
  image.position.z = FRAME_DEPTH * 0.56;
  group.add(image);

  const texture = textureLoader.load(
    artwork.imageSrc,
    (loadedTexture) => {
      if (isDisposed()) {
        loadedTexture.dispose();
        return;
      }
      loadedTexture.colorSpace = THREE.SRGBColorSpace;
      loadedTexture.anisotropy = 4;
      artworkMaterial.map = loadedTexture;
      artworkMaterial.emissiveMap = loadedTexture;
      artworkMaterial.needsUpdate = true;
    },
  );
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = 4;
  artworkMaterial.map = texture;
  artworkMaterial.emissiveMap = texture;

  return { group, frameMaterial, artworkMaterial };
}

function addServiceWall(scene: THREE.Scene, frontWallZ: number): void {
  const wallCopy = new THREE.Group();
  wallCopy.name = "Design services wall copy";
  wallCopy.position.set(0, 0, frontWallZ + 0.101);
  scene.add(wallCopy);

  const heading = createTextPanel("COMPASSNCREW / DESIGN STUDIO", {
    width: 960,
    height: 116,
    font: "600 48px Arial, sans-serif",
    letterSpacing: 5,
  });
  heading.scale.set(5.5, 0.66, 1);
  heading.position.set(0, 4.15, 0);
  wallCopy.add(heading);

  const statement = createTextPanel("IDENTITIES, CAMPAIGNS, AND DIGITAL EXPERIENCES BUILT TO MOVE.", {
    width: 1080,
    height: 92,
    font: "400 28px Arial, sans-serif",
    letterSpacing: 2,
  });
  statement.scale.set(6.15, 0.52, 1);
  statement.position.set(0, 3.47, 0);
  wallCopy.add(statement);

  designServices.forEach((service, index) => {
    const label = createTextPanel(`${String(index + 1).padStart(2, "0")}  ${service.toUpperCase()}`, {
      width: 820,
      height: 104,
      font: "500 42px Arial, sans-serif",
      letterSpacing: 3,
    });
    label.scale.set(4.7, 0.6, 1);
    label.position.set(0, 2.54 - index * 0.66, 0);
    wallCopy.add(label);
  });
}

function createTextPanel(
  text: string,
  options: { width: number; height: number; font: string; letterSpacing: number },
): THREE.Mesh<THREE.PlaneGeometry, THREE.MeshBasicMaterial> {
  const canvas = document.createElement("canvas");
  canvas.width = options.width;
  canvas.height = options.height;
  const context = canvas.getContext("2d");
  if (!context) throw new Error("Unable to create gallery text texture");

  context.clearRect(0, 0, canvas.width, canvas.height);
  context.fillStyle = "#111111";
  context.font = options.font;
  context.textAlign = "center";
  context.textBaseline = "middle";
  drawLetterSpacedText(context, text, canvas.width / 2, canvas.height / 2, options.letterSpacing);

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.minFilter = THREE.LinearFilter;
  texture.generateMipmaps = false;
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

  const body = new THREE.Mesh(new THREE.CapsuleGeometry(0.25, 0.54, 3, 7), inkMaterial);
  body.name = "Character torso";
  body.position.y = 0.92;
  body.rotation.z = -0.04;
  group.add(body);

  const headGeometry = new THREE.IcosahedronGeometry(0.48, 1);
  const positions = headGeometry.attributes.position;
  for (let index = 0; index < positions.count; index += 1) {
    const x = positions.getX(index);
    const y = positions.getY(index);
    const z = positions.getZ(index);
    const wobble = 1 + Math.sin(index * 12.9898) * 0.065;
    positions.setXYZ(index, x * wobble * 1.08, y * wobble, z * wobble * 0.92);
  }
  positions.needsUpdate = true;
  headGeometry.computeVertexNormals();
  const head = new THREE.Mesh(headGeometry, inkMaterial);
  head.name = "Irregular sketch head";
  head.position.set(0.03, 1.72, 0);
  head.rotation.set(0.08, -0.12, -0.06);
  group.add(head);

  const leftArm = createLimbPivot("Left arm", -0.31, 1.23, 0.1, 0.46, inkMaterial);
  const rightArm = createLimbPivot("Right arm", 0.31, 1.23, -0.08, 0.46, inkMaterial);
  const leftLeg = createLimbPivot("Left leg", -0.14, 0.67, 0.06, 0.56, inkMaterial);
  const rightLeg = createLimbPivot("Right leg", 0.14, 0.67, -0.06, 0.56, inkMaterial);
  group.add(leftArm, rightArm, leftLeg, rightLeg);

  group.position.y = CHARACTER_BASE_Y;
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
