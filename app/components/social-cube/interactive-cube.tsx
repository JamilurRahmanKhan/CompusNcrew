"use client";

import { Environment, RoundedBox } from "@react-three/drei";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { getCubeFaces, type CubeFaceContent } from "./social-cube-data";
import styles from "./interactive-cube.module.css";

const FACES = getCubeFaces();

const ICON_MAP: Record<string, string> = {
  instagram: "/media/social/instagram-icon.png",
  facebook: "/media/social/facebook-icon.png",
  linkedin: "/media/social/linkedin-icon.png",
  pinterest: "/media/social/pinterest-icon.png",
  twitter: "/media/social/x-twitter-icon.png",
};

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
}

function wrapLines(context: CanvasRenderingContext2D, text: string, maxWidth: number): string[] {
  const words = text.split(" ");
  const lines: string[] = [];
  let current = "";
  for (const word of words) {
    const candidate = current ? `${current} ${word}` : word;
    if (context.measureText(candidate).width > maxWidth && current) {
      lines.push(current);
      current = word;
    } else {
      current = candidate;
    }
  }
  if (current) lines.push(current);
  return lines;
}

function drawTrackedLabel(context: CanvasRenderingContext2D, text: string, x: number, y: number, spacing: number): void {
  let cursor = x;
  for (const glyph of text) {
    context.fillText(glyph, cursor, y);
    cursor += context.measureText(glyph).width + spacing;
  }
}

function createFaceTexture(face: CubeFaceContent, icon: HTMLImageElement | null): THREE.CanvasTexture {
  const size = 1200;
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const context = canvas.getContext("2d")!;

  context.fillStyle = "#0a0b10";
  context.fillRect(0, 0, size, size);

  const pad = size * 0.1;
  context.textAlign = "left";
  context.textBaseline = "alphabetic";

  if (face.kind === "platform") {
    context.fillStyle = "rgba(255,255,255,.4)";
    context.font = `600 ${size * 0.02}px Arial, sans-serif`;
    drawTrackedLabel(context, "PLATFORM / " + face.short.toUpperCase(), pad, pad + size * 0.012, size * 0.006);

    // A soft white glow behind the name makes it read clearly through the
    // dark, tinted transmissive glass instead of looking washed out.
    context.save();
    context.shadowColor = "rgba(255,255,255,.9)";
    context.shadowBlur = size * 0.03;
    context.fillStyle = "#ffffff";
    context.font = `800 ${size * 0.096}px Arial, sans-serif`;
    context.fillText(face.name, pad, pad + size * 0.14);
    context.restore();

    context.fillStyle = "rgba(255,255,255,.52)";
    context.font = `400 ${size * 0.026}px Arial, sans-serif`;
    wrapLines(context, face.line, size - pad * 2).forEach((line, index) => {
      context.fillText(line, pad, pad + size * 0.19 + index * size * 0.036);
    });

    const centerY = size * 0.56;
    const iconRadius = size * 0.15;
    if (icon) {
      context.save();
      context.beginPath();
      context.arc(size / 2, centerY, iconRadius, 0, Math.PI * 2);
      context.clip();
      const scale = Math.max((iconRadius * 2) / icon.width, (iconRadius * 2) / icon.height);
      const drawWidth = icon.width * scale;
      const drawHeight = icon.height * scale;
      context.drawImage(icon, size / 2 - drawWidth / 2, centerY - drawHeight / 2, drawWidth, drawHeight);
      context.restore();
    } else {
      context.strokeStyle = "rgba(255,255,255,.3)";
      context.lineWidth = size * 0.0018;
      context.beginPath();
      context.arc(size / 2, centerY, iconRadius, 0, Math.PI * 2);
      context.stroke();
      context.fillStyle = "rgba(255,255,255,.85)";
      context.font = `600 ${size * 0.048}px Arial, sans-serif`;
      context.textAlign = "center";
      context.textBaseline = "middle";
      context.fillText(face.short, size / 2, centerY + size * 0.004);
      context.textAlign = "left";
      context.textBaseline = "alphabetic";
    }

    context.fillStyle = "rgba(255,255,255,.3)";
    context.font = `400 ${size * 0.019}px Arial, sans-serif`;
    wrapLines(context, face.services.join("   ·   "), size - pad * 2).slice(0, 2).forEach((line, index) => {
      context.fillText(line, pad, size - pad - (1 - index) * size * 0.03);
    });
  } else {
    context.fillStyle = "rgba(255,255,255,.4)";
    context.font = `600 ${size * 0.02}px Arial, sans-serif`;
    drawTrackedLabel(context, face.eyebrow.toUpperCase(), pad, pad + size * 0.012, size * 0.006);

    context.fillStyle = "#ffffff";
    context.font = `700 ${size * 0.078}px Arial, sans-serif`;
    wrapLines(context, face.heading, size - pad * 2).forEach((line, index) => {
      context.fillText(line, pad, pad + size * 0.15 + index * size * 0.086);
    });

    context.fillStyle = "rgba(255,255,255,.85)";
    context.font = `600 ${size * 0.028}px Arial, sans-serif`;
    context.fillText(`${face.ctaLabel} →`, pad, size - pad);
  }

  context.globalCompositeOperation = "destination-in";
  context.beginPath();
  context.roundRect(size * 0.015, size * 0.015, size * 0.97, size * 0.97, size * 0.125);
  context.fill();
  context.globalCompositeOperation = "source-over";

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.minFilter = THREE.LinearFilter;
  texture.needsUpdate = true;
  return texture;
}

function useFaceTextures(): THREE.CanvasTexture[] {
  const [textures, setTextures] = useState<THREE.CanvasTexture[]>([]);
  useEffect(() => {
    let cancelled = false;
    Promise.all(
      FACES.map((face) => {
        const src = face.kind === "platform" ? ICON_MAP[face.id] : undefined;
        return src ? loadImage(src).catch(() => null) : Promise.resolve(null);
      }),
    ).then((icons) => {
      if (cancelled) return;
      setTextures(FACES.map((face, index) => createFaceTexture(face, icons[index])));
    });
    return () => {
      cancelled = true;
    };
  }, []);
  return textures;
}

type PointerHandlers = {
  down: (event: React.PointerEvent) => void;
  move: (event: React.PointerEvent) => void;
  up: (event: React.PointerEvent) => void;
};

// A cube only presents a flat face to the camera when exactly one axis is
// rotated to a multiple of 90° and the other is at 0 — rounding x and y
// independently after a free two-axis drag can land on a combination where
// neither is 0 (an edge or corner facing forward instead of a face). These
// six poses are the only valid "face forward" states.
const QUARTER_TURN = Math.PI / 2;
const FACE_POSES: { x: number; y: number }[] = [
  { x: 0, y: 0 },              // 0 Front
  { x: 0, y: -QUARTER_TURN },  // 1 Right
  { x: 0, y: -Math.PI },       // 2 Back
  { x: 0, y: QUARTER_TURN },   // 3 Left
  { x: QUARTER_TURN, y: 0 },   // 4 Top
  { x: -QUARTER_TURN, y: 0 },  // 5 Bottom
];
// The (x,y) step, in quarter-turns, applied when advancing from pose i to
// pose i+1 in the cycle (wrapping 5 -> 0). Reversing a step just negates it.
const FACE_STEP_DELTAS: { dx: number; dy: number }[] = [
  { dx: 0, dy: -1 },  // Front -> Right
  { dx: 0, dy: -1 },  // Right -> Back
  { dx: 0, dy: -1 },  // Back -> Left
  { dx: 1, dy: -1 },  // Left -> Top (continues the same spin direction, then tilts up)
  { dx: -2, dy: 0 },  // Top -> Bottom (opposite faces: one 180° flip)
  { dx: 1, dy: 0 },   // Bottom -> Front
];
const FACE_COUNT = FACE_POSES.length;
const SNAP_DURATION_MS = 820;
// Short fixed pause after each snap animation finishes, absorbing that
// same flick's last trailing wheel events without blocking a genuinely
// new scroll for any longer than this.
const SETTLE_MS = 140;

function wrapAngleDelta(a: number, b: number): number {
  let delta = (a - b) % (Math.PI * 2);
  if (delta > Math.PI) delta -= Math.PI * 2;
  if (delta < -Math.PI) delta += Math.PI * 2;
  return delta;
}

// Finds the closest of the six valid face poses to the current (possibly
// freely-dragged) rotation, and returns that pose's *unwrapped* value —
// i.e. the value nearest the current rotation that is congruent to the
// canonical pose mod 360°, so the snap animation always takes the short way.
function nearestFacePose(x: number, y: number): { index: number; x: number; y: number } {
  let bestIndex = 0;
  let bestDistance = Infinity;
  let bestX = x;
  let bestY = y;
  for (let index = 0; index < FACE_POSES.length; index += 1) {
    const pose = FACE_POSES[index];
    const dx = wrapAngleDelta(x, pose.x);
    const dy = wrapAngleDelta(y, pose.y);
    const distance = dx * dx + dy * dy;
    if (distance < bestDistance) {
      bestDistance = distance;
      bestIndex = index;
      bestX = x - dx;
      bestY = y - dy;
    }
  }
  return { index: bestIndex, x: bestX, y: bestY };
}

const FACE_POSITIONS: [number, number, number][] = [
  [0, 0, 1.17], [1.17, 0, 0], [0, 0, -1.17], [-1.17, 0, 0], [0, 1.17, 0], [0, -1.17, 0],
];
const FACE_ROTATIONS: [number, number, number][] = [
  [0, 0, 0], [0, Math.PI / 2, 0], [0, Math.PI, 0], [0, -Math.PI / 2, 0], [-Math.PI / 2, 0, 0], [Math.PI / 2, 0, 0],
];

function RotatingCube({
  textures,
  rotation,
  pointerHandlers,
}: {
  textures: THREE.CanvasTexture[];
  rotation: React.MutableRefObject<{ x: number; y: number }>;
  pointerHandlers: PointerHandlers;
}) {
  const group = useRef<THREE.Group>(null);
  const { size, camera } = useThree();
  const isMobile = size.width < 640;

  useEffect(() => {
    camera.position.set(0, 0, isMobile ? 6.4 : 5.9);
    if ("fov" in camera) {
      (camera as THREE.PerspectiveCamera).fov = isMobile ? 50 : 38;
      camera.updateProjectionMatrix();
    }
  }, [camera, isMobile]);

  useFrame((_, delta) => {
    if (!group.current) return;
    group.current.rotation.x = THREE.MathUtils.damp(group.current.rotation.x, rotation.current.x, 9, delta);
    group.current.rotation.y = THREE.MathUtils.damp(group.current.rotation.y, rotation.current.y, 9, delta);
  });

  return (
    <group
      ref={group}
      scale={isMobile ? 0.88 : 1}
      onPointerDown={pointerHandlers.down}
      onPointerMove={pointerHandlers.move}
      onPointerUp={pointerHandlers.up}
      onPointerCancel={pointerHandlers.up}
    >
      <RoundedBox args={[2.42, 2.42, 2.42]} radius={0.48} smoothness={48}>
        <meshPhysicalMaterial
          color="#0a0a0a"
          roughness={0.02}
          transmission={0.55}
          thickness={3}
          ior={1.5}
          clearcoat={1}
          transparent
          opacity={0.88}
          depthWrite={false}
        />
      </RoundedBox>
      {textures.map((texture, index) => (
        <mesh key={index} position={FACE_POSITIONS[index].map((value) => value * 0.962) as [number, number, number]} rotation={FACE_ROTATIONS[index]} renderOrder={2}>
          <planeGeometry args={[2.04, 2.04]} />
          <meshBasicMaterial map={texture} toneMapped={false} transparent opacity={0.98} depthTest={false} depthWrite={false} />
        </mesh>
      ))}
    </group>
  );
}

export function InteractiveCube({ onFaceChange }: { onFaceChange?: (face: number) => void } = {}) {
  const textures = useFaceTextures();
  const hitZoneRef = useRef<HTMLDivElement>(null);
  const rotation = useRef({ x: 0, y: 0 });
  const targetRotation = useRef({ x: 0, y: 0 });
  const velocity = useRef({ x: 0, y: 0 });
  const drag = useRef({ active: false, x: 0, y: 0 });
  const scrollAnimation = useRef({ locked: false, fromX: 0, toX: 0, fromY: 0, toY: 0, startedAt: 0 });
  const faceIndex = useRef(0);
  // A hard scroll fires many wheel events in a burst, and the animation
  // lock already blocks all of them while a step is in flight. The only
  // gap is the moment right after the lock releases, where the same
  // flick's trailing momentum can still be arriving and would otherwise
  // trigger an immediate second step. `settleUntil` closes that gap with
  // a short, fixed window measured from when the animation *finishes* —
  // not from event silence, so it can never get stuck waiting for the
  // scroll to fully stop the way a silence-based gesture detector can.
  const settleUntil = useRef(0);
  const [mode, setMode] = useState<"drag" | "scroll">("scroll");
  // Reports the settled face upward, but only once a snap animation has
  // fully completed — never mid-rotation — so the background layer
  // switches exactly when the cube settles, whichever gesture (wheel or
  // drag-release) got it there.
  const announcedFace = useRef(0);

  useEffect(() => {
    const hitZone = hitZoneRef.current;
    if (!hitZone) return;
    const onWheel = (event: WheelEvent) => {
      event.preventDefault();
      if (drag.current.active || scrollAnimation.current.locked) return;
      const now = performance.now();
      if (now < settleUntil.current) return;
      const amount = Math.abs(event.deltaX) > Math.abs(event.deltaY) ? event.deltaX : event.deltaY;
      if (Math.abs(amount) < 1) return;
      const direction = amount > 0 ? 1 : -1;

      const phase = ((faceIndex.current % FACE_COUNT) + FACE_COUNT) % FACE_COUNT;
      const deltaPhase = direction > 0 ? phase : ((phase - 1) % FACE_COUNT + FACE_COUNT) % FACE_COUNT;
      const step = FACE_STEP_DELTAS[deltaPhase];
      const dx = (direction > 0 ? step.dx : -step.dx) * QUARTER_TURN;
      const dy = (direction > 0 ? step.dy : -step.dy) * QUARTER_TURN;

      const fromX = rotation.current.x;
      const fromY = rotation.current.y;
      const toX = fromX + dx;
      const toY = fromY + dy;

      scrollAnimation.current = { locked: true, fromX, toX, fromY, toY, startedAt: now };
      targetRotation.current = { x: toX, y: toY };
      velocity.current = { x: 0, y: 0 };
      faceIndex.current += direction;
      setMode("scroll");
    };

    let alive = true;
    let frame = 0;
    const onFrame = () => {
      if (!alive) return;
      const scroll = scrollAnimation.current;
      if (scroll.locked) {
        const progress = Math.min((performance.now() - scroll.startedAt) / SNAP_DURATION_MS, 1);
        const eased = 1 - Math.pow(1 - progress, 4);
        rotation.current.x = THREE.MathUtils.lerp(scroll.fromX, scroll.toX, eased);
        rotation.current.y = THREE.MathUtils.lerp(scroll.fromY, scroll.toY, eased);
        if (progress >= 1) {
          scroll.locked = false;
          settleUntil.current = performance.now() + SETTLE_MS;
          const settledFace = ((faceIndex.current % FACE_COUNT) + FACE_COUNT) % FACE_COUNT;
          if (settledFace !== announcedFace.current) {
            announcedFace.current = settledFace;
            onFaceChange?.(settledFace);
          }
        }
      } else if (!drag.current.active) {
        rotation.current.x = THREE.MathUtils.damp(rotation.current.x, targetRotation.current.x, 8, 1 / 60);
        rotation.current.y += velocity.current.y;
        velocity.current.y *= 0.9;
      }
      frame = requestAnimationFrame(onFrame);
    };
    frame = requestAnimationFrame(onFrame);
    hitZone.addEventListener("wheel", onWheel, { passive: false });
    return () => {
      alive = false;
      hitZone.removeEventListener("wheel", onWheel);
      cancelAnimationFrame(frame);
    };
  }, []);

  const down: PointerHandlers["down"] = (event) => {
    event.stopPropagation();
    scrollAnimation.current.locked = false;
    rotation.current.y = targetRotation.current.y;
    drag.current = { active: true, x: event.clientX, y: event.clientY };
    velocity.current = { x: 0, y: 0 };
    (event.target as Element).setPointerCapture?.(event.pointerId);
    setMode("drag");
  };
  const move: PointerHandlers["move"] = (event) => {
    if (!drag.current.active) return;
    const dx = event.clientX - drag.current.x;
    const dy = event.clientY - drag.current.y;
    drag.current.x = event.clientX;
    drag.current.y = event.clientY;
    rotation.current.y += dx * 0.008;
    rotation.current.x += dy * 0.006;
    velocity.current = { x: dy * 0.0005, y: dx * 0.0007 };
  };
  const up: PointerHandlers["up"] = (event) => {
    if (!drag.current.active) return;
    drag.current.active = false;
    const pose = nearestFacePose(rotation.current.x, rotation.current.y);
    const now = performance.now();
    scrollAnimation.current = { locked: true, fromX: rotation.current.x, toX: pose.x, fromY: rotation.current.y, toY: pose.y, startedAt: now };
    targetRotation.current = { x: pose.x, y: pose.y };
    velocity.current = { x: 0, y: 0 };
    faceIndex.current = pose.index;
    (event.target as Element).releasePointerCapture?.(event.pointerId);
    setMode("scroll");
  };

  return (
    <div className={styles.wrap}>
      <div className={styles.legend} aria-hidden="true">
        <span className={mode === "drag" ? styles.active : undefined}>drag</span>
        <b>|</b>
        <span className={mode === "scroll" ? styles.active : undefined}>scroll</span>
      </div>
      <div ref={hitZoneRef} className={styles.hitZone}>
        <div className={styles.stage}>
          <Canvas
            camera={{ position: [0, 0, 5.6], fov: 35 }}
            dpr={[1, 2]}
            gl={{ antialias: true, alpha: true }}
          >
            <ambientLight intensity={0.65} />
            <directionalLight position={[4, 5, 6]} intensity={2.2} />
            <directionalLight position={[-4, 2, 3]} intensity={1.1} color="#c7d3cb" />
            <Environment preset="forest" environmentIntensity={1.15} />
            <RotatingCube textures={textures} rotation={rotation} pointerHandlers={{ down, move, up }} />
          </Canvas>
        </div>
      </div>
    </div>
  );
}
