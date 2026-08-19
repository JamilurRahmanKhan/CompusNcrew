import * as THREE from 'three';
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js';
import { OBJLoader } from 'three/addons/loaders/OBJLoader.js';
import { Sky } from 'three/addons/objects/Sky.js';
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

function createAsphaltTexture() {
  return createCanvasTexture((context, width, height) => {
    context.fillStyle = hexColor(COLORS.road);
    context.fillRect(0, 0, width, height);
    const random = seededRandom();
    // Soft mottled patches first — reads as worn/resurfaced asphalt instead
    // of flat colour, at real-road scale (not fine noise).
    for (let i = 0; i < 16; i += 1) {
      const x = random() * width;
      const y = random() * height;
      const r = 70 + random() * 110;
      const shade = 0.88 + random() * 0.2;
      const base = new THREE.Color(COLORS.road).multiplyScalar(shade);
      const gradient = context.createRadialGradient(x, y, 0, x, y, r);
      gradient.addColorStop(0, `rgba(${base.r * 255 | 0},${base.g * 255 | 0},${base.b * 255 | 0},0.28)`);
      gradient.addColorStop(1, 'rgba(0,0,0,0)');
      context.fillStyle = gradient;
      context.beginPath();
      context.arc(x, y, r, 0, Math.PI * 2);
      context.fill();
    }
    // Two tyre-wear streaks, feathered (not hard-edged) so they read as
    // subtle wheel-path polish instead of visible colour blocks.
    [0.32, 0.67].forEach((cx) => {
      const streak = context.createLinearGradient((cx - 0.07) * width, 0, (cx + 0.07) * width, 0);
      streak.addColorStop(0, 'rgba(255,255,255,0)');
      streak.addColorStop(0.5, 'rgba(255,255,255,0.06)');
      streak.addColorStop(1, 'rgba(255,255,255,0)');
      context.fillStyle = streak;
      context.fillRect((cx - 0.07) * width, 0, 0.14 * width, height);
    });
    // Fine grain last, subtle — grit texture, not visible speckle noise.
    for (let i = 0; i < 4000; i += 1) {
      const shade = 0.9 + random() * 0.2;
      const base = new THREE.Color(COLORS.road).multiplyScalar(shade);
      context.fillStyle = `rgba(${base.r * 255 | 0},${base.g * 255 | 0},${base.b * 255 | 0},0.4)`;
      context.fillRect(random() * width, random() * height, 1, 1);
    }
  }, 512, 512);
}

function createRoadRibbon(curve, halfWidth, y, color, offset = 0, stripWidth = 0, map = null) {
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
  const mat = material(color, 0.95, 0);
  if (map) {
    map.wrapS = THREE.RepeatWrapping;
    map.wrapT = THREE.RepeatWrapping;
    mat.map = map;
    mat.color.set(0xffffff);
  }
  const mesh = new THREE.Mesh(geometry, mat);
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
  scene.add(createRoadRibbon(curve, halfWidth, 0.04, COLORS.road, 0, 0, createAsphaltTexture()));
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

function hexColor(num) {
  return '#' + num.toString(16).padStart(6, '0');
}

// Scatter positions were computed as "distance from the road at this one
// curve parameter t" — on a bend, a point can be far from ITS OWN sample
// but much closer to a different stretch of the curve that loops back
// nearby, letting grass/trees land on or right next to the pavement. This
// checks the real minimum distance against the road's full sample set.
function isClearOfRoad(road, x, z, clearance) {
  const samples = road.samples;
  const clearanceSq = clearance * clearance;
  for (let i = 0; i < samples.length; i += 3) {
    const dx = samples[i].x - x;
    const dz = samples[i].z - z;
    if (dx * dx + dz * dz < clearanceSq) return false;
  }
  return true;
}

function seededRandom(seed = 44191) {
  let value = seed;
  return () => {
    value = (value * 1664525 + 1013904223) % 4294967296;
    return value / 4294967296;
  };
}

// A tileable diffuse texture for the ground plane: fine speckled blade
// noise plus a few soft worn-dirt patches, all drawn with wrap-around
// copies near the canvas edges so the repeat doesn't show a seam.
function createGrassGroundTexture() {
  const size = 768;
  return createCanvasTexture((context, width, height) => {
    context.fillStyle = hexColor(COLORS.groundDark);
    context.fillRect(0, 0, width, height);
    const random = seededRandom();
    const shades = [COLORS.groundDark, COLORS.terrain, COLORS.ground, COLORS.treeLight, 0x333c2b, 0x232821].map(hexColor);
    // Short rotated blade strokes instead of round blobs — reads as fine
    // grass grain rather than a camo blotch pattern.
    const drawBlade = (x, y, len, color) => {
      context.strokeStyle = color;
      context.lineWidth = 1.1 + random() * 0.9;
      const angle = random() * Math.PI;
      const dx = Math.cos(angle) * len;
      const dy = Math.sin(angle) * len;
      context.beginPath();
      context.moveTo(x - dx / 2, y - dy / 2);
      context.lineTo(x + dx / 2, y + dy / 2);
      context.stroke();
    };
    const wrapDraw = (x, y, r, color) => {
      for (let ox = -1; ox <= 1; ox += 1) {
        for (let oy = -1; oy <= 1; oy += 1) {
          const wx = x + ox * width;
          const wy = y + oy * height;
          if (wx > -r && wx < width + r && wy > -r && wy < height + r) drawBlade(wx, wy, r, color);
        }
      }
    };
    for (let index = 0; index < 20000; index += 1) {
      const x = random() * width;
      const y = random() * height;
      const len = 3 + random() * 6;
      wrapDraw(x, y, len, shades[Math.floor(random() * shades.length)]);
    }
    for (let index = 0; index < 12; index += 1) {
      const x = random() * width;
      const y = random() * height;
      const r = 26 + random() * 58;
      const gradient = context.createRadialGradient(x, y, 0, x, y, r);
      gradient.addColorStop(0, 'rgba(78,66,46,.32)');
      gradient.addColorStop(1, 'rgba(78,66,46,0)');
      context.fillStyle = gradient;
      context.beginPath();
      context.arc(x, y, r, 0, Math.PI * 2);
      context.fill();
    }
  }, size, size);
}

// Two crossed vertical planes (8 verts / 4 tris) — the classic cheap
// billboard-blade shape for scattering thousands of grass tufts.
function createGrassBladeGeometry(width, height) {
  const hw = width / 2;
  const positions = [
    -hw, 0, 0, hw, 0, 0, hw, height, 0, -hw, height, 0,
    0, 0, -hw, 0, 0, hw, 0, height, hw, 0, height, -hw,
  ];
  const uvs = [0, 0, 1, 0, 1, 1, 0, 1, 0, 0, 1, 0, 1, 1, 0, 1];
  const indices = [0, 1, 2, 0, 2, 3, 4, 5, 6, 4, 6, 7];
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
  geometry.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2));
  geometry.setIndex(indices);
  geometry.computeVertexNormals();
  return geometry;
}

// Blades carry their own base->tip colour gradient (dim mossy base, bright
// sunlit tip) baked into the texture, instead of a flat white cutout — a
// flat-white blade multiplied by this scene's dark instance tints was
// reading as a near-black spike rather than a green blade of grass.
function createGrassTuftTexture() {
  return createCanvasTexture((context, width, height) => {
    context.clearRect(0, 0, width, height);
    const blades = [
      [0.5, 1, 0.062, 0.94, -0.04],
      [0.37, 1, 0.05, 0.78, -0.26],
      [0.63, 1, 0.05, 0.8, 0.24],
      [0.25, 1, 0.044, 0.6, -0.46],
      [0.75, 1, 0.044, 0.62, 0.44],
      [0.12, 1, 0.038, 0.4, -0.6],
      [0.88, 1, 0.038, 0.42, 0.58],
    ];
    blades.forEach(([bx, by, w, h, lean]) => {
      const x0 = bx * width;
      const y0 = by * height;
      const xTip = x0 + lean * width;
      const yTip = y0 - h * height;
      const gradient = context.createLinearGradient(x0, y0, xTip, yTip);
      gradient.addColorStop(0, 'rgba(84,98,52,0.9)');
      gradient.addColorStop(0.55, 'rgba(134,154,84,0.96)');
      gradient.addColorStop(1, 'rgba(200,214,142,1)');
      context.fillStyle = gradient;
      context.beginPath();
      context.moveTo(x0 - w * width * 0.5, y0);
      context.quadraticCurveTo(x0 + lean * width * 0.4, y0 - h * height * 0.55, xTip, yTip);
      context.quadraticCurveTo(x0 + lean * width * 0.6, y0 - h * height * 0.55, x0 + w * width * 0.5, y0);
      context.closePath();
      context.fill();
    });
  }, 160, 192);
}

// Sparse GPU-instanced grass tufts scattered in two bands around the road —
// a denser roadside belt and a thinner open-field spread further out.
// Cross-billboards are 4 tris each, so even ~1.5k of them cost a fraction
// of a single detailed tree; no shadow casting, matching the perf pattern
// already used for the heavier tree instances.
function createGrassTufts(scene, road) {
  const geometry = createGrassBladeGeometry(1, 0.65);
  const tuftMaterial = new THREE.MeshStandardMaterial({
    map: createGrassTuftTexture(),
    alphaTest: 0.4,
    // FrontSide, not DoubleSide — the crossed-plane geometry already gives
    // near-full coverage from any angle, and DoubleSide was doubling the
    // fragment cost of every one of these instances for little visual gain.
    side: THREE.FrontSide,
    roughness: 0.95,
    vertexColors: true,
    // A faint fixed glow keeps blades from reading as flat black silhouettes
    // when they're facing away from the sun — real grass never goes fully
    // dark, it picks up ambient sky/ground bounce.
    emissive: new THREE.Color(0x1c2512),
    emissiveIntensity: 0.4,
  });
  // min distance is a hard clearance from the road centerline — the road's
  // paved+shoulder half-width tops out at 5.35, so anything below ~7.5 here
  // risks a tuft landing on the asphalt.
  // Counts pulled back from a previous over-scale (was 4200/3200 = 7400
  // instances, which combined with DoubleSide overdraw was the actual cause
  // of the reported stutter) — this is still ~1.7x the original density.
  const bands = [
    { count: 1700, min: 7.6, max: 18 },
    { count: 1100, min: 18, max: 44 },
  ];
  const totalCount = bands.reduce((sum, band) => sum + band.count, 0);
  const mesh = new THREE.InstancedMesh(geometry, tuftMaterial, totalCount);
  mesh.receiveShadow = true;
  const palette = [0x5f8b3e, 0x74a24a, 0x4d7530, 0x8fb85c, COLORS.ground].map((c) => new THREE.Color(c));
  const random = seededRandom();
  const matrix = new THREE.Matrix4();
  const quaternion = new THREE.Quaternion();
  const color = new THREE.Color();
  const roadClearance = road.halfWidth + 1.15 + 1.0;
  let index = 0;
  bands.forEach(({ count, min, max }) => {
    for (let i = 0; i < count; i += 1) {
      let x = 0;
      let z = 0;
      let safe = false;
      for (let attempt = 0; attempt < 6 && !safe; attempt += 1) {
        const t = 0.01 + random() * 0.98;
        const point = road.curve.getPointAt(t);
        const tangent = road.curve.getTangentAt(t).normalize();
        const normal = new THREE.Vector3(-tangent.z, 0, tangent.x);
        const side = random() > 0.5 ? 1 : -1;
        const distance = min + random() * (max - min);
        const along = (random() - 0.5) * 4;
        x = point.x + normal.x * side * distance + tangent.x * along;
        z = point.z + normal.z * side * distance + tangent.z * along;
        safe = isClearOfRoad(road, x, z, roadClearance);
      }
      // Couldn't find a verified-safe spot in time (only happens on tight
      // bends) — scale to zero rather than risk placing it on the road.
      const scaleXZ = safe ? 0.7 + random() * 0.9 : 0;
      const scaleY = scaleXZ * (0.7 + random() * 0.35);
      quaternion.setFromAxisAngle(Y_AXIS, random() * Math.PI * 2);
      matrix.compose(new THREE.Vector3(x, 0, z), quaternion, new THREE.Vector3(scaleXZ, scaleY, scaleXZ));
      mesh.setMatrixAt(index, matrix);
      color.copy(palette[Math.floor(random() * palette.length)]).multiplyScalar(0.85 + random() * 0.4);
      mesh.setColorAt(index, color);
      index += 1;
    }
  });
  mesh.instanceMatrix.needsUpdate = true;
  if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true;
  // Without this, frustum culling falls back to the base blade geometry's
  // tiny local-origin bounding sphere instead of one covering every scattered
  // instance — the whole mesh silently disappears whenever (0,0,0) isn't in
  // view, and never gets the culling benefit it should when it's off-screen.
  mesh.computeBoundingSphere();
  scene.add(mesh);
}

function createTreeInstances(scene, road) {
  const count = 280;
  const random = seededRandom();
  const trunks = new THREE.InstancedMesh(new THREE.CylinderGeometry(0.14, 0.24, 1.8, 7), material(COLORS.trunk), count);
  const canopyMat = material(COLORS.tree, 0.98);
  const canopyMat2 = material(COLORS.treeLight, 0.98);
  const canopies = new THREE.InstancedMesh(new THREE.IcosahedronGeometry(1, 1), canopyMat, count);
  // A second, smaller offset blob per tree (lighter tone) breaks up the
  // "single perfect sphere" look into a fuller, more organic canopy.
  const canopies2 = new THREE.InstancedMesh(new THREE.IcosahedronGeometry(1, 1), canopyMat2, count);
  trunks.castShadow = true;
  canopies.castShadow = true;
  canopies.receiveShadow = true;
  canopies2.castShadow = true;
  canopies2.receiveShadow = true;
  const matrix = new THREE.Matrix4();
  const quaternion = new THREE.Quaternion();
  const scale = new THREE.Vector3();
  const roadClearance = road.halfWidth + 1.15 + 1.0;
  for (let index = 0; index < count; index += 1) {
    let x = 0;
    let z = 0;
    let safe = false;
    for (let attempt = 0; attempt < 6 && !safe; attempt += 1) {
      const t = 0.01 + random() * 0.98;
      const point = road.curve.getPointAt(t);
      const tangent = road.curve.getTangentAt(t).normalize();
      const normal = new THREE.Vector3(-tangent.z, 0, tangent.x);
      const side = random() > 0.5 ? 1 : -1;
      const distance = 8.5 + random() * 17;
      x = point.x + normal.x * side * distance + tangent.x * (random() - 0.5) * 5;
      z = point.z + normal.z * side * distance + tangent.z * (random() - 0.5) * 5;
      safe = isClearOfRoad(road, x, z, roadClearance);
    }
    const height = safe ? 0.75 + random() * 1.35 : 0;
    matrix.compose(new THREE.Vector3(x, 0.75 * height, z), quaternion, new THREE.Vector3(1, height, 1));
    trunks.setMatrixAt(index, matrix);
    matrix.compose(
      new THREE.Vector3(x, 2.25 * height, z),
      quaternion.setFromAxisAngle(Y_AXIS, random() * Math.PI),
      scale.set(height * (0.85 + random() * 0.3), height * (0.9 + random() * 0.25), height * (0.85 + random() * 0.3)),
    );
    canopies.setMatrixAt(index, matrix);
    const offsetAngle = random() * Math.PI * 2;
    const offsetR = height * (0.45 + random() * 0.25);
    matrix.compose(
      new THREE.Vector3(x + Math.cos(offsetAngle) * offsetR, height * (1.9 + random() * 0.5), z + Math.sin(offsetAngle) * offsetR),
      quaternion.setFromAxisAngle(Y_AXIS, random() * Math.PI),
      scale.setScalar(height * (0.55 + random() * 0.25)),
    );
    canopies2.setMatrixAt(index, matrix);
  }
  trunks.computeBoundingSphere();
  canopies.computeBoundingSphere();
  canopies2.computeBoundingSphere();
  scene.add(trunks, canopies, canopies2);
}

// A handful of higher-detail specimen trees mixed in among the low-poly
// ones. The source model is very heavy (~180k tris, no shipped leaf/bark
// textures), so it's flat-shaded in the same palette as the low-poly trees
// (not textured) and used sparingly — a few dozen individual instances,
// not the hundreds the instanced low-poly trees use.
function createDetailedTreeInstances(scene, road) {
  const count = 20;
  const bucketCount = 5;
  const objLoader = new OBJLoader();
  objLoader.setPath('models/');
  objLoader.load('tree-detailed.obj', (source) => {
    let leavesGeometry = null;
    let trunkGeometry = null;
    source.traverse((child) => {
      if (!child.isMesh) return;
      if (child.material && child.material.name === 'Material.002') trunkGeometry = child.geometry;
      else leavesGeometry = child.geometry;
    });
    if (!leavesGeometry || !trunkGeometry) return;

    const box = new THREE.Box3().setFromObject(source);
    const height = box.max.y - box.min.y || 1;
    const baseScale = 3.4 / height;
    const centerX = (box.max.x + box.min.x) / 2;
    const centerZ = (box.max.z + box.min.z) / 2;
    // Bake centering/grounding into the geometry itself (once) so each
    // instance's matrix only needs to carry position/rotation/scale.
    leavesGeometry.translate(-centerX, -box.min.y, -centerZ);
    trunkGeometry.translate(-centerX, -box.min.y, -centerZ);

    // InstancedMesh can't cull individual instances — a single batch
    // spanning the whole road was rendering all instances (~180k tris each)
    // every frame as soon as any one tree was on-screen, which was the real
    // cause of the stutter. Bucketing by road position into several smaller
    // batches gives each one a small, localized bounding sphere so the
    // renderer can actually skip the ones that are off-screen.
    const random = seededRandom();
    const roadClearance = road.halfWidth + 1.15 + 1.0;
    const buckets = Array.from({ length: bucketCount }, () => []);
    for (let index = 0; index < count; index += 1) {
      random(); random(); random();
      let x = 0;
      let z = 0;
      let t = 0;
      let safe = false;
      for (let attempt = 0; attempt < 6 && !safe; attempt += 1) {
        t = 0.02 + random() * 0.96;
        const point = road.curve.getPointAt(t);
        const tangent = road.curve.getTangentAt(t).normalize();
        const normal = new THREE.Vector3(-tangent.z, 0, tangent.x);
        const side = random() > 0.5 ? 1 : -1;
        const distance = 10 + random() * 20;
        x = point.x + normal.x * side * distance + tangent.x * (random() - 0.5) * 6;
        z = point.z + normal.z * side * distance + tangent.z * (random() - 0.5) * 6;
        safe = isClearOfRoad(road, x, z, roadClearance);
      }
      if (!safe) continue;
      const scale = baseScale * (0.8 + random() * 0.5);
      const quaternion = new THREE.Quaternion().setFromAxisAngle(Y_AXIS, random() * Math.PI * 2);
      buckets[Math.min(bucketCount - 1, Math.floor(t * bucketCount))].push({ x, z, scale, quaternion });
    }

    const matrix = new THREE.Matrix4();
    buckets.forEach((group) => {
      if (group.length === 0) return;
      const trunkMesh = new THREE.InstancedMesh(trunkGeometry, material(COLORS.trunk, 0.9, 0.05), group.length);
      const leavesMesh = new THREE.InstancedMesh(leavesGeometry, material(COLORS.tree, 0.85, 0), group.length);
      // Shadow-casting this many dense-foliage triangles is the real cost —
      // it doubles the vertex work (main pass + shadow-map pass) and shadow
      // maps handle high-poly foliage badly. Not casting keeps the visual
      // (trees still receive shadow from the sun/other objects) at a
      // fraction of the GPU cost.
      trunkMesh.receiveShadow = true;
      leavesMesh.receiveShadow = true;
      group.forEach((p, i) => {
        matrix.compose(new THREE.Vector3(p.x, 0, p.z), p.quaternion, new THREE.Vector3(p.scale, p.scale, p.scale));
        trunkMesh.setMatrixAt(i, matrix);
        leavesMesh.setMatrixAt(i, matrix);
      });
      trunkMesh.instanceMatrix.needsUpdate = true;
      leavesMesh.instanceMatrix.needsUpdate = true;
      trunkMesh.computeBoundingSphere();
      leavesMesh.computeBoundingSphere();
      scene.add(trunkMesh, leavesMesh);
    });
  });
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

const FACADE_TRIM = 0x24262a;

// A tiled grid of lit/unlit windows, drawn per-building from a seeded
// random so no two stations share the exact same pattern.
function createWindowTexture(cols, rows, tint, random) {
  const cellW = 56;
  const cellH = 72;
  return createCanvasTexture((context, width, height) => {
    context.fillStyle = hexColor(tint);
    context.fillRect(0, 0, width, height);
    for (let row = 0; row < rows; row += 1) {
      for (let col = 0; col < cols; col += 1) {
        const pad = Math.min(cellW, cellH) * 0.18;
        const x = col * cellW + pad;
        const y = row * cellH + pad;
        const w = cellW - pad * 2;
        const h = cellH - pad * 2;
        const lit = random() > 0.6;
        context.fillStyle = lit ? 'rgba(255,205,140,.92)' : 'rgba(16,20,23,.82)';
        context.fillRect(x, y, w, h);
        context.strokeStyle = 'rgba(8,10,11,.55)';
        context.lineWidth = 1.6;
        context.strokeRect(x, y, w, h);
        if (lit) {
          context.fillStyle = 'rgba(255,235,200,.35)';
          context.fillRect(x, y, w, h * 0.32);
        }
      }
    }
  }, cols * cellW, rows * cellH);
}

// A window-textured panel mounted flush on a volume's front (+Z) face —
// turns a flat-colored box into something that reads as an actual facade.
function addFacade(group, width, height, depth, x, y, z, cols, rows, tint, random) {
  const panel = new THREE.Mesh(
    new THREE.PlaneGeometry(width * 0.82, height * 0.62),
    new THREE.MeshStandardMaterial({ map: createWindowTexture(cols, rows, tint, random), roughness: 0.55, metalness: 0.15 }),
  );
  panel.position.set(x, y + height * 0.05, z + depth / 2 + 0.03);
  group.add(panel);
}

// A thin overhanging cap gives the roofline a real edge instead of the box
// just stopping in mid-air, plus a slim glowing trim underneath — the
// "modern lit kiosk" accent instead of a bare dark cap.
function addRoofCap(group, width, height, depth, x, y, z) {
  const capY = y + height / 2 + 0.13;
  const cap = roundedMesh(width + 0.4, 0.26, depth + 0.4, FACADE_TRIM, 0.1, 2);
  cap.position.set(x, capY, z);
  group.add(cap);

  const glow = new THREE.Mesh(
    new THREE.BoxGeometry(width + 0.58, 0.16, depth + 0.58),
    new THREE.MeshStandardMaterial({ color: COLORS.orange, emissive: COLORS.orange, emissiveIntensity: 3.4, toneMapped: false }),
  );
  glow.position.set(x, capY - 0.22, z);
  group.add(glow);
}

function addPlinth(group, width, depth, x, z) {
  const plinth = roundedMesh(width + 0.24, 0.46, depth + 0.24, FACADE_TRIM, 0.14, 2);
  plinth.position.set(x, 0.23, z);
  group.add(plinth);

  // Matching glow band at ground level frames the whole building top and
  // bottom, like the lit-kiosk reference.
  const glow = new THREE.Mesh(
    new THREE.BoxGeometry(width + 0.4, 0.14, depth + 0.4),
    new THREE.MeshStandardMaterial({ color: COLORS.orange, emissive: COLORS.orange, emissiveIntensity: 3.4, toneMapped: false }),
  );
  glow.position.set(x, 0.06, z);
  group.add(glow);
}

// One or two rooftop units (AC/vent boxes) for skyline silhouette variety.
function addRoofProps(group, width, height, depth, x, y, z, random) {
  const count = 1 + Math.floor(random() * 2);
  for (let index = 0; index < count; index += 1) {
    const boxW = 0.45 + random() * 0.5;
    const boxH = 0.3 + random() * 0.32;
    const boxD = 0.45 + random() * 0.5;
    const unit = roundedMesh(boxW, boxH, boxD, 0x2c2f31, 0.06, 2);
    unit.position.set(
      x + (random() - 0.5) * width * 0.5,
      y + height / 2 + 0.3 + boxH / 2,
      z + (random() - 0.5) * depth * 0.5,
    );
    group.add(unit);
  }
}

// A small brand-orange entrance awning — ties every station back to the
// site's accent color and reads as "this is the door" from a distance.
function addCanopy(group, width, depth, x, z) {
  const canopy = roundedMesh(Math.min(2.6, width * 0.5), 0.14, 1.05, COLORS.orange, 0.06, 2);
  canopy.position.set(x, 1.55, z + depth / 2 + 0.5);
  canopy.rotation.x = -0.1;
  group.add(canopy);
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
  const random = seededRandom(9000 + Number(project.number) * 131);
  const windowTint = darkScreen ? 0x15181a : 0x24282a;
  if (variant === 0) {
    const tower = roundedMesh(4.8, 5.7, 4.2, primary, 0.24);
    const wing = roundedMesh(3.1, 3.3, 3.4, secondary, 0.2);
    tower.position.set(-1.1, 3.3, 0.6);
    wing.position.set(3.2, 2.1, 0.9);
    group.add(tower, wing);
    addFacade(group, 4.8, 5.7, 4.2, -1.1, 3.3, 0.6, 4, 7, windowTint, random);
    addFacade(group, 3.1, 3.3, 3.4, 3.2, 2.1, 0.9, 3, 4, windowTint, random);
    addRoofCap(group, 4.8, 5.7, 4.2, -1.1, 3.3, 0.6);
    addRoofCap(group, 3.1, 3.3, 3.4, 3.2, 2.1, 0.9);
    addPlinth(group, 4.8, 4.2, -1.1, 0.6);
    addPlinth(group, 3.1, 3.4, 3.2, 0.9);
    addRoofProps(group, 4.8, 5.7, 4.2, -1.1, 3.3, 0.6, random);
    addCanopy(group, 4.8, 4.2, -1.1, 0.6);
  } else if (variant === 1) {
    const clinic = roundedMesh(7.1, 3.6, 5.3, primary, 0.72, 5);
    clinic.position.set(-0.8, 2.25, 0.6);
    const crossV = roundedMesh(0.32, 1.35, 0.16, 0xf4ead6, 0.06);
    const crossH = roundedMesh(1.35, 0.32, 0.16, 0xf4ead6, 0.06);
    crossV.position.set(-0.8, 2.8, 3.31);
    crossH.position.copy(crossV.position);
    group.add(clinic, crossV, crossH);
    addFacade(group, 7.1, 3.6, 5.3, -0.8, 2.25, 0.6, 5, 3, windowTint, random);
    addRoofCap(group, 7.1, 3.6, 5.3, -0.8, 2.25, 0.6);
    addPlinth(group, 7.1, 5.3, -0.8, 0.6);
    addCanopy(group, 7.1, 5.3, -0.8, 0.6);
  } else if (variant === 2) {
    [-3.2, 0, 3.2].forEach((x, index) => {
      const shopHeight = 3.3 + index * 0.55;
      const shopY = 2.2 + index * 0.275;
      const shop = roundedMesh(2.8, shopHeight, 3.8, index === 1 ? primary : secondary, 0.18);
      shop.position.set(x, shopY, 0.8);
      group.add(shop);
      addFacade(group, 2.8, shopHeight, 3.8, x, shopY, 0.8, 2, 3 + index, windowTint, random);
      addRoofCap(group, 2.8, shopHeight, 3.8, x, shopY, 0.8);
      addPlinth(group, 2.8, 3.8, x, 0.8);
      addCanopy(group, 2.8, 3.8, x, 0.8);
    });
  } else if (variant === 3) {
    const hub = roundedMesh(7.5, 3.2, 5.2, primary, 0.45, 4);
    hub.position.set(-0.6, 2.05, 0.6);
    const tower = roundedMesh(1.8, 5.4, 1.8, secondary, 0.22);
    tower.position.set(4.5, 3.15, 0.8);
    group.add(hub, tower);
    addFacade(group, 7.5, 3.2, 5.2, -0.6, 2.05, 0.6, 5, 3, windowTint, random);
    addFacade(group, 1.8, 5.4, 1.8, 4.5, 3.15, 0.8, 2, 6, windowTint, random);
    addRoofCap(group, 7.5, 3.2, 5.2, -0.6, 2.05, 0.6);
    addRoofCap(group, 1.8, 5.4, 1.8, 4.5, 3.15, 0.8);
    addPlinth(group, 7.5, 5.2, -0.6, 0.6);
    addRoofProps(group, 7.5, 3.2, 5.2, -0.6, 2.05, 0.6, random);
    addCanopy(group, 7.5, 5.2, -0.6, 0.6);
  } else {
    const ops = roundedMesh(7.4, 3.8, 5.1, primary, 0.36, 4);
    ops.position.set(-0.4, 2.35, 0.6);
    const core = new THREE.Mesh(
      new THREE.CylinderGeometry(0.75, 0.9, 4.4, 16),
      new THREE.MeshStandardMaterial({ color: secondary, emissive: 0x3d5663, emissiveIntensity: 0.55, metalness: 0.35, roughness: 0.35 }),
    );
    core.position.set(4.2, 2.7, 0.5);
    group.add(ops, core);
    addFacade(group, 7.4, 3.8, 5.1, -0.4, 2.35, 0.6, 5, 3, windowTint, random);
    addRoofCap(group, 7.4, 3.8, 5.1, -0.4, 2.35, 0.6);
    addPlinth(group, 7.4, 5.1, -0.4, 0.6);
    addRoofProps(group, 7.4, 3.8, 5.1, -0.4, 2.35, 0.6, random);
    addCanopy(group, 7.4, 5.1, -0.4, 0.6);
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

const carTextureLoader = new THREE.TextureLoader();
const carTextureCache = {};
function carTexture(file) {
  if (!carTextureCache[file]) {
    const tex = carTextureLoader.load('models/textures/' + file);
    tex.colorSpace = THREE.SRGBColorSpace;
    carTextureCache[file] = tex;
  }
  return carTextureCache[file];
}

const CAR_MATERIAL_RULES = [
  [/tire_side/, { map: carTexture('tire-side.jpg'), roughness: 0.8, metalness: 0.05 }],
  [/tire/, { map: carTexture('tire.jpg'), roughness: 0.85, metalness: 0.05 }],
  [/^glass$|headlightglass/, { map: carTexture('glass.png'), roughness: 0.05, metalness: 0.1, transparent: true, opacity: 0.55 }],
  [/^windo/, { map: carTexture('windo.png'), roughness: 0.05, metalness: 0.1, transparent: true, opacity: 0.55 }],
  [/grill/, { map: carTexture('grill.jpg'), roughness: 0.5, metalness: 0.3 }],
  [/^engine$/, { map: carTexture('engine.jpg'), roughness: 0.5, metalness: 0.4 }],
  [/interior/, { map: carTexture('interior.jpg'), roughness: 0.6, metalness: 0.1 }],
  [/^bottom$/, { map: carTexture('bottom.jpg'), roughness: 0.6, metalness: 0.1 }],
  [/plate_f/, { map: carTexture('plate-f.jpg'), roughness: 0.4, metalness: 0.05 }],
  [/plate_r/, { map: carTexture('plate-r.jpg'), roughness: 0.4, metalness: 0.05 }],
  [/stitch/, { map: carTexture('stitch.png'), roughness: 0.6, metalness: 0 }],
  [/supportlogo/, { map: carTexture('support-logo.png'), roughness: 0.3, metalness: 0.2 }],
  [/f1_side/, { map: carTexture('side.png'), roughness: 0.3, metalness: 0.2 }],
  [/rim|^chrome$|chrome2|brakedisk|aluminium|exhaust_metal|bronze/, { color: 0xd6d8db, roughness: 0.25, metalness: 0.95 }],
  [/brakelight|rear_lamp|rear_turn/, { color: 0xaa1414, emissive: 0x550a0a, emissiveIntensity: 0.6, roughness: 0.3, metalness: 0.2 }],
  [/headlight/, { color: 0xf5f0df, emissive: 0x8a805f, emissiveIntensity: 0.3, roughness: 0.2, metalness: 0.1 }],
  [/exhaust_gold/, { color: 0xb9924a, roughness: 0.3, metalness: 0.8 }],
  [/exhaust/, { color: 0x2a2a2a, roughness: 0.4, metalness: 0.7 }],
  [/black_/, { color: 0x1c1c1e, roughness: 0.5, metalness: 0.2 }],
];

function carMaterialFor(name) {
  const key = (name || '').toLowerCase();
  const rule = CAR_MATERIAL_RULES.find(([pattern]) => pattern.test(key));
  // Everything else (body panels, McLaren/F1 decals, red line, logos) shares
  // the model's single main livery texture — this file has no .mtl, so this
  // is the only way to recover its actual white/black paint scheme.
  const options = rule ? rule[1] : { map: carTexture('body.png'), roughness: 0.3, metalness: 0.25 };
  return new THREE.MeshStandardMaterial(options);
}

function createCar() {
  const car = new THREE.Group();

  const objLoader = new OBJLoader();
  objLoader.setPath('models/');
  objLoader.load('car.obj', (obj) => {
      const box = new THREE.Box3().setFromObject(obj);
      const size = box.getSize(new THREE.Vector3());
      // This file has no o/g boundaries, so the whole model loads as one
      // mesh with a multi-material array — the wide "floor" disc it ships
      // with inflates the X/Z bounds, so scale off height (uncorrupted)
      // instead of the largest dimension.
      const scale = 1.1 / size.y;
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
        const wasArray = Array.isArray(child.material);
        const materials = wasArray ? child.material : [child.material];
        const mapped = materials.map((mat) => {
          const name = mat && mat.name;
          if (['floor', 'bottom', 'suport', '_'].includes((name || '').toLowerCase())) {
            return new THREE.MeshBasicMaterial({ visible: false });
          }
          return carMaterialFor(name);
        });
        child.material = wasArray ? mapped : mapped[0];
      });
      car.add(obj);
    });

  return { group: car, wheels: [] };
}

function createSky(scene, sunDirection) {
  // A physically-based atmosphere dome, not a flat color — scaled to sit
  // comfortably inside the camera's far plane (260) but well past where
  // fog (ends at 175) has already hidden the ground.
  const sky = new Sky();
  sky.scale.setScalar(220);
  const uniforms = sky.material.uniforms;
  // The scene's actual sun sits fairly high (for clean shadows), but that
  // reads as a bright midday sky, which clashes with this scene's dark,
  // moody ground/fog palette. Sky-only, we borrow the sun's compass
  // bearing (so the glow shows up on the correct side) but use a lower
  // virtual elevation for a dusk-toned atmosphere — the actual light/
  // shadows on the ground are untouched.
  const duskDirection = new THREE.Vector3(sunDirection.x, sunDirection.y * 0.22, sunDirection.z).normalize();
  uniforms.turbidity.value = 12;
  uniforms.rayleigh.value = 1.3;
  uniforms.mieCoefficient.value = 0.009;
  uniforms.mieDirectionalG.value = 0.85;
  uniforms.sunPosition.value.copy(duskDirection);
  scene.add(sky);
}

function createCloudTexture() {
  return createCanvasTexture((context, width, height) => {
    context.clearRect(0, 0, width, height);
    const puffs = [
      [0.5, 0.55, 0.34], [0.3, 0.6, 0.24], [0.72, 0.58, 0.27],
      [0.42, 0.4, 0.22], [0.62, 0.4, 0.2],
    ];
    puffs.forEach(([cx, cy, r]) => {
      const gradient = context.createRadialGradient(cx * width, cy * height, 0, cx * width, cy * height, r * width);
      gradient.addColorStop(0, 'rgba(255,255,255,.95)');
      gradient.addColorStop(0.7, 'rgba(255,255,255,.5)');
      gradient.addColorStop(1, 'rgba(255,255,255,0)');
      context.fillStyle = gradient;
      context.beginPath();
      context.arc(cx * width, cy * height, r * width, 0, Math.PI * 2);
      context.fill();
    });
  }, 256, 160);
}

// Camera-facing sprites (cheap: two triangles each), scattered in a ring
// around the whole world so a few are visible from anywhere on the road,
// at a height well above the buildings/trees.
function createClouds(scene) {
  const texture = createCloudTexture();
  const cloudMaterial = new THREE.SpriteMaterial({ map: texture, transparent: true, depthWrite: false, opacity: 0.88, fog: false });
  const random = seededRandom();
  const centerX = (WORLD_BOUNDS.minX + WORLD_BOUNDS.maxX) / 2;
  const centerZ = (WORLD_BOUNDS.minZ + WORLD_BOUNDS.maxZ) / 2;
  for (let index = 0; index < 22; index += 1) {
    const sprite = new THREE.Sprite(cloudMaterial);
    const angle = random() * Math.PI * 2;
    const radius = 50 + random() * 140;
    sprite.position.set(
      centerX + Math.cos(angle) * radius,
      58 + random() * 40,
      centerZ + Math.sin(angle) * radius,
    );
    const scale = 24 + random() * 28;
    sprite.scale.set(scale * 1.6, scale, 1);
    scene.add(sprite);
  }
}

function createEnvironment(scene) {
  scene.background = null;
  scene.fog = new THREE.Fog(COLORS.background, 75, 175);
  const width = WORLD_BOUNDS.maxX - WORLD_BOUNDS.minX + 80;
  const depth = WORLD_BOUNDS.maxZ - WORLD_BOUNDS.minZ + 80;
  const groundMap = createGrassGroundTexture();
  groundMap.wrapS = THREE.RepeatWrapping;
  groundMap.wrapT = THREE.RepeatWrapping;
  const tileSize = 9;
  groundMap.repeat.set(width / tileSize, depth / tileSize);
  groundMap.anisotropy = 8;
  const ground = new THREE.Mesh(new THREE.PlaneGeometry(width, depth), new THREE.MeshStandardMaterial({ map: groundMap, roughness: 1 }));
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

  createSky(scene, sun.position);
  createClouds(scene);
}

export function buildWorld(scene) {
  createEnvironment(scene);
  const road = createRoad(scene);
  createTreeInstances(scene, road);
  createDetailedTreeInstances(scene, road);
  createGrassTufts(scene, road);
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
