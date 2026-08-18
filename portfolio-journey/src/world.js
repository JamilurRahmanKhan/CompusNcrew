import * as THREE from 'three';
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js';
import { OBJLoader } from 'three/addons/loaders/OBJLoader.js';
import { MTLLoader } from 'three/addons/loaders/MTLLoader.js';
import { COLORS, DISTRICTS, PROJECTS, ROAD_POINTS, WORLD_BOUNDS } from './data.js';

const Y_AXIS = new THREE.Vector3(0, 1, 0);

function material(color, roughness = 0.82, metalness = 0.05) {
  return new THREE.MeshStandardMaterial({ color, roughness, metalness });
}

function roundedMesh(width, height, depth, color, radius = 0.3, segments = 3) {
  const mesh = new THREE.Mesh(
    new RoundedBoxGeometry(width, height, depth, segments, Math.min(radius, height * 0.42)),
    material(color),
  );
  mesh.castShadow = true;
  mesh.receiveShadow = true;
  return mesh;
}

function createCanvasTexture(draw, width = 512, height = 320) {
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const context = canvas.getContext('2d');
  draw(context, width, height);
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = 4;
  return texture;
}

function createProjectTexture(project, dark = true) {
  return createCanvasTexture((context, width, height) => {
    context.fillStyle = dark ? '#171a1c' : '#e9e2d5';
    context.fillRect(0, 0, width, height);
    context.fillStyle = '#dc7431';
    context.font = '700 15px ui-monospace, monospace';
    context.fillText(`${project.number} / ${project.category.toUpperCase()}`, 30, 37);
    context.fillStyle = dark ? '#f4ead6' : '#26282a';
    context.font = '500 38px Georgia, serif';
    context.fillText(project.title, 30, 88);
    context.fillStyle = dark ? '#8f8b84' : '#746d64';
    context.font = '15px Segoe UI, sans-serif';
    context.fillText('PROJECT MOCKUP BAY', 30, 117);

    const accent = '#dc7431';
    context.strokeStyle = dark ? '#3b3e40' : '#c7bdad';
    context.lineWidth = 2;
    context.strokeRect(30, 142, width - 60, 126);
    context.fillStyle = dark ? '#222629' : '#d9d0c2';
    context.fillRect(47, 160, 126, 88);
    context.fillStyle = accent;
    context.fillRect(190, 160, width - 237, 12);
    context.fillStyle = dark ? '#656967' : '#aaa093';
    context.fillRect(190, 188, width - 276, 8);
    context.fillRect(190, 211, width - 252, 8);
    context.fillRect(190, 234, 92, 8);
    context.fillStyle = dark ? '#87837c' : '#766f65';
    context.font = '12px Segoe UI, sans-serif';
    context.fillText('Replace with your final project visual', 30, 296);
  });
}

function createSignTexture(title, subtitle, accent = '#dc7431') {
  return createCanvasTexture((context, width, height) => {
    context.clearRect(0, 0, width, height);
    context.fillStyle = 'rgba(17,19,21,.94)';
    context.beginPath();
    context.roundRect(8, 8, width - 16, height - 16, 22);
    context.fill();
    context.strokeStyle = 'rgba(244,234,214,.2)';
    context.lineWidth = 2;
    context.stroke();
    context.fillStyle = accent;
    context.font = '700 18px ui-monospace, monospace';
    context.fillText(subtitle, 30, 48);
    context.fillStyle = '#f4ead6';
    context.font = '400 44px Georgia, serif';
    context.fillText(title, 30, 104);
  }, 540, 132);
}

function createStopBayTexture(project) {
  return createCanvasTexture((context, width, height) => {
    context.clearRect(0, 0, width, height);
    context.strokeStyle = '#dc7431';
    context.lineWidth = 14;
    context.setLineDash([34, 18]);
    context.strokeRect(18, 18, width - 36, height - 36);
    context.setLineDash([]);
    context.fillStyle = 'rgba(220,116,49,.14)';
    context.fillRect(25, 25, width - 50, height - 50);
    context.fillStyle = '#f4ead6';
    context.font = '800 52px ui-monospace, monospace';
    context.textAlign = 'center';
    context.fillText('STOP HERE', width / 2, 142);
    context.fillStyle = '#dc7431';
    context.font = '800 82px ui-monospace, monospace';
    context.fillText(project.number, width / 2, 234);
    context.beginPath();
    context.moveTo(width / 2, 284);
    context.lineTo(width / 2 - 42, 242);
    context.lineTo(width / 2 + 42, 242);
    context.closePath();
    context.fill();
  }, 512, 320);
}

function createRoadStopMarker(scene, project, roadPoint, tangent, side) {
  const normal = new THREE.Vector3(-tangent.z, 0, tangent.x);
  const heading = Math.atan2(tangent.x, tangent.z);
  const group = new THREE.Group();
  group.position.copy(roadPoint).addScaledVector(normal, side * 1.7).setY(0.155);
  group.rotation.y = heading;

  const bay = new THREE.Mesh(
    new THREE.PlaneGeometry(3.25, 5.1),
    new THREE.MeshBasicMaterial({ map: createStopBayTexture(project), transparent: true, depthWrite: false, toneMapped: false }),
  );
  bay.rotation.x = -Math.PI / 2;
  bay.rotation.z = Math.PI;
  bay.renderOrder = 4;
  group.add(bay);

  const sign = createSprite(createSignTexture(`Stop here · ${project.number}`, 'PROJECT SHOWCASE BAY'), 4.6, 1.12);
  sign.position.set(-side * 3.2, 2.75, 0);
  group.add(sign);

  const beacon = new THREE.Mesh(
    new THREE.CylinderGeometry(0.11, 0.11, 2.05, 8),
    new THREE.MeshStandardMaterial({ color: 0x403d38, roughness: 0.55, metalness: 0.28 }),
  );
  beacon.position.set(-side * 3.15, 1.05, 0);
  const beaconLight = new THREE.Mesh(
    new THREE.SphereGeometry(0.2, 12, 8),
    new THREE.MeshStandardMaterial({ color: COLORS.orange, emissive: COLORS.orange, emissiveIntensity: 1.2 }),
  );
  beaconLight.position.copy(beacon.position).setY(2.12);
  beaconLight.userData.stopBeacon = true;
  group.add(beacon, beaconLight);
  scene.add(group);
  return { group, bay, beaconLight };
}

function createSprite(texture, width, height) {
  const sprite = new THREE.Sprite(new THREE.SpriteMaterial({ map: texture, transparent: true, depthWrite: false }));
  sprite.scale.set(width, height, 1);
  return sprite;
}

function createRoadRibbon(curve, halfWidth, y, color, offset = 0, stripWidth = 0) {
  const samples = 720;
  const positions = [];
  const normals = [];
  const uvs = [];
  const indices = [];
  const effectiveHalf = stripWidth > 0 ? stripWidth * 0.5 : halfWidth;
  for (let index = 0; index <= samples; index += 1) {
    const t = index / samples;
    const point = curve.getPointAt(t);
    const tangent = curve.getTangentAt(t).normalize();
    const normal = new THREE.Vector3(-tangent.z, 0, tangent.x);
    const center = point.clone().addScaledVector(normal, offset);
    const left = center.clone().addScaledVector(normal, effectiveHalf);
    const right = center.clone().addScaledVector(normal, -effectiveHalf);
    positions.push(left.x, y, left.z, right.x, y, right.z);
    normals.push(0, 1, 0, 0, 1, 0);
    uvs.push(0, t * 48, 1, t * 48);
    if (index < samples) {
      const base = index * 2;
      indices.push(base, base + 2, base + 1, base + 2, base + 3, base + 1);
    }
  }
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
  geometry.setAttribute('normal', new THREE.Float32BufferAttribute(normals, 3));
  geometry.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2));
  geometry.setIndex(indices);
  const mesh = new THREE.Mesh(geometry, material(color, 0.95, 0));
  mesh.receiveShadow = true;
  return mesh;
}

function createRoad(scene) {
  const curve = new THREE.CatmullRomCurve3(
    ROAD_POINTS.map(([x, z]) => new THREE.Vector3(x, 0, z)),
    false,
    'catmullrom',
    0.38,
  );
  const halfWidth = 4.2;
  scene.add(createRoadRibbon(curve, halfWidth + 1.15, -0.02, COLORS.shoulder));
  scene.add(createRoadRibbon(curve, halfWidth, 0.04, COLORS.road));
  scene.add(createRoadRibbon(curve, 0, 0.13, COLORS.roadEdge, halfWidth + 0.27, 0.48));
  scene.add(createRoadRibbon(curve, 0, 0.13, COLORS.roadEdge, -(halfWidth + 0.27), 0.48));

  const dashGeometry = new THREE.BoxGeometry(0.18, 0.04, 1.7);
  const dashMaterial = material(COLORS.roadMark, 0.8, 0);
  const reflectorGeometry = new THREE.BoxGeometry(0.18, 0.11, 0.32);
  const reflectorMaterial = new THREE.MeshStandardMaterial({ color: 0xffe5b5, emissive: 0xffa75c, emissiveIntensity: 0.75 });
  for (let index = 6; index < 710; index += 9) {
    const t = index / 720;
    const point = curve.getPointAt(t);
    const tangent = curve.getTangentAt(t).normalize();
    const normal = new THREE.Vector3(-tangent.z, 0, tangent.x);
    const heading = Math.atan2(tangent.x, tangent.z);
    const dash = new THREE.Mesh(dashGeometry, dashMaterial);
    dash.position.set(point.x, 0.1, point.z);
    dash.rotation.y = heading;
    scene.add(dash);
    if (index % 18 === 6) {
      [-1, 1].forEach((side) => {
        const reflector = new THREE.Mesh(reflectorGeometry, reflectorMaterial);
        reflector.position.copy(point).addScaledVector(normal, side * 3.72).setY(0.19);
        reflector.rotation.y = heading;
        scene.add(reflector);
      });
    }
  }
  const samples = Array.from({ length: 560 }, (_, index) => curve.getPointAt(index / 559));
  return { curve, halfWidth, samples };
}

function seededRandom() {
  let seed = 44191;
  return () => {
    seed = (seed * 1664525 + 1013904223) % 4294967296;
    return seed / 4294967296;
  };
}

function createTreeInstances(scene, road) {
  const count = 280;
  const random = seededRandom();
  const trunks = new THREE.InstancedMesh(new THREE.CylinderGeometry(0.14, 0.24, 1.8, 7), material(COLORS.trunk), count);
  const canopies = new THREE.InstancedMesh(new THREE.IcosahedronGeometry(1, 1), material(COLORS.tree, 0.98), count);
  trunks.castShadow = true;
  canopies.castShadow = true;
  canopies.receiveShadow = true;
  const matrix = new THREE.Matrix4();
  const quaternion = new THREE.Quaternion();
  const scale = new THREE.Vector3();
  for (let index = 0; index < count; index += 1) {
    const t = 0.01 + random() * 0.98;
    const point = road.curve.getPointAt(t);
    const tangent = road.curve.getTangentAt(t).normalize();
    const normal = new THREE.Vector3(-tangent.z, 0, tangent.x);
    const side = random() > 0.5 ? 1 : -1;
    const distance = 8.5 + random() * 17;
    const x = point.x + normal.x * side * distance + (random() - 0.5) * 5;
    const z = point.z + normal.z * side * distance + (random() - 0.5) * 5;
    const height = 0.75 + random() * 1.35;
    matrix.compose(new THREE.Vector3(x, 0.75 * height, z), quaternion, new THREE.Vector3(1, height, 1));
    trunks.setMatrixAt(index, matrix);
    matrix.compose(new THREE.Vector3(x, 2.25 * height, z), quaternion.setFromAxisAngle(Y_AXIS, random() * Math.PI), scale.setScalar(height));
    canopies.setMatrixAt(index, matrix);
  }
  scene.add(trunks, canopies);
}

function createStreetLight() {
  const group = new THREE.Group();
  const metal = material(0x333638, 0.45, 0.48);
  const post = new THREE.Mesh(new THREE.CylinderGeometry(0.065, 0.11, 3.2, 8), metal);
  post.position.y = 1.6;
  const arm = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.08, 0.78), metal);
  arm.position.set(0, 3.16, 0.36);
  const lamp = new THREE.Mesh(
    new RoundedBoxGeometry(0.32, 0.13, 0.5, 2, 0.06),
    new THREE.MeshStandardMaterial({ color: 0xffdcb0, emissive: 0xffb466, emissiveIntensity: 1.8 }),
  );
  lamp.position.set(0, 3.08, 0.72);
  group.add(post, arm, lamp);
  return group;
}

function createScreen(project, width = 4.3, height = 2.7, dark = true) {
  const frame = roundedMesh(width + 0.3, height + 0.3, 0.24, 0x24272a, 0.14);
  const screen = new THREE.Mesh(new THREE.PlaneGeometry(width, height), new THREE.MeshBasicMaterial({ map: createProjectTexture(project, dark), toneMapped: false }));
  screen.position.z = 0.135;
  frame.add(screen);
  return frame;
}

function createBuildingCluster(group, project, variant, colliders) {
  const palettes = [
    [0xb38b5e, 0x96704d, true],
    [0xc8c2b4, 0xa9a596, false],
    [0xa67750, 0x7e5b42, false],
    [0x6f7867, 0x4d584b, true],
    [0x343b40, 0x272d31, true],
  ];
  const [primary, secondary, darkScreen] = palettes[variant];
  if (variant === 0) {
    const tower = roundedMesh(4.8, 5.7, 4.2, primary, 0.24);
    const wing = roundedMesh(3.1, 3.3, 3.4, secondary, 0.2);
    tower.position.set(-1.1, 3.3, 0.6);
    wing.position.set(3.2, 2.1, 0.9);
    group.add(tower, wing);
  } else if (variant === 1) {
    const clinic = roundedMesh(7.1, 3.6, 5.3, primary, 0.72, 5);
    clinic.position.set(-0.8, 2.25, 0.6);
    const crossV = roundedMesh(0.32, 1.35, 0.16, 0xf4ead6, 0.06);
    const crossH = roundedMesh(1.35, 0.32, 0.16, 0xf4ead6, 0.06);
    crossV.position.set(-0.8, 2.8, 3.31);
    crossH.position.copy(crossV.position);
    group.add(clinic, crossV, crossH);
  } else if (variant === 2) {
    [-3.2, 0, 3.2].forEach((x, index) => {
      const shop = roundedMesh(2.8, 3.3 + index * 0.55, 3.8, index === 1 ? primary : secondary, 0.18);
      shop.position.set(x, 2.2 + index * 0.275, 0.8);
      group.add(shop);
    });
  } else if (variant === 3) {
    const hub = roundedMesh(7.5, 3.2, 5.2, primary, 0.45, 4);
    hub.position.set(-0.6, 2.05, 0.6);
    const tower = roundedMesh(1.8, 5.4, 1.8, secondary, 0.22);
    tower.position.set(4.5, 3.15, 0.8);
    group.add(hub, tower);
  } else {
    const ops = roundedMesh(7.4, 3.8, 5.1, primary, 0.36, 4);
    ops.position.set(-0.4, 2.35, 0.6);
    const core = new THREE.Mesh(
      new THREE.CylinderGeometry(0.75, 0.9, 4.4, 16),
      new THREE.MeshStandardMaterial({ color: secondary, emissive: 0x3d5663, emissiveIntensity: 0.55, metalness: 0.35, roughness: 0.35 }),
    );
    core.position.set(4.2, 2.7, 0.5);
    group.add(ops, core);
  }
  const screenMount = new THREE.Group();
  const screen = createScreen(project, 4.1, 2.55, darkScreen);
  screen.position.set(0.4, 3.25, 3.25);
  screenMount.add(screen);
  group.add(screenMount);
  colliders.push({ localX: 0, localZ: 0.7, radius: 4.2 });
  return screenMount;
}

function createPlatformBase(project) {
  const group = new THREE.Group();
  const base = roundedMesh(13.5, 0.68, 9.8, 0x766f62, 0.68, 4);
  base.position.y = 0.04;
  const grass = roundedMesh(12.8, 0.25, 9.1, project.district % 2 ? 0x4e5a3b : 0x566340, 0.58, 4);
  grass.position.y = 0.49;
  const ring = new THREE.Mesh(
    new THREE.TorusGeometry(3.05, 0.105, 8, 56),
    new THREE.MeshStandardMaterial({ color: COLORS.orange, emissive: COLORS.orange, emissiveIntensity: 0.25, roughness: 0.48 }),
  );
  ring.rotation.x = Math.PI / 2;
  ring.position.y = 0.72;
  ring.userData.projectRing = true;
  const label = createSprite(createSignTexture(project.title, `${project.number} / ${project.category.toUpperCase()}`), 6.2, 1.5);
  label.position.set(0, 6.8, 0);
  group.add(base, grass, ring, label);
  return group;
}

function connectPlatform(scene, roadPoint, center) {
  const midpoint = roadPoint.clone().lerp(center, 0.5);
  const direction = center.clone().sub(roadPoint);
  const bridge = roundedMesh(4.8, 0.32, Math.max(2.2, roadPoint.distanceTo(center) - 4.6), 0x938b7d, 0.18);
  bridge.position.set(midpoint.x, 0.22, midpoint.z);
  bridge.rotation.y = Math.atan2(direction.x, direction.z);
  scene.add(bridge);
}

function createStations(scene, road) {
  const stations = [];
  const colliders = [];
  PROJECTS.forEach((project, index) => {
    const roadPoint = road.curve.getPointAt(project.curveT);
    const tangent = road.curve.getTangentAt(project.curveT).normalize();
    const normal = new THREE.Vector3(-tangent.z, 0, tangent.x);
    const center = roadPoint.clone().addScaledVector(normal, project.side * 10.8);
    const group = createPlatformBase(project);
    const ring = group.children.find((child) => child.userData.projectRing);
    const roadMarker = createRoadStopMarker(scene, project, roadPoint, tangent, project.side);
    group.position.copy(center);
    group.rotation.y = Math.atan2(tangent.x, tangent.z);
    const localColliders = [];
    const screenMount = createBuildingCluster(group, project, project.district, localColliders);
    [-4.7, 4.7].forEach((x) => {
      const light = createStreetLight();
      light.position.set(x, 0.6, -3.5);
      group.add(light);
    });
    scene.add(group);
    connectPlatform(scene, roadPoint, center);
    localColliders.forEach((collider) => {
      const local = new THREE.Vector3(collider.localX, 0, collider.localZ).applyAxisAngle(Y_AXIS, group.rotation.y).add(center);
      colliders.push({ x: local.x, z: local.z, radius: collider.radius });
    });
    stations.push({
      index,
      project,
      group,
      screenMount,
      ring,
      roadMarker,
      center,
      roadPoint,
      tangent,
      triggerRadius: 11.4,
      activation: 0,
    });
  });
  return { stations, colliders };
}

function createGateway(scene, road, t, title, subtitle, accent = '#dc7431') {
  const point = road.curve.getPointAt(t);
  const tangent = road.curve.getTangentAt(t).normalize();
  const heading = Math.atan2(tangent.x, tangent.z);
  const group = new THREE.Group();
  group.position.copy(point);
  group.rotation.y = heading;
  const metal = 0x3a3936;
  const left = roundedMesh(0.48, 5.7, 0.48, metal, 0.12);
  const right = left.clone();
  left.position.set(-5.5, 2.85, 0);
  right.position.set(5.5, 2.85, 0);
  const beam = roundedMesh(11.5, 0.48, 0.48, metal, 0.12);
  beam.position.y = 5.55;
  const sign = createSprite(createSignTexture(title, subtitle, accent), 8, 1.95);
  sign.position.set(0, 4.35, 0.1);
  group.add(left, right, beam, sign);
  scene.add(group);
  return group;
}

function createStartPlaza(scene, road) {
  const t = 0.012;
  const point = road.curve.getPointAt(t);
  const tangent = road.curve.getTangentAt(t).normalize();
  const normal = new THREE.Vector3(-tangent.z, 0, tangent.x);
  const heading = Math.atan2(tangent.x, tangent.z);
  const plaza = roundedMesh(18, 0.28, 15, 0x5e6251, 1.1, 5);
  plaza.position.copy(point).setY(-0.03);
  plaza.rotation.y = heading;
  scene.add(plaza);
  createGateway(scene, road, 0.025, 'The journey begins', 'START / 20 PROJECTS');

  const tileMaterialA = material(0xe8dfcc, 0.9, 0);
  const tileMaterialB = material(0x242629, 0.9, 0);
  for (let column = -4; column <= 4; column += 1) {
    const tile = new THREE.Mesh(new THREE.BoxGeometry(0.9, 0.05, 1.3), column % 2 ? tileMaterialA : tileMaterialB);
    tile.position.copy(point).addScaledVector(normal, column * 0.9).addScaledVector(tangent, 3.1).setY(0.16);
    tile.rotation.y = heading;
    scene.add(tile);
  }
  [-1, 1].forEach((side) => {
    for (let index = 0; index < 3; index += 1) {
      const light = createStreetLight();
      light.position.copy(point).addScaledVector(normal, side * 7).addScaledVector(tangent, -4 + index * 4);
      light.rotation.y = heading + (side > 0 ? Math.PI : 0);
      scene.add(light);
    }
  });
}

function createDistrictGates(scene, road) {
  DISTRICTS.slice(1).forEach((district, index) => {
    createGateway(scene, road, 0.245 + index * 0.17, district.title, `DISTRICT ${district.number} / ${district.range}`, '#9eaa78');
  });
}

function createConsultation(scene, road) {
  const t = 0.972;
  const roadPoint = road.curve.getPointAt(t);
  const tangent = road.curve.getTangentAt(t).normalize();
  const normal = new THREE.Vector3(-tangent.z, 0, tangent.x);
  const center = roadPoint.clone().addScaledVector(normal, 11.8);
  const group = new THREE.Group();
  group.position.copy(center);
  group.rotation.y = Math.atan2(tangent.x, tangent.z);
  const base = roundedMesh(19, 0.8, 14, 0x746d60, 1.2, 5);
  const grass = roundedMesh(18.2, 0.28, 13.2, 0x56643d, 1.05, 5);
  grass.position.y = 0.55;
  const pavilion = roundedMesh(11.6, 4.5, 7.2, 0x70533d, 0.82, 5);
  pavilion.position.set(0.8, 2.95, 0.7);
  const glass = new THREE.Mesh(
    new THREE.PlaneGeometry(9.8, 3.4),
    new THREE.MeshStandardMaterial({ color: 0x20272a, emissive: 0x38281e, emissiveIntensity: 0.35, roughness: 0.12, metalness: 0.22, transparent: true, opacity: 0.88 }),
  );
  glass.position.set(0.8, 2.85, 4.33);
  const ring = new THREE.Mesh(
    new THREE.TorusGeometry(3.7, 0.13, 10, 64),
    new THREE.MeshStandardMaterial({ color: COLORS.orange, emissive: COLORS.orange, emissiveIntensity: 0.45 }),
  );
  ring.rotation.x = Math.PI / 2;
  ring.position.set(-5.1, 0.82, 0);
  const label = createSprite(createSignTexture('Let’s build what’s next', 'FINAL DESTINATION / FREE CONSULTATION'), 8.6, 2.1);
  label.position.set(0, 7.7, 0);
  group.add(base, grass, pavilion, glass, ring, label);
  scene.add(group);
  connectPlatform(scene, roadPoint, center);
  createGateway(scene, road, 0.938, 'Final destination', 'THE STUDIO / FREE CONSULTATION');
  return { center, roadPoint, tangent, group, ring, triggerRadius: 14.5 };
}

function createCar() {
  const car = new THREE.Group();

  const mtlLoader = new MTLLoader();
  mtlLoader.setPath('models/');
  mtlLoader.load('car.mtl', (materials) => {
    materials.preload();
    const objLoader = new OBJLoader();
    objLoader.setMaterials(materials);
    objLoader.setPath('models/');
    objLoader.load('car.obj', (obj) => {
      const box = new THREE.Box3().setFromObject(obj);
      const size = box.getSize(new THREE.Vector3());
      const scale = 4.1 / Math.max(size.x, size.y, size.z);
      obj.scale.setScalar(scale);
      const box2 = new THREE.Box3().setFromObject(obj);
      obj.position.x -= (box2.max.x + box2.min.x) / 2;
      obj.position.z -= (box2.max.z + box2.min.z) / 2;
      obj.position.y -= box2.min.y;
      obj.rotation.y = 0;
      obj.traverse((child) => {
        if (!child.isMesh) return;
        child.castShadow = true;
        child.receiveShadow = true;
        const name = child.material && child.material.name;
        child.material = (name === 'Material.004' || name === 'Material.005')
          ? new THREE.MeshStandardMaterial({ color: 0x161616, roughness: 0.5, metalness: 0.6 })
          : new THREE.MeshStandardMaterial({ color: 0xc41313, roughness: 0.22, metalness: 0.4 });
      });
      car.add(obj);
    });
  });

  return { group: car, wheels: [] };
}

function createEnvironment(scene) {
  scene.background = new THREE.Color(COLORS.background);
  scene.fog = new THREE.Fog(COLORS.background, 75, 175);
  const width = WORLD_BOUNDS.maxX - WORLD_BOUNDS.minX + 80;
  const depth = WORLD_BOUNDS.maxZ - WORLD_BOUNDS.minZ + 80;
  const ground = new THREE.Mesh(new THREE.PlaneGeometry(width, depth), material(COLORS.groundDark, 1));
  ground.rotation.x = -Math.PI / 2;
  ground.position.set((WORLD_BOUNDS.minX + WORLD_BOUNDS.maxX) / 2, -0.28, (WORLD_BOUNDS.minZ + WORLD_BOUNDS.maxZ) / 2);
  ground.receiveShadow = true;
  scene.add(ground);
  scene.add(new THREE.HemisphereLight(0xdce4e3, 0x302a24, 1.7));
  const sun = new THREE.DirectionalLight(0xffe1bd, 3.1);
  sun.position.set(-60, 75, -45);
  sun.castShadow = true;
  sun.shadow.mapSize.set(2048, 2048);
  sun.shadow.camera.left = -85;
  sun.shadow.camera.right = 85;
  sun.shadow.camera.top = 85;
  sun.shadow.camera.bottom = -85;
  sun.shadow.bias = -0.00035;
  scene.add(sun);
  const fill = new THREE.DirectionalLight(0x7690a5, 0.8);
  fill.position.set(70, 30, 60);
  scene.add(fill);
}

export function buildWorld(scene) {
  createEnvironment(scene);
  const road = createRoad(scene);
  createTreeInstances(scene, road);
  createStartPlaza(scene, road);
  createDistrictGates(scene, road);
  const { stations, colliders } = createStations(scene, road);
  const consultation = createConsultation(scene, road);
  const car = createCar();
  const startPoint = road.curve.getPointAt(0.014);
  const startTangent = road.curve.getTangentAt(0.014).normalize();
  car.group.position.copy(startPoint).setY(0.12);
  car.group.rotation.y = Math.atan2(startTangent.x, startTangent.z);
  scene.add(car.group);

  return {
    road,
    stations,
    colliders,
    consultation,
    car,
    bounds: WORLD_BOUNDS,
    start: { position: startPoint.clone(), heading: Math.atan2(startTangent.x, startTangent.z) },
  };
}
