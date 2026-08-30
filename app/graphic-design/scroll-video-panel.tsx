"use client";

import { useEffect, useRef, useState } from "react";
import styles from "./graphic-design.module.css";

/** Video panel that scales up from small to full size as it scrolls into view. */
export function ScrollVideoPanel() {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.disconnect();
        }
      },
      { threshold: 0.15 },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={`${styles.heroPanel} ${styles.scalePanel} ${inView ? styles.scalePanelIn : ""} mx-auto mt-16 w-full max-w-[1400px] overflow-hidden rounded-[2rem] p-1.5`}
    >
      <div className="relative aspect-[16/9] overflow-hidden rounded-[1.6rem] bg-black">
        <video
          className="h-full w-full object-cover"
          src="/video/video-hero.mp4"
          autoPlay
          muted
          loop
          playsInline
        />
      </div>
    </div>
  );
}
