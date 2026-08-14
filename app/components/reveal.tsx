"use client";

import { createElement, useEffect, useRef, type ComponentPropsWithoutRef, type ElementType, type ReactNode } from "react";

/**
 * Scroll-triggered fade-up. Apple uses this on every section boundary; it is
 * what stops a long dark page from feeling like a single flat wall.
 *
 * Content is present in the DOM from first paint — this only animates opacity
 * and transform, so it is invisible to crawlers and harmless without JS. The
 * reduced-motion case is handled in globals.css rather than here.
 *
 * Extra props (onMouseLeave, onBlur, etc.) pass straight through to the
 * underlying tag, so a Reveal-wrapped list can still carry its own
 * interaction handlers — used by the hero's hover-preview rail.
 */
export function Reveal({
  children,
  as: Tag = "div",
  delay = 0,
  className = "",
  ...rest
}: {
  children: ReactNode;
  as?: ElementType;
  delay?: number;
  className?: string;
} & ComponentPropsWithoutRef<"div">) {
  const ref = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.dataset.shown = "true";
          io.unobserve(el);
        }
      },
      { threshold: 0.12, rootMargin: "0px 0px -8% 0px" },
    );

    io.observe(el);
    return () => io.disconnect();
  }, []);

  return createElement(
    Tag,
    {
      ref,
      className: `reveal ${className}`,
      "data-shown": "false",
      style: delay ? { transitionDelay: `${delay}ms` } : undefined,
      ...rest,
    },
    children,
  );
}
