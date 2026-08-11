"use client";

import Link from "next/link";
import { ArrowRight, Check, Volume2, VolumeX } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import styles from "./social-universe.module.css";

const PLATFORMS = [
  { id: "instagram", short: "IG", name: "Instagram", color: "#f15bb5", line: "Build a brand people choose to follow.", services: ["Content strategy", "Reels creation", "Brand growth", "Community management"] },
  { id: "facebook", short: "f", name: "Facebook", color: "#4d8dff", line: "Build communities. Generate customers.", services: ["Campaign planning", "Community growth", "Lead generation", "Audience care"] },
  { id: "tiktok", short: "♪", name: "TikTok", color: "#25f4ee", line: "Turn creativity into reach.", services: ["Trend research", "Short-form concepts", "Creator direction", "Performance learning"] },
  { id: "youtube", short: "▶", name: "YouTube", color: "#ff4d55", line: "Create content people remember.", services: ["Channel strategy", "Video packaging", "Shorts system", "Audience growth"] },
  { id: "linkedin", short: "in", name: "LinkedIn", color: "#63a8ff", line: "Build authority in your industry.", services: ["Executive voice", "Thought leadership", "Business networking", "Demand content"] },
] as const;

const CHAPTERS = [
  { id: "story", eyebrow: "A quiet office. A good business.", title: "Every business has a story…", body: "But not every story reaches the world.", align: "left" },
  { id: "silence", eyebrow: "The feed is quiet", title: "Great work. Almost no signal.", body: "Likes: 0. Reach: low. Followers: not growing.", align: "right" },
  { id: "complexity", eyebrow: "The real problem", title: "Growing online is complicated.", body: "The formats change. The platforms move. Random content cannot build a recognisable brand.", align: "left" },
  { id: "arrival", eyebrow: "Then the universe opens", title: "Five platforms. One connected story.", body: "Each channel arrives with a different role—not a copied-and-pasted post.", align: "right" },
  { id: "choice", eyebrow: "Choose your platform", title: "We create your growth.", body: "The strategy stays connected while every execution is made for its native audience.", align: "left" },
  { id: "instagram", eyebrow: "Instagram marketing", title: "From random content to a brand system.", body: "A clear identity, repeatable Reels and a community that recognises the business before it reads the name.", align: "right" },
  { id: "facebook", eyebrow: "Facebook + TikTok", title: "Community meets cultural momentum.", body: "Build trusted conversations on Facebook and translate fast-moving ideas into native TikTok reach.", align: "left" },
  { id: "authority", eyebrow: "YouTube + LinkedIn", title: "Turn expertise into lasting authority.", body: "Memorable video and credible professional insight keep working long after the first post.", align: "right" },
  { id: "growth", eyebrow: "The new ecosystem", title: "We don’t just manage social media.", body: "We grow businesses—with a recognisable brand, an active community and a measurement loop that keeps learning.", align: "left" },
] as const;

type Runtime = {
  scene: THREE.Scene;
  camera: THREE.PerspectiveCamera;
  renderer: THREE.WebGLRenderer;
  world: THREE.Group;
  office: THREE.Group;
  person: THREE.Group;
  head: THREE.Mesh;
  leftArm: THREE.Group;
  rightArm: THREE.Group;
  phone: THREE.Mesh;
  portal: THREE.Group;
  cubes: THREE.Group[];
  dashboard: THREE.Group;
  dashboardScreen: THREE.Mesh;
  dashboardMaterial: THREE.MeshBasicMaterial;
  frame: number;
  dispose: () => void;
};

const clamp = (value: number, min = 0, max = 1) => Math.min(max, Math.max(min, value));
const ease = (value: number) => { const t = clamp(value); return t * t * (3 - 2 * t); };
const range = (progress: number, start: number, end: number) => ease((progress - start) / (end - start));

function makeTextTexture(title: string, subtitle: string, accent: string) {
  const canvas = document.createElement("canvas");
  canvas.width = 1024;
  canvas.height = 640;
  const context = canvas.getContext("2d");
  if (!context) return new THREE.Texture();
  const gradient = context.createLinearGradient(0, 0, 1024, 640);
  gradient.addColorStop(0, "rgba(19, 24, 42, .97)");
  gradient.addColorStop(1, "rgba(8, 11, 20, .97)");
  context.fillStyle = gradient;
  context.fillRect(0, 0, 1024, 640);
  context.strokeStyle = accent;
  context.lineWidth = 10;
  context.strokeRect(12, 12, 1000, 616);
  context.fillStyle = accent;
  context.font = "700 32px Inter, Arial";
  context.fillText("SOCIAL GROWTH SYSTEM", 64, 78);
  context.fillStyle = "#fff8ec";
  context.font = "700 82px Inter, Arial";
  context.fillText(title, 64, 184);
  context.fillStyle = "rgba(255,248,236,.7)";
  context.font = "500 36px Inter, Arial";
  context.fillText(subtitle, 64, 244);
  [0.42, 0.68, 0.88].forEach((height, index) => {
    context.fillStyle = `${accent}${index === 2 ? "bb" : "66"}`;
    context.fillRect(70 + index * 210, 520 - height * 230, 120, height * 230);
  });
  context.strokeStyle = "rgba(255,255,255,.12)";
  context.lineWidth = 3;
  context.beginPath();
  context.moveTo(62, 526);
  context.bezierCurveTo(240, 474, 390, 510, 548, 388);
  context.bezierCurveTo(690, 282, 812, 332, 958, 218);
  context.stroke();
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

function roundedPlatform(color: string, label: string, index: number) {
  const group = new THREE.Group();
  const base = new THREE.Mesh(
    new THREE.BoxGeometry(1.42, 1.42, 1.42, 5, 5, 5),
    new THREE.MeshPhysicalMaterial({ color: 0x111624, metalness: 0.65, roughness: 0.2, clearcoat: 1, clearcoatRoughness: 0.1 })
  );
  base.castShadow = true;
  group.add(base);
  const outline = new THREE.LineSegments(
    new THREE.EdgesGeometry(base.geometry),
    new THREE.LineBasicMaterial({ color, transparent: true, opacity: 0.78 })
  );
  group.add(outline);
  const labelCanvas = document.createElement("canvas");
  labelCanvas.width = 512;
  labelCanvas.height = 512;
  const context = labelCanvas.getContext("2d");
  if (context) {
    context.fillStyle = color;
    context.fillRect(0, 0, 512, 512);
    context.fillStyle = "white";
    context.font = `700 ${label.length > 1 ? 210 : 300}px Inter, Arial`;
    context.textAlign = "center";
    context.textBaseline = "middle";
    context.fillText(label, 256, 270);
  }
  const texture = new THREE.CanvasTexture(labelCanvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  const face = new THREE.Mesh(new THREE.PlaneGeometry(1.05, 1.05), new THREE.MeshBasicMaterial({ map: texture }));
  face.position.z = 0.716;
  group.add(face);
  const floorGlow = new THREE.Mesh(
    new THREE.CircleGeometry(1.05, 48),
    new THREE.MeshBasicMaterial({ color, transparent: true, opacity: 0.18, blending: THREE.AdditiveBlending })
  );
  floorGlow.rotation.x = -Math.PI / 2;
  floorGlow.position.y = -0.82;
  group.add(floorGlow);
  group.userData.index = index;
  return group;
}

function createOffice() {
  const group = new THREE.Group();
  const wall = new THREE.MeshStandardMaterial({ color: 0x39445d, roughness: 0.72, metalness: 0.08 });
  const glass = new THREE.MeshPhysicalMaterial({ color: 0x9ad9ff, emissive: 0x1b5274, emissiveIntensity: 0.45, roughness: 0.12, metalness: 0.1, transparent: true, opacity: 0.62 });
  const body = new THREE.Mesh(new THREE.BoxGeometry(4.4, 4.1, 2.3), wall);
  body.position.y = 0.65;
  body.castShadow = true;
  group.add(body);
  for (let row = 0; row < 3; row += 1) {
    for (let col = 0; col < 3; col += 1) {
      const window = new THREE.Mesh(new THREE.BoxGeometry(0.82, 0.72, 0.06), glass);
      window.position.set(-1.1 + col * 1.08, 1.9 - row * 0.98, 1.18);
      group.add(window);
    }
  }
  const door = new THREE.Mesh(new THREE.BoxGeometry(1, 1.58, 0.08), glass);
  door.position.set(0, -1.03, 1.2);
  group.add(door);
  const sign = new THREE.Mesh(new THREE.BoxGeometry(2.2, 0.48, 0.12), new THREE.MeshStandardMaterial({ color: 0xf4ead6, emissive: 0x59482f, emissiveIntensity: 0.3 }));
  sign.position.set(0, 0.05, 1.27);
  group.add(sign);
  group.position.set(-3.8, 0, -1.2);
  return group;
}

function createPerson() {
  const group = new THREE.Group();
  const shirt = new THREE.MeshStandardMaterial({ color: 0xe8e1d6, roughness: 0.65 });
  const skin = new THREE.MeshStandardMaterial({ color: 0xc88765, roughness: 0.72 });
  const trousers = new THREE.MeshStandardMaterial({ color: 0x536557, roughness: 0.75 });
  const hair = new THREE.MeshStandardMaterial({ color: 0x15171c, roughness: 0.68 });
  const torso = new THREE.Mesh(new THREE.CapsuleGeometry(0.53, 1.15, 8, 24), shirt);
  torso.position.y = 0.35;
  torso.castShadow = true;
  group.add(torso);
  const head = new THREE.Mesh(new THREE.SphereGeometry(0.54, 32, 24), skin);
  head.position.y = 1.73;
  head.scale.set(0.86, 1, 0.9);
  head.castShadow = true;
  group.add(head);
  const hairCap = new THREE.Mesh(new THREE.SphereGeometry(0.55, 28, 16, 0, Math.PI * 2, 0, Math.PI * 0.52), hair);
  hairCap.position.y = 1.9;
  group.add(hairCap);
  [-0.2, 0.2].forEach((x) => {
    const eye = new THREE.Mesh(new THREE.SphereGeometry(0.055, 16, 10), new THREE.MeshBasicMaterial({ color: 0x17191f }));
    eye.position.set(x, 1.77, 0.46);
    group.add(eye);
  });
  const leftArm = new THREE.Group();
  const rightArm = new THREE.Group();
  [leftArm, rightArm].forEach((arm, index) => {
    const limb = new THREE.Mesh(new THREE.CapsuleGeometry(0.13, 0.9, 6, 16), shirt);
    limb.position.y = -0.43;
    limb.castShadow = true;
    arm.add(limb);
    arm.position.set(index === 0 ? -0.63 : 0.63, 0.8, 0);
    arm.rotation.z = index === 0 ? -0.18 : 0.18;
    group.add(arm);
  });
  [-0.27, 0.27].forEach((x) => {
    const leg = new THREE.Mesh(new THREE.CapsuleGeometry(0.17, 1.25, 6, 16), trousers);
    leg.position.set(x, -1.05, 0);
    leg.castShadow = true;
    group.add(leg);
  });
  const phone = new THREE.Mesh(new THREE.BoxGeometry(0.42, 0.72, 0.08), new THREE.MeshPhysicalMaterial({ color: 0x10141d, metalness: 0.65, roughness: 0.18, clearcoat: 1 }));
  phone.position.set(0.47, 0.52, 0.58);
  phone.rotation.z = -0.16;
  group.add(phone);
  group.position.set(-0.35, -0.75, 0.4);
  group.scale.setScalar(0.94);
  return { group, head, leftArm, rightArm, phone };
}

function buildScene(canvas: HTMLCanvasElement): Runtime {
  const scene = new THREE.Scene();
  scene.fog = new THREE.FogExp2(0x090d1b, 0.045);
  const camera = new THREE.PerspectiveCamera(35, 1, 0.1, 80);
  camera.position.set(0, 1.2, 11.5);
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: "high-performance" });
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.12;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;

  scene.add(new THREE.HemisphereLight(0xb6d8ff, 0x191127, 1.9));
  const key = new THREE.DirectionalLight(0xffdfc4, 3.4);
  key.position.set(-4, 8, 6);
  key.castShadow = true;
  key.shadow.mapSize.set(1024, 1024);
  scene.add(key);
  const portalLight = new THREE.PointLight(0xa657ff, 0, 18, 2);
  portalLight.position.set(0, 5, 1);
  scene.add(portalLight);

  const world = new THREE.Group();
  scene.add(world);
  const office = createOffice();
  world.add(office);
  const personParts = createPerson();
  world.add(personParts.group);

  const portal = new THREE.Group();
  const portalRing = new THREE.Mesh(new THREE.TorusGeometry(2.05, 0.12, 20, 96), new THREE.MeshBasicMaterial({ color: 0xb05cff, transparent: true, opacity: 0.9, blending: THREE.AdditiveBlending }));
  portalRing.rotation.x = Math.PI / 2;
  portal.add(portalRing);
  const portalCore = new THREE.Mesh(new THREE.CircleGeometry(1.85, 64), new THREE.MeshBasicMaterial({ color: 0x763cff, transparent: true, opacity: 0.16, blending: THREE.AdditiveBlending, side: THREE.DoubleSide }));
  portalCore.rotation.x = Math.PI / 2;
  portal.add(portalCore);
  portal.position.set(0.5, 4.7, -0.7);
  portal.scale.setScalar(0.01);
  world.add(portal);

  const cubes = PLATFORMS.map((platform, index) => {
    const cube = roundedPlatform(platform.color, platform.short, index);
    cube.position.set((index - 2) * 2, 6.3 + (index % 2) * 1.2, -0.2);
    cube.scale.setScalar(0.01);
    world.add(cube);
    return cube;
  });

  const dashboardMaterial = new THREE.MeshBasicMaterial({ map: makeTextTexture("Instagram", "A connected content system", PLATFORMS[0].color), transparent: true, opacity: 0 });
  const dashboardScreen = new THREE.Mesh(new THREE.PlaneGeometry(5.1, 3.2), dashboardMaterial);
  const dashboard = new THREE.Group();
  const backing = new THREE.Mesh(new THREE.BoxGeometry(5.32, 3.42, 0.2), new THREE.MeshPhysicalMaterial({ color: 0x111627, metalness: 0.55, roughness: 0.18, clearcoat: 1, transparent: true, opacity: 0.94 }));
  backing.position.z = -0.12;
  backing.castShadow = true;
  dashboard.add(backing, dashboardScreen);
  dashboard.position.set(2.25, 0.35, 0.2);
  dashboard.rotation.y = -0.18;
  dashboard.scale.setScalar(0.01);
  world.add(dashboard);

  const ground = new THREE.Mesh(new THREE.CircleGeometry(13, 96), new THREE.MeshStandardMaterial({ color: 0x11182a, roughness: 0.86, metalness: 0.06 }));
  ground.rotation.x = -Math.PI / 2;
  ground.position.y = -2.08;
  ground.receiveShadow = true;
  world.add(ground);

  const starsGeometry = new THREE.BufferGeometry();
  const positions = new Float32Array(280 * 3);
  for (let index = 0; index < positions.length; index += 3) {
    positions[index] = (Math.random() - 0.5) * 30;
    positions[index + 1] = Math.random() * 16 - 2;
    positions[index + 2] = -4 - Math.random() * 18;
  }
  starsGeometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
  scene.add(new THREE.Points(starsGeometry, new THREE.PointsMaterial({ color: 0x8fb3e8, size: 0.025, transparent: true, opacity: 0.5 })));

  const dispose = () => {
    scene.traverse((object) => {
      if (!(object instanceof THREE.Mesh) && !(object instanceof THREE.Points) && !(object instanceof THREE.LineSegments)) return;
      object.geometry.dispose();
      const materials = Array.isArray(object.material) ? object.material : [object.material];
      materials.forEach((material) => {
        if ("map" in material && material.map instanceof THREE.Texture) material.map.dispose();
        material.dispose();
      });
    });
    renderer.dispose();
  };

  return { scene, camera, renderer, world, office, person: personParts.group, head: personParts.head, leftArm: personParts.leftArm, rightArm: personParts.rightArm, phone: personParts.phone, portal, cubes, dashboard, dashboardScreen, dashboardMaterial, frame: 0, dispose };
}

function updateScene(runtime: Runtime, progress: number, elapsed: number, compact: boolean, reduced: boolean) {
  const officeFade = 1 - range(progress, 0.2, 0.38);
  runtime.office.scale.setScalar(0.82 + officeFade * 0.18);
  runtime.office.position.x = -3.8 - range(progress, 0.18, 0.36) * 4.5;
  runtime.person.position.x = -0.35 + range(progress, 0.18, 0.42) * 0.55;
  runtime.person.rotation.y = Math.sin(elapsed * 0.6) * 0.035;

  const frustration = range(progress, 0.08, 0.26) * (1 - range(progress, 0.3, 0.4));
  runtime.head.rotation.z = frustration * -0.15;
  runtime.leftArm.rotation.z = THREE.MathUtils.lerp(-0.18, -1.95, frustration);
  runtime.rightArm.rotation.z = THREE.MathUtils.lerp(0.18, 1.95, frustration);
  runtime.leftArm.rotation.x = frustration * -0.45;
  runtime.rightArm.rotation.x = frustration * -0.45;
  runtime.phone.visible = progress < 0.31;

  const portalOpen = range(progress, 0.27, 0.38) * (1 - range(progress, 0.53, 0.62));
  runtime.portal.scale.setScalar(Math.max(0.01, portalOpen * (compact ? 0.74 : 1)));
  runtime.portal.rotation.z = reduced ? 0 : elapsed * 0.35;
  const portalLight = runtime.scene.children.find((child) => child instanceof THREE.PointLight) as THREE.PointLight | undefined;
  if (portalLight) portalLight.intensity = portalOpen * 22;

  const fall = range(progress, 0.34, 0.48);
  const orbiting = range(progress, 0.78, 0.94);
  runtime.cubes.forEach((cube, index) => {
    const angle = (index / runtime.cubes.length) * Math.PI * 2 + elapsed * (orbiting ? 0.22 : 0.02);
    const landingX = Math.cos((index / runtime.cubes.length) * Math.PI * 2) * (compact ? 2.15 : 3.25);
    const landingZ = Math.sin((index / runtime.cubes.length) * Math.PI * 2) * 1.2;
    const landingY = -0.55 + Math.abs(index - 2) * 0.17;
    cube.scale.setScalar(Math.max(0.01, range(progress, 0.31 + index * 0.012, 0.4 + index * 0.012) * (compact ? 0.64 : 0.8)));
    cube.position.x = THREE.MathUtils.lerp((index - 2) * 1.2, landingX, fall);
    cube.position.y = THREE.MathUtils.lerp(5.4 + (index % 2), landingY, fall);
    cube.position.z = THREE.MathUtils.lerp(-0.3, landingZ, fall);
    if (orbiting > 0) {
      cube.position.x = THREE.MathUtils.lerp(landingX, Math.cos(angle) * (compact ? 2.05 : 3.4), orbiting);
      cube.position.y = THREE.MathUtils.lerp(landingY, 1.1 + Math.sin(angle * 1.4) * 0.65, orbiting);
      cube.position.z = THREE.MathUtils.lerp(landingZ, Math.sin(angle) * 1.6, orbiting);
    }
    cube.rotation.x = reduced ? 0 : elapsed * 0.16 + index;
    cube.rotation.y = reduced ? 0 : elapsed * 0.22 + index * 0.7;
  });

  const dashboardShow = range(progress, 0.5, 0.58) * (1 - range(progress, 0.79, 0.86));
  runtime.dashboard.scale.setScalar(Math.max(0.01, dashboardShow * (compact ? 0.68 : 0.9)));
  runtime.dashboardMaterial.opacity = dashboardShow;
  const platformIndex = progress < 0.64 ? 0 : progress < 0.72 ? 1 : progress < 0.78 ? 3 : 4;
  if (runtime.dashboard.userData.platformIndex !== platformIndex) {
    runtime.dashboard.userData.platformIndex = platformIndex;
    runtime.dashboardMaterial.map?.dispose();
    runtime.dashboardMaterial.map = makeTextTexture(PLATFORMS[platformIndex].name, PLATFORMS[platformIndex].line, PLATFORMS[platformIndex].color);
    runtime.dashboardMaterial.needsUpdate = true;
  }

  const happy = range(progress, 0.8, 0.94);
  runtime.leftArm.rotation.z = THREE.MathUtils.lerp(runtime.leftArm.rotation.z, -0.68, happy);
  runtime.rightArm.rotation.z = THREE.MathUtils.lerp(runtime.rightArm.rotation.z, 0.68, happy);
  runtime.person.position.y = -0.75 + (reduced ? 0 : Math.sin(elapsed * 1.1) * 0.025);

  runtime.world.rotation.y = compact ? -0.06 : -0.1 + Math.sin(progress * Math.PI) * 0.08;
  runtime.camera.position.set(compact ? 0 : Math.sin(progress * Math.PI * 2) * 0.45, compact ? 1.25 : 1.15, compact ? 13.8 : 11.5);
  runtime.camera.lookAt(0, 0.35, 0);
}

export function SocialUniverse() {
  const journeyRef = useRef<HTMLElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const progressRef = useRef(0);
  const audioRef = useRef<AudioContext | null>(null);
  const [active, setActive] = useState(0);
  const [sound, setSound] = useState(false);
  const [webglFailed, setWebglFailed] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    const journey = journeyRef.current;
    if (!canvas || !journey) return;
    let runtime: Runtime;
    try { runtime = buildScene(canvas); } catch { setWebglFailed(true); return; }
    const compact = window.matchMedia("(max-width: 720px)");
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    let stage = -1;
    let scheduled = false;
    const resize = () => {
      const width = canvas.clientWidth;
      const height = canvas.clientHeight;
      runtime.renderer.setPixelRatio(Math.min(devicePixelRatio, compact.matches ? 1.2 : 1.55));
      runtime.renderer.setSize(width, height, false);
      runtime.camera.aspect = width / Math.max(1, height);
      runtime.camera.updateProjectionMatrix();
    };
    const read = () => {
      const rect = journey.getBoundingClientRect();
      progressRef.current = clamp(-rect.top / Math.max(1, journey.offsetHeight - innerHeight));
      if (rect.bottom <= 0 || rect.top >= innerHeight) {
        stage = -1;
        setActive((current) => current === -1 ? current : -1);
        scheduled = false;
        return;
      }
      const chapterElements = [...journey.querySelectorAll<HTMLElement>("[data-social-chapter]")];
      const viewportCenter = innerHeight * 0.52;
      let next = 0;
      let closest = Number.POSITIVE_INFINITY;
      if (compact.matches) {
        next = Math.min(CHAPTERS.length - 1, Math.max(0, Math.floor((-rect.top + innerHeight * 0.5) / innerHeight)));
      } else {
        chapterElements.forEach((element, index) => {
          const copyRect = element.firstElementChild?.getBoundingClientRect() ?? element.getBoundingClientRect();
          const distance = Math.abs((copyRect.top + copyRect.bottom) / 2 - viewportCenter);
          if (distance < closest) { closest = distance; next = index; }
        });
      }
      if (next !== stage) { stage = next; setActive(next); }
      scheduled = false;
    };
    const onScroll = () => { if (!scheduled) { scheduled = true; requestAnimationFrame(read); } };
    const clock = new THREE.Clock();
    const draw = () => {
      runtime.frame = requestAnimationFrame(draw);
      updateScene(runtime, progressRef.current, clock.getElapsedTime(), compact.matches, reduced.matches);
      runtime.renderer.render(runtime.scene, runtime.camera);
    };
    resize(); read(); draw();
    addEventListener("resize", resize);
    addEventListener("scroll", onScroll, { passive: true });
    return () => { cancelAnimationFrame(runtime.frame); removeEventListener("resize", resize); removeEventListener("scroll", onScroll); runtime.dispose(); };
  }, []);

  useEffect(() => {
    if (!sound || !audioRef.current) return;
    const context = audioRef.current;
    const oscillator = context.createOscillator();
    const gain = context.createGain();
    oscillator.type = "sine";
    oscillator.frequency.setValueAtTime(active >= 3 ? 150 + active * 22 : 92, context.currentTime);
    gain.gain.setValueAtTime(0.0001, context.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.035, context.currentTime + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.0001, context.currentTime + 0.32);
    oscillator.connect(gain).connect(context.destination);
    oscillator.start(); oscillator.stop(context.currentTime + 0.34);
  }, [active, sound]);

  const toggleSound = async () => {
    if (!audioRef.current) audioRef.current = new AudioContext();
    await audioRef.current.resume();
    setSound((value) => !value);
  };

  return (
    <div className={styles.page}>
      <section ref={journeyRef} className={styles.journey} aria-label="Social media growth story">
        <div className={styles.stage}>
          <canvas ref={canvasRef} className={styles.canvas} aria-hidden="true" />
          <div className={styles.ambient} aria-hidden="true" />
          {webglFailed && <div className={styles.fallback} aria-hidden="true">SOCIAL</div>}
          <div className={styles.chapterCounter} aria-hidden="true"><span>0{Math.max(1, active + 1)}</span><i /><b>0{CHAPTERS.length}</b></div>
          <button className={styles.soundButton} type="button" onClick={toggleSound} aria-pressed={sound} aria-label={sound ? "Mute scene sounds" : "Enable scene sounds"}>
            {sound ? <Volume2 size={17} /> : <VolumeX size={17} />}<span>{sound ? "Sound on" : "Sound off"}</span>
          </button>
        </div>
        <div className={styles.chapters}>
          {CHAPTERS.map((chapter, index) => (
            <section key={chapter.id} data-social-chapter className={`${styles.chapter} ${styles[chapter.align]}`} aria-labelledby={`${chapter.id}-heading`}>
              <div className={`${styles.copy} ${active === index ? styles.copyActive : ""}`}>
                <p className={styles.eyebrow}>{chapter.eyebrow}</p>
                <h1 id={`${chapter.id}-heading`}>{chapter.title}</h1>
                <p>{chapter.body}</p>
                {chapter.id === "instagram" && <div className={styles.checks}>{PLATFORMS[0].services.map((service) => <span key={service}><Check size={14} />{service}</span>)}</div>}
              </div>
            </section>
          ))}
        </div>
      </section>

      <section className={styles.services} aria-labelledby="social-services-heading">
        <div className={styles.servicesIntro}>
          <p className={styles.eyebrow}>Platform-native. Brand-connected.</p>
          <h2 id="social-services-heading">One story, shaped for every room.</h2>
          <p>We build a clear content system first, then adapt its expression to the culture, format and audience of each platform.</p>
        </div>
        <div className={styles.platformGrid}>
          {PLATFORMS.map((platform, index) => (
            <article key={platform.id} style={{ "--platform": platform.color } as React.CSSProperties}>
              <div className={styles.platformTop}><span>{platform.short}</span><i>0{index + 1}</i></div>
              <h3>{platform.name}</h3><p>{platform.line}</p>
              <ul>{platform.services.map((service) => <li key={service}><Check size={14} />{service}</li>)}</ul>
            </article>
          ))}
        </div>
        <div className={styles.method}>
          <p className={styles.eyebrow}>How the ecosystem grows</p>
          <div>{[["01","Find the story"],["02","Design the system"],["03","Create natively"],["04","Listen and learn"]].map(([number,label]) => <span key={number}><b>{number}</b>{label}</span>)}</div>
        </div>
        <div className={styles.cta}>
          <div><p className={styles.eyebrow}>Ready to grow your brand?</p><h2>Let’s create your digital success story.</h2></div>
          <Link href="/contact">Start the story <ArrowRight size={18} /></Link>
        </div>
      </section>
    </div>
  );
}
