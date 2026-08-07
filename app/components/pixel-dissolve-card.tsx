import { type ReactNode } from "react";

/**
 * The hero glass card. Used to run a GSAP pixel-glitch effect on mouse-leave
 * (raw DOM nodes appended outside React's tree); that effect could get stuck
 * mid-animation and leave a grid of solid tiles covering the card
 * permanently, so it's gone — this is now a plain, reliable glass panel with
 * a layered shadow stack (inset top/bottom edges plus an outer drop shadow)
 * for a "thick pane of glass" look instead of a flat tint.
 */
export function PixelDissolveCard({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`border-beam relative overflow-hidden rounded-2xl border border-white/15 bg-black/40 p-6 backdrop-blur-xl transition-transform duration-500 ease-out hover:scale-[1.01] md:p-8 shadow-[inset_0_1px_0_rgba(255,255,255,0.35),inset_0_-2px_0_rgba(0,0,0,0.55),0_30px_80px_-24px_rgba(0,0,0,0.75)] ${className}`}
    >
      {children}
    </div>
  );
}
