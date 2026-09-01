"use client";

import { useRef } from "react";
import type { ReactNode } from "react";

export function TiltCard({ className, children }: { className?: string; children: ReactNode }) {
  const rafRef = useRef<number | null>(null);

  const onMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = e.currentTarget;
    const clientX = e.clientX;
    const clientY = e.clientY;
    if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    rafRef.current = requestAnimationFrame(() => {
      const r = el.getBoundingClientRect();
      const px = (clientX - r.left) / r.width;
      const py = (clientY - r.top) / r.height;
      el.style.setProperty("--rx", `${(0.5 - py) * 14}deg`);
      el.style.setProperty("--ry", `${(px - 0.5) * 14}deg`);
    });
  };

  const onLeave = (e: React.MouseEvent<HTMLDivElement>) => {
    if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    const el = e.currentTarget;
    el.style.setProperty("--rx", "0deg");
    el.style.setProperty("--ry", "0deg");
  };

  return (
    <div className={className} onMouseMove={onMove} onMouseLeave={onLeave}>
      {children}
    </div>
  );
}
