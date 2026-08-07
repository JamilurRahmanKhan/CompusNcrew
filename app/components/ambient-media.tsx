"use client";

import { useEffect, useRef } from "react";
import { media, type MediaKey } from "../media";

/**
 * The ambient layer behind every major section.
 *
 * Both reference sites are ~90% full-bleed video — strip it out and the design
 * collapses into a black page with nice type. Until real footage lands, this
 * renders a generated 2D-canvas ambient field instead: slow drifting radial
 * light, additive-blended, no blur filter and no WebGL. Roughly 2KB, works on
 * every device, and reads as the same kind of surface the real video will.
 *
 * The moment a `src` is set in media.ts, this switches to <video> with no other
 * change anywhere in the codebase.
 */

const TONES: Record<string, string[]> = {
  // MetaLab's sampled hero hue, plus a colder companion.
  indigo: ["75, 63, 207", "40, 34, 120", "120, 108, 255"],
  // Our accent, held well below text brightness.
  amber: ["255, 160, 51", "168, 92, 20", "92, 52, 140"],
  steel: ["70, 110, 170", "36, 54, 92", "88, 84, 190"],
  ember: ["190, 74, 48", "104, 38, 30", "72, 50, 150"],
};

type Blob = {
  x: number;
  y: number;
  r: number;
  dx: number;
  dy: number;
  color: string;
  alpha: number;
};

export function AmbientMedia({
  slot,
  className = "",
  /** Dim the whole layer so foreground type always wins. */
  opacity = 0.55,
}: {
  slot: MediaKey;
  className?: string;
  opacity?: number;
}) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const config = media[slot];

  useEffect(() => {
    if (config.src) return; // real video is rendering instead
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    const palette = TONES[config.tone] ?? TONES.indigo;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let blobs: Blob[] = [];
    let width = 0;
    let height = 0;
    let frame = 0;
    let visible = true;

    // Cap the backing store — this layer is deliberately soft, so rendering it
    // at full retina resolution buys nothing and costs a lot on mobile.
    const dpr = Math.min(window.devicePixelRatio || 1, 1.5);

    const seed = (n: number) => {
      blobs = Array.from({ length: n }, (_, i) => ({
        x: Math.random() * width,
        y: Math.random() * height,
        r: (0.36 + Math.random() * 0.34) * Math.max(width, height),
        dx: (Math.random() - 0.5) * 0.16,
        dy: (Math.random() - 0.5) * 0.12,
        color: palette[i % palette.length],
        alpha: 0.3 + Math.random() * 0.28,
      }));
    };

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      width = Math.max(rect.width, 1);
      height = Math.max(rect.height, 1);
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      seed(4);
      draw();
    };

    const draw = () => {
      ctx.clearRect(0, 0, width, height);
      ctx.globalCompositeOperation = "lighter";
      for (const b of blobs) {
        const g = ctx.createRadialGradient(b.x, b.y, 0, b.x, b.y, b.r);
        g.addColorStop(0, `rgba(${b.color}, ${b.alpha})`);
        g.addColorStop(0.45, `rgba(${b.color}, ${b.alpha * 0.32})`);
        g.addColorStop(1, `rgba(${b.color}, 0)`);
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.arc(b.x, b.y, b.r, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalCompositeOperation = "source-over";
    };

    const tick = () => {
      if (visible) {
        for (const b of blobs) {
          b.x += b.dx;
          b.y += b.dy;
          const m = b.r * 0.5;
          if (b.x < -m || b.x > width + m) b.dx *= -1;
          if (b.y < -m || b.y > height + m) b.dy *= -1;
        }
        draw();
      }
      frame = requestAnimationFrame(tick);
    };

    resize();

    // Stop entirely when scrolled away — no reason to burn a frame budget on a
    // decorative layer nobody can see.
    const io = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting;
      },
      { rootMargin: "120px" },
    );
    io.observe(canvas);

    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    if (!reduced) frame = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(frame);
      io.disconnect();
      ro.disconnect();
    };
  }, [config.src, config.tone]);

  return (
    <div
      className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`}
      aria-hidden="true"
    >
      {config.src ? (
        <video
          className="h-full w-full object-cover"
          style={{ opacity }}
          src={config.src}
          poster={config.poster || undefined}
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
        />
      ) : (
        <canvas
          ref={canvasRef}
          className="h-full w-full"
          style={{ opacity }}
        />
      )}
      <AmbientVignette />
    </div>
  );
}

/**
 * Keeps the edges from banding with a subtle light vignette on light backgrounds.
 * The center is mostly transparent, fading to white at edges.
 *
 * `strength` scales the effect for the 3D scene to preserve reflections.
 */
export function AmbientVignette({ strength = 1 }: { strength?: number }) {
  const inner = 0.03 * strength;
  const mid = 0.15 * strength;
  return (
    <div
      className="absolute inset-0"
      aria-hidden="true"
      style={{
        background: `radial-gradient(120% 90% at 50% 40%, rgba(0,0,0,${inner}) 0%, rgba(0,0,0,${mid}) 62%, rgba(0,0,0,0) 100%)`,
      }}
    />
  );
}

/** Text alternative for the ambient layer. Canvas and video are both opaque to AT. */
export function AmbientDescription({ slot }: { slot: MediaKey }) {
  return <span className="sr-only">{media[slot].alt}</span>;
}
