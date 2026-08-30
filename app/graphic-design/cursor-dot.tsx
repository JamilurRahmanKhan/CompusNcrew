"use client";

import { useEffect, useRef } from "react";
import styles from "./graphic-design.module.css";

/** Magnetic cursor dot — desktop only, grows over interactive elements. */
export function CursorDot() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (window.matchMedia("(pointer: coarse)").matches) return;

    const el = ref.current;
    if (!el) return;

    const move = (e: MouseEvent) => {
      el.style.transform = `translate(${e.clientX}px, ${e.clientY}px) translate(-50%, -50%)`;
    };

    const grow = () => {
      el.style.width = "40px";
      el.style.height = "40px";
    };
    const shrink = () => {
      el.style.width = "14px";
      el.style.height = "14px";
    };

    window.addEventListener("mousemove", move);
    document.querySelectorAll("a, button").forEach((n) => {
      n.addEventListener("mouseenter", grow);
      n.addEventListener("mouseleave", shrink);
    });

    return () => window.removeEventListener("mousemove", move);
  }, []);

  return <div ref={ref} className={styles.dot} aria-hidden="true" />;
}
