import * as THREE from "three";
import { connections, stages, workflowNodes } from "./data.js";

const clamp = THREE.MathUtils.clamp;
const NODE_WIDTH = 2.72;
const NODE_DEPTH = 3.34;
const nodeById = new Map(workflowNodes.map((node, index) => [node.id, { node, index }]));
const stageEdges = [[0], [1], [2, 3], [4, 5], [6, 7, 8, 9, 10], [11, 12, 13, 14], [15, 16, 17]];
const stageViews = [
  { target: [-11.8, 4], span: 10, vertical: 6.5 }, { target: [-5, 4], span: 8, vertical: 6.5 }, { target: [0, 4], span: 10.5, vertical: 12 },
  { target: [2.5, 4], span: 13, vertical: 12 }, { target: [12.5, 4], span: 14, vertical: 18.5 }, { target: [17.5, 4], span: 14, vertical: 18.5 }, { target: [26.5, 4], span: 11, vertical: 7 },
];
const channelLayout = new Map([["instagram", 11], ["linkedin", 6.3], ["facebook", 1.6], ["x", -3.1]]);
workflowNodes.forEach((node) => { if (channelLayout.has(node.id)) node.position[2] = channelLayout.get(node.id); });

export function createWorld(canvas, callbacks = {}) {
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: "high-performance" });
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1;
  renderer.shadowMap.enabled = matchMedia("(min-width: 900px)").matches;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;

  const scene = new THREE.Scene();
  scene.fog = new THREE.Fog(0x071020, 40, 92);
  const camera = new THREE.PerspectiveCamera(47, 1, 0.1, 140);
  const target = new THREE.Vector3(-3.5, 0, 4);
  const desiredTarget = target.clone();
  let yaw = -0.08; let pitch = 1.02; let distance = 28; let desiredDistance = 28; let overviewMode = true;
  let viewportWidth = 1; let viewportHeight = 1;

  scene.add(new THREE.HemisphereLight(0xbfd4ff, 0x020611, 1.45));
  const key = new THREE.DirectionalLight(0xdce8ff, 3.7); key.position.set(-11, 24, 13); key.castShadow = true; key.shadow.mapSize.set(2048, 2048); scene.add(key);
  const violet = new THREE.DirectionalLight(0x765cff, 2.2); violet.position.set(14, 10, -12); scene.add(violet);
  const cyan = new THREE.PointLight(0x8fd7df, 9, 34); cyan.position.set(10, 5, 4); scene.add(cyan);

  const floor = new THREE.Mesh(new THREE.PlaneGeometry(64, 28), new THREE.MeshStandardMaterial({ color: 0x0d1730, roughness: 0.9, metalness: 0.04 }));
  floor.rotation.x = -Math.PI / 2; floor.position.set(7.5, -0.22, 4); floor.receiveShadow = true; scene.add(floor);
  const board = new THREE.Mesh(new THREE.BoxGeometry(60, 0.26, 25), new THREE.MeshStandardMaterial({ color: 0x101a32, roughness: 0.84, metalness: 0.06 }));
  board.position.set(7.5, -0.34, 4); board.receiveShadow = true; scene.add(board);
  const grid = new THREE.GridHelper(60, 60, 0x263761, 0x172744); grid.position.set(7.5, -0.14, 4); grid.material.transparent = true; grid.material.opacity = 0.11; scene.add(grid);

  const nodeGroups = []; const clickable = []; const edges = [];
  const darkMaterial = new THREE.MeshStandardMaterial({ color: 0x070c18, roughness: 0.34, metalness: 0.58 });
  const cardMaterial = new THREE.MeshStandardMaterial({ color: 0x111a2e, roughness: 0.42, metalness: 0.28 });
  const shadowMaterial = new THREE.MeshStandardMaterial({ color: 0x01030a, transparent: true, opacity: 0.72, roughness: 1, depthWrite: false });
  const packetGlowTexture = makeGlowTexture();

  function colorCss(color) { return `#${color.toString(16).padStart(6, "0")}`; }
  function roundedRect(context, x, y, width, height, radius) { context.beginPath(); context.roundRect(x, y, width, height, radius); context.closePath(); }
  function roundedBoxGeometry(width, depth, height, radius = .18, bevel = .035) {
    const x = width / 2; const z = depth / 2; const shape = new THREE.Shape();
    shape.moveTo(-x + radius, -z); shape.lineTo(x - radius, -z); shape.quadraticCurveTo(x, -z, x, -z + radius);
    shape.lineTo(x, z - radius); shape.quadraticCurveTo(x, z, x - radius, z); shape.lineTo(-x + radius, z);
    shape.quadraticCurveTo(-x, z, -x, z - radius); shape.lineTo(-x, -z + radius); shape.quadraticCurveTo(-x, -z, -x + radius, -z);
    const geometry = new THREE.ExtrudeGeometry(shape, { depth: height, bevelEnabled: true, bevelSegments: 3, bevelSize: bevel, bevelThickness: bevel, curveSegments: 8, steps: 1 });
    geometry.center(); geometry.rotateX(Math.PI / 2); return geometry;
  }
  function addMesh(group, geometry, material, position, rotation) { const mesh = new THREE.Mesh(geometry, material); mesh.position.set(...position); if (rotation) mesh.rotation.set(...rotation); mesh.castShadow = true; mesh.receiveShadow = true; group.add(mesh); return mesh; }
  function fitText(context, text, maxWidth, initialSize, minimumSize = 58) { let size = initialSize; do { context.font = `750 ${size}px Arial`; if (context.measureText(text).width <= maxWidth) return size; size -= 4; } while (size >= minimumSize); return minimumSize; }
  function wrapText(context, text, x, y, maxWidth, lineHeight, maxLines = 3) { const words = text.split(" "); const lines = []; let line = ""; words.forEach((word) => { const test = line ? `${line} ${word}` : word; if (context.measureText(test).width > maxWidth && line) { lines.push(line); line = word; } else line = test; }); if (line) lines.push(line); lines.slice(0, maxLines).forEach((item, index) => context.fillText(item, x, y + index * lineHeight)); }
  function makeGlowTexture() { const c = document.createElement("canvas"); c.width = 256; c.height = 256; const x = c.getContext("2d"); const gradient = x.createRadialGradient(128, 128, 2, 128, 128, 128); gradient.addColorStop(0, "rgba(255,255,255,1)"); gradient.addColorStop(.16, "rgba(255,255,255,.9)"); gradient.addColorStop(.42, "rgba(255,255,255,.28)"); gradient.addColorStop(1, "rgba(255,255,255,0)"); x.fillStyle = gradient; x.fillRect(0, 0, 256, 256); const texture = new THREE.CanvasTexture(c); texture.colorSpace = THREE.SRGBColorSpace; return texture; }
  function makeFlowTexture(color) { const c = document.createElement("canvas"); c.width = 1024; c.height = 64; const x = c.getContext("2d"); const gradient = x.createLinearGradient(0, 0, 1024, 0); gradient.addColorStop(0, "rgba(255,255,255,0)"); gradient.addColorStop(.08, colorCss(color)); gradient.addColorStop(.38, "#ffffff"); gradient.addColorStop(.68, colorCss(color)); gradient.addColorStop(.78, "rgba(255,255,255,0)"); gradient.addColorStop(1, "rgba(255,255,255,0)"); x.fillStyle = gradient; x.fillRect(0, 13, 1024, 38); const texture = new THREE.CanvasTexture(c); texture.colorSpace = THREE.SRGBColorSpace; texture.wrapS = THREE.RepeatWrapping; texture.wrapT = THREE.ClampToEdgeWrapping; return texture; }

  function makeNodeTexture(node) {
    const surface = document.createElement("canvas"); surface.width = 1024; surface.height = 1400; const context = surface.getContext("2d");
    const color = colorCss(node.color); const background = context.createLinearGradient(0, 0, 1024, 1400); background.addColorStop(0, "#18243c"); background.addColorStop(1, "#0b1222"); context.fillStyle = background; roundedRect(context, 18, 18, 988, 1364, 88); context.fill();
    context.shadowColor = color; context.shadowBlur = 28; context.strokeStyle = color; context.globalAlpha = .78; context.lineWidth = 7; context.stroke(); context.shadowBlur = 0; context.globalAlpha = 1;
    context.fillStyle = "rgba(255,255,255,.06)"; roundedRect(context, 72, 96, 880, 116, 46); context.fill(); context.fillStyle = color; context.font = "800 58px Arial"; context.textAlign = "center"; context.textBaseline = "middle"; context.fillText(String(node.stage + 1).padStart(2, "0"), 512, 155);
    const initials = node.name.split(/\s|\//).filter(Boolean).slice(0, 2).map((word) => word[0]).join("").toUpperCase(); context.shadowColor = color; context.shadowBlur = 32; context.strokeStyle = color; context.lineWidth = 7; context.beginPath(); context.roundRect(340, 278, 344, 250, 72); context.stroke(); context.shadowBlur = 0; context.fillStyle = color; context.font = "800 92px Arial"; context.fillText(initials, 512, 405);
    context.fillStyle = "#ffffff"; context.font = "700 72px Arial"; wrapText(context, node.name, 512, 650, 800, 84, 2); context.fillStyle = "#7f8ca8"; context.font = "650 34px Arial"; context.fillText(node.kind.toUpperCase(), 512, 828);
    context.strokeStyle = "rgba(146,164,201,.2)"; context.lineWidth = 3; context.beginPath(); context.moveTo(116, 900); context.lineTo(908, 900); context.stroke(); context.fillStyle = "#c8d2e6"; context.font = "500 38px Arial"; wrapText(context, node.output, 512, 1010, 800, 54, 3); context.fillStyle = color; context.font = "700 28px Arial"; context.fillText("CONNECTED", 512, 1285);
    const texture = new THREE.CanvasTexture(surface); texture.colorSpace = THREE.SRGBColorSpace; texture.anisotropy = Math.min(16, renderer.capabilities.getMaxAnisotropy()); return texture;
  }

  function addWorldIntro() { const c = document.createElement("canvas"); c.width = 1800; c.height = 640; const x = c.getContext("2d"); x.fillStyle = "#7c6cff"; x.font = "800 54px Arial"; x.textAlign = "left"; x.fillText("LIVE SOCIAL AUTOMATION", 40, 90); x.fillStyle = "#f5f7ff"; x.font = "700 118px Arial"; x.fillText("One brief.", 40, 245); x.font = "500 86px Georgia"; x.fillStyle = "#aebbe1"; x.fillText("One connected campaign.", 40, 365); x.fillStyle = "#8491ad"; x.font = "500 38px Arial"; x.fillText("Drag to explore  ·  Tap any node  ·  Run the complete workflow", 40, 490); const texture = new THREE.CanvasTexture(c); texture.colorSpace = THREE.SRGBColorSpace; const panel = new THREE.Mesh(new THREE.PlaneGeometry(9.8, 3.5), new THREE.MeshBasicMaterial({ map: texture, transparent: true, toneMapped: false, depthWrite: false })); panel.rotation.x = -Math.PI / 2; panel.position.set(-9.5, .03, -2.2); scene.add(panel); }
  addWorldIntro();

  function makeFlag(text, color) { const c = document.createElement("canvas"); c.width = 1024; c.height = 220; const x = c.getContext("2d"); x.fillStyle = "rgba(255,255,255,.98)"; roundedRect(x, 8, 8, 1008, 204, 70); x.fill(); x.strokeStyle = colorCss(color); x.lineWidth = 10; x.stroke(); x.fillStyle = "#2a2342"; x.font = "800 62px Arial"; x.textAlign = "center"; x.textBaseline = "middle"; x.fillText(text, 512, 113); const texture = new THREE.CanvasTexture(c); texture.colorSpace = THREE.SRGBColorSpace; return new THREE.Sprite(new THREE.SpriteMaterial({ map: texture, transparent: true, depthTest: false })); }

  function createNode(node, index) {
    const group = new THREE.Group(); group.position.set(...node.position); group.userData = { index, active: false, rail: null, aura: null, cardMaterial: null };
    const auraMaterial = new THREE.MeshBasicMaterial({ map: packetGlowTexture, color: node.color, transparent: true, opacity: 0, blending: THREE.AdditiveBlending, depthWrite: false, toneMapped: false });
    const aura = new THREE.Mesh(new THREE.PlaneGeometry(4.7, 5.2), auraMaterial); aura.rotation.x = -Math.PI / 2; aura.position.y = .025; group.add(aura); group.userData.aura = aura;
    addMesh(group, roundedBoxGeometry(NODE_WIDTH + .28, NODE_DEPTH + .26, .08, .26, .02), shadowMaterial, [0, .005, .17]);
    addMesh(group, roundedBoxGeometry(NODE_WIDTH, NODE_DEPTH, .34, .22, .045), darkMaterial, [0, .2, 0]);
    const nodeCardMaterial = cardMaterial.clone(); nodeCardMaterial.emissive = new THREE.Color(node.color); nodeCardMaterial.emissiveIntensity = .035; group.userData.cardMaterial = nodeCardMaterial;
    addMesh(group, roundedBoxGeometry(NODE_WIDTH - .1, NODE_DEPTH - .1, .075, .19, .022), nodeCardMaterial, [0, .405, 0]);
    const accent = new THREE.MeshStandardMaterial({ color: node.color, emissive: node.color, emissiveIntensity: .48, roughness: .22, metalness: .26 });
    const rail = addMesh(group, roundedBoxGeometry(NODE_WIDTH - .28, .11, .06, .055, .01), accent, [0, .49, -(NODE_DEPTH / 2 - .12)]); group.userData.rail = rail;
    const face = new THREE.Mesh(new THREE.PlaneGeometry(NODE_WIDTH - .22, NODE_DEPTH - .22), new THREE.MeshBasicMaterial({ map: makeNodeTexture(node), toneMapped: false, transparent: true, alphaTest: .015 })); face.rotation.x = -Math.PI / 2; face.position.y = .505; group.add(face);
    [-1, 1].forEach((side) => { const ring = addMesh(group, new THREE.TorusGeometry(.13, .042, 12, 28), new THREE.MeshStandardMaterial({ color: node.color, emissive: node.color, emissiveIntensity: .62, metalness: .28, roughness: .34 }), [side * (NODE_WIDTH / 2 + .06), .34, 0], [Math.PI / 2, 0, 0]); ring.userData.index = index; const core = addMesh(group, new THREE.SphereGeometry(.062, 16, 10), new THREE.MeshBasicMaterial({ color: 0xfffdf7 }), [side * (NODE_WIDTH / 2 + .06), .34, 0]); core.userData.index = index; });
    if (node.kind === "OUTPUT") { const ring = addMesh(group, new THREE.RingGeometry(2.05, 2.2, 72), new THREE.MeshBasicMaterial({ color: node.color, transparent: true, opacity: .34, side: THREE.DoubleSide, blending: THREE.AdditiveBlending }), [0, -.07, 0], [-Math.PI / 2, 0, 0]); group.userData.outputRing = ring; }
    clickable.push(group); nodeGroups.push(group); scene.add(group);
  }
  workflowNodes.forEach(createNode);

  function routePoints(from, to, feedback) {
    const a = new THREE.Vector3(...from.position); const b = new THREE.Vector3(...to.position); a.x += NODE_WIDTH / 2 + .08; b.x -= NODE_WIDTH / 2 + .08; a.y = b.y = .25;
    if (feedback) return [a, new THREE.Vector3(31.8, .25, -4.4), new THREE.Vector3(-7.4, .25, -4.4), new THREE.Vector3(-7.4, .25, 4), b];
    if (Math.abs(a.z - b.z) < .2) return [a, b];
    const laneX = from.id === "brand-context" ? -2.45 : from.id === "router" ? 12.45 : ["instagram", "linkedin", "facebook", "x"].includes(from.id) ? 17.55 : (a.x + b.x) / 2;
    return [a, new THREE.Vector3(laneX, .25, a.z), new THREE.Vector3(laneX, .25, b.z), b];
  }

  function createPacket(color, scale = 1) {
    const group = new THREE.Group(); const glow = new THREE.Sprite(new THREE.SpriteMaterial({ map: packetGlowTexture, color, transparent: true, opacity: .72, blending: THREE.AdditiveBlending, depthWrite: false })); glow.scale.set(.62 * scale, .62 * scale, 1); group.add(glow);
    const shell = new THREE.Mesh(new THREE.SphereGeometry(.105 * scale, 16, 10), new THREE.MeshBasicMaterial({ color, blending: THREE.AdditiveBlending })); group.add(shell);
    const core = new THREE.Mesh(new THREE.SphereGeometry(.052 * scale, 14, 8), new THREE.MeshBasicMaterial({ color: 0xffffff })); group.add(core); group.visible = false; return group;
  }

  function createCable(connection, edgeIndex) {
    const [fromId, toId, options = {}] = connection; const from = nodeById.get(fromId).node; const to = nodeById.get(toId).node;
    const curve = new THREE.CatmullRomCurve3(routePoints(from, to, options.feedback), false, "centripetal", .38); const length = curve.getLength();
    const shadow = new THREE.Mesh(new THREE.TubeGeometry(curve, Math.max(48, Math.round(length * 9)), .14, 12, false), new THREE.MeshStandardMaterial({ color: 0x01040c, transparent: true, opacity: .74, roughness: .72, metalness: .22, depthWrite: false })); shadow.position.y = -.075; scene.add(shadow);
    const casingMaterial = new THREE.MeshStandardMaterial({ color: 0x10192e, emissive: to.color, emissiveIntensity: .09, metalness: .72, roughness: .24, transparent: true, opacity: .9, depthWrite: false });
    const casing = new THREE.Mesh(new THREE.TubeGeometry(curve, Math.max(48, Math.round(length * 9)), .085, 12, false), casingMaterial); scene.add(casing);
    const flowTexture = makeFlowTexture(to.color); flowTexture.repeat.set(Math.max(1, length / 1.4), 1);
    const flowMaterial = new THREE.MeshBasicMaterial({ map: flowTexture, color: to.color, transparent: true, opacity: .46, blending: THREE.AdditiveBlending, depthWrite: false });
    const fiber = new THREE.Mesh(new THREE.TubeGeometry(curve, Math.max(48, Math.round(length * 9)), .034, 10, false), flowMaterial); scene.add(fiber);
    const glowMaterial = new THREE.MeshBasicMaterial({ color: to.color, transparent: true, opacity: .035, blending: THREE.AdditiveBlending, depthWrite: false });
    const glow = new THREE.Mesh(new THREE.TubeGeometry(curve, Math.max(48, Math.round(length * 9)), .125, 10, false), glowMaterial); scene.add(glow);
    const arrow = new THREE.Mesh(new THREE.ConeGeometry(.135, .34, 16), new THREE.MeshStandardMaterial({ color: to.color, emissive: to.color, emissiveIntensity: .72, metalness: .28, roughness: .2, transparent: true, opacity: .86 })); const arrowT = options.feedback ? .54 : .6; const arrowPoint = curve.getPoint(arrowT); const tangent = curve.getTangent(arrowT).normalize(); arrow.position.copy(arrowPoint).setY(.3); arrow.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), tangent); scene.add(arrow);
    const packetCount = options.feedback || length > 8 ? 6 : length < 3 ? 4 : 5; const packets = Array.from({ length: packetCount }, (_, index) => { const packet = createPacket(to.color, index === 0 ? 1.05 : .82); scene.add(packet); return packet; });
    const light = new THREE.PointLight(to.color, 0, 2.2); scene.add(light);
    edges.push({ edgeIndex, curve, length, flowTexture, flowMaterial, glowMaterial, casingMaterial, packets, light, fromId, toId, feedback: Boolean(options.feedback), complete: false });
  }
  connections.forEach(createCable);

  const raycaster = new THREE.Raycaster(); const pointer = new THREE.Vector2();
  let selected = 0; let stage = -1; let progress = 0; let running = false; let paused = false; let completed = false; let last = performance.now();
  const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;

  function getViewDistance(span, verticalSpan = 7) { const vfov = THREE.MathUtils.degToRad(camera.fov); const aspect = Math.max(.35, camera.aspect); const hfov = 2 * Math.atan(Math.tan(vfov / 2) * aspect); return Math.max((span / 2) / Math.tan(hfov / 2), (verticalSpan / 2) / Math.tan(vfov / 2)) * 1.28; }
  function overview(snap = false) { overviewMode = true; desiredTarget.set(viewportWidth < 620 ? -5.8 : viewportWidth < 960 ? -2.8 : .4, 0, 1.5); const span = viewportWidth < 540 ? 18 : viewportWidth < 900 ? 22 : 29; desiredDistance = getViewDistance(span, 13.5) * 1.08; yaw = -.065; pitch = viewportWidth < 700 ? 1.12 : 1.02; if (snap) { target.copy(desiredTarget); distance = desiredDistance; camera.position.set(target.x + Math.sin(yaw) * Math.cos(pitch) * distance, target.y + Math.sin(pitch) * distance, target.z + Math.cos(yaw) * Math.cos(pitch) * distance); camera.lookAt(target); } }
  function focusStage(index) { overviewMode = false; const view = stageViews[index]; desiredTarget.set(view.target[0], 0, view.target[1]); if (viewportWidth < 620 && index === 2) { desiredTarget.set(0, 0, 4); desiredDistance = getViewDistance(5.1, 10.6); return; } if (viewportWidth < 620 && index === 4) { desiredTarget.set(14.2, 0, 4); desiredDistance = getViewDistance(5.6, 18.2) * .9; return; } const responsiveSpan = viewportWidth < 540 ? view.span * .82 : viewportWidth < 900 ? view.span * .94 : view.span; desiredDistance = getViewDistance(responsiveSpan, view.vertical || 6.5); }
  function select(index, focus = false, notify = true) { selected = index; nodeGroups.forEach((group, i) => { group.userData.active = i === index; }); if (notify) callbacks.onSelect?.(index); if (focus) { const node = workflowNodes[index]; overviewMode = false; desiredTarget.set(node.position[0], 0, node.position[2]); desiredDistance = getViewDistance(viewportWidth < 540 ? 7.2 : 6.2, 5); } }
  function selectStage(index, focus = false) { const nodeIndex = workflowNodes.findIndex((node) => node.stage === index); select(nodeIndex, false); if (focus) focusStage(index); }
  function beginStage(index) { stage = index; progress = 0; const stageDestinations = [...new Set(stageEdges[index].map((edgeIndex) => edges[edgeIndex].toId))]; const nodeIndex = nodeById.get(stageDestinations[0]).index; select(nodeIndex, false, false); if (stageDestinations.length === 1) { const node = workflowNodes[nodeIndex]; overviewMode = false; desiredTarget.set(node.position[0], 0, node.position[2]); desiredDistance = getViewDistance(viewportWidth < 620 ? 4.6 : 5.8, viewportWidth < 620 ? 5.3 : 5.8); } else focusStage(index); callbacks.onStage?.(index, nodeIndex); }
  function start() { if (completed) reset(); if (stage < 0) beginStage(0); running = true; paused = false; callbacks.onRunning?.(true); }
  function toggle() { if (!running && !completed) start(); else if (running) { paused = !paused; callbacks.onRunning?.(!paused); } else start(); }
  function reset() { stage = -1; progress = 0; running = false; paused = false; completed = false; edges.forEach((edge) => { edge.complete = false; edge.flowMaterial.opacity = .28; edge.glowMaterial.opacity = .035; edge.casingMaterial.emissiveIntensity = .04; edge.casingMaterial.opacity = .7; edge.packets.forEach((packet) => { packet.visible = false; }); edge.light.intensity = 0; }); callbacks.onReset?.(); select(0); overview(); }

  let pointerDown = false; let moved = false; let previous = { x: 0, y: 0 }; let pinchDistance = 0;
  canvas.addEventListener("pointerdown", (event) => { pointerDown = true; moved = false; previous = { x: event.clientX, y: event.clientY }; canvas.setPointerCapture(event.pointerId); });
  canvas.addEventListener("pointermove", (event) => { if (!pointerDown) return; const dx = event.clientX - previous.x; const dy = event.clientY - previous.y; if (Math.abs(dx) + Math.abs(dy) > 4) moved = true; const panScale = distance * .00155; desiredTarget.x = clamp(desiredTarget.x - dx * panScale, -12.5, 28); desiredTarget.z = clamp(desiredTarget.z - dy * panScale, -1.2, 9.2); overviewMode = false; previous = { x: event.clientX, y: event.clientY }; });
  canvas.addEventListener("pointerup", (event) => { pointerDown = false; if (moved) return; const rect = canvas.getBoundingClientRect(); pointer.set(((event.clientX - rect.left) / rect.width) * 2 - 1, -((event.clientY - rect.top) / rect.height) * 2 + 1); raycaster.setFromCamera(pointer, camera); const hit = raycaster.intersectObjects(clickable, true)[0]; if (!hit) return; let group = hit.object; while (group && group.userData.index === undefined) group = group.parent; if (group) select(group.userData.index, true); });
  canvas.addEventListener("pointercancel", () => { pointerDown = false; });
  canvas.addEventListener("wheel", (event) => { event.preventDefault(); overviewMode = false; if (Math.abs(event.deltaX) > Math.abs(event.deltaY) || event.shiftKey) desiredTarget.x = clamp(desiredTarget.x + (event.deltaX || event.deltaY) * .018, -12.5, 28); else desiredDistance = clamp(desiredDistance + event.deltaY * .014, 8, 68); }, { passive: false });
  canvas.addEventListener("touchmove", (event) => { if (event.touches.length === 2) { const current = Math.hypot(event.touches[0].clientX - event.touches[1].clientX, event.touches[0].clientY - event.touches[1].clientY); if (pinchDistance) desiredDistance = clamp(desiredDistance + (pinchDistance - current) * .028, 8, 68); pinchDistance = current; overviewMode = false; } else pinchDistance = 0; }, { passive: true });
  canvas.addEventListener("touchend", () => { pinchDistance = 0; }, { passive: true });

  function resize() { const width = canvas.clientWidth; const height = canvas.clientHeight; if (!width || !height || (width === viewportWidth && height === viewportHeight)) return; viewportWidth = width; viewportHeight = height; renderer.setPixelRatio(Math.min(devicePixelRatio, width < 540 ? 1.35 : width < 1000 ? 1.65 : 2)); renderer.setSize(width, height, false); camera.aspect = width / height; camera.fov = width < 540 ? 62 : width < 900 ? 55 : 47; camera.updateProjectionMatrix(); if (overviewMode) overview(true); }
  new ResizeObserver(resize).observe(canvas); resize();

  function animate(now) {
    requestAnimationFrame(animate); const dt = Math.min((now - last) / 1000, .05); last = now;
    edges.forEach((edge) => { edge.flowTexture.offset.x -= dt * (running && !paused ? 1.05 : .12); });
    if (running && !paused && stage >= 0) {
      const duration = reduced ? .28 : stage === 4 ? 1.7 : 1.42; progress += dt / duration;
      stageEdges[stage].forEach((edgeIndex, lane) => {
        const edge = edges[edgeIndex]; edge.flowMaterial.opacity = .82; edge.glowMaterial.opacity = .1; edge.casingMaterial.emissiveIntensity = .5; edge.casingMaterial.opacity = .82;
        edge.packets.forEach((packet, packetIndex) => { const raw = progress * (edge.feedback ? 1.35 : 1.85) - packetIndex * .13 - lane * .022; packet.visible = raw >= 0 && progress < 1; if (!packet.visible) return; const point = edge.curve.getPoint(raw % 1); packet.position.copy(point).setY(point.y + .065); if (packetIndex === 0) { edge.light.position.copy(point); edge.light.intensity = 5.5; } });
      });
      if (progress >= 1) {
        stageEdges[stage].forEach((edgeIndex) => { const edge = edges[edgeIndex]; edge.complete = true; edge.packets.forEach((packet) => { packet.visible = false; }); edge.light.intensity = 0; edge.flowMaterial.opacity = .66; edge.glowMaterial.opacity = .08; edge.casingMaterial.emissiveIntensity = .34; edge.casingMaterial.opacity = .76; });
        if (stage < stages.length - 1) beginStage(stage + 1); else { running = false; completed = true; focusStage(6); const outputIndex = nodeById.get("campaign-output").index; select(outputIndex, false, false); callbacks.onComplete?.(); callbacks.onRunning?.(false); }
      }
    }
    const receivingNodes = running && !paused && stage >= 0 ? new Set(stageEdges[stage].map((edgeIndex) => edges[edgeIndex].toId)) : null;
    const arrivalGlow = receivingNodes ? THREE.MathUtils.smoothstep(progress, .48, .84) : 0;
    nodeGroups.forEach((group, index) => { const active = group.userData.active; const node = workflowNodes[index]; const receivingSignal = Boolean(receivingNodes?.has(node.id)); const signalGlow = receivingSignal ? arrivalGlow : 0; const targetY = active ? .28 : 0; group.position.y += (targetY - group.position.y) * .1; const scale = active ? 1.055 : 1; group.scale.lerp(new THREE.Vector3(scale, scale, scale), .1); group.rotation.y = Math.sin(now * .00032 + index) * .006; const railTarget = .48 + (active ? .35 : 0) + signalGlow * 2.35; group.userData.rail.material.emissiveIntensity += (railTarget - group.userData.rail.material.emissiveIntensity) * .12; group.userData.cardMaterial.emissiveIntensity += ((.035 + signalGlow * .72) - group.userData.cardMaterial.emissiveIntensity) * .1; group.userData.aura.material.opacity += (((active ? .035 : 0) + signalGlow * .34) - group.userData.aura.material.opacity) * .11; const auraScale = 1 + signalGlow * .12; group.userData.aura.scale.lerp(new THREE.Vector3(auraScale, auraScale, 1), .1); if (group.userData.outputRing) { group.userData.outputRing.rotation.z += dt * .22; group.userData.outputRing.material.opacity = completed ? .58 + Math.sin(now * .003) * .12 : .22; } });
    target.lerp(desiredTarget, reduced ? 1 : .07); distance += (desiredDistance - distance) * (reduced ? 1 : .075);
    const cameraPosition = new THREE.Vector3(target.x + Math.sin(yaw) * Math.cos(pitch) * distance, target.y + Math.sin(pitch) * distance, target.z + Math.cos(yaw) * Math.cos(pitch) * distance); camera.position.lerp(cameraPosition, reduced ? 1 : .095); camera.lookAt(target); renderer.render(scene, camera);
  }
  select(0); overview(true); requestAnimationFrame(animate);
  return { start, toggle, reset, overview, select, selectStage, get running() { return running && !paused; }, get completed() { return completed; } };
}
