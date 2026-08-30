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
      // className={`border-beam relative overflow-hidden rounded-2xl border border-white/15 bg-black/40 p-6 backdrop-blur-xl transition-transform duration-500 ease-out hover:scale-[1.01] md:p-8 shadow-[inset_0_1px_0_rgba(255,255,255,0.35),inset_0_-2px_0_rgba(0,0,0,0.55),0_30px_80px_-24px_rgba(0,0,0,0.75)] ${className}`}
    className={`
  border-beam
  relative
  isolate
  overflow-hidden
  rounded-[28px]
  border border-white/[0.22]
  bg-gradient-to-br
  from-white/[0.16]
  via-white/[0.07]
  to-black/[0.18]
  p-6
  backdrop-blur-[30px]
  backdrop-saturate-[1.35]

  shadow-[
    inset_0_1.5px_1px_rgba(255,255,255,0.45),
    inset_1px_0_0_rgba(255,255,255,0.12),
    inset_0_-2px_3px_rgba(0,0,0,0.4),
    0_2px_2px_rgba(255,255,255,0.08),
    0_18px_40px_-12px_rgba(0,0,0,0.45),
    0_45px_100px_-28px_rgba(0,0,0,0.85)
  ]

  transition-all
  duration-500
  ease-out

  hover:-translate-y-1
  hover:scale-[1.008]
  hover:border-white/[0.3]
  hover:shadow-[
    inset_0_1.5px_1px_rgba(255,255,255,0.55),
    inset_1px_0_0_rgba(255,255,255,0.15),
    inset_0_-2px_3px_rgba(0,0,0,0.42),
    0_20px_50px_-15px_rgba(0,0,0,0.5),
    0_55px_120px_-30px_rgba(0,0,0,0.9)
  ]

  md:p-8
  ${className}
`}
    >
      {children}
    </div>
  );
}
