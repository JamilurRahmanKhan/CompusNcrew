"use client";

import { useEffect, useRef } from "react";
import styles from "./email-sms.module.css";

// Deterministic pseudo-random layout (no Math.random) so SSR and the
// client hydrate to the same markup.
const PARTICLES = Array.from({ length: 22 }, (_, i) => ({
  x: (i * 37 + 5) % 100,
  y: (i * 53 + 11) % 100,
  dur: 9 + (i % 6) * 2,
  delay: (i % 7) * 0.6,
}));

export function HeroBackground() {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    const hero = root?.closest(`.${styles.hero}`) as HTMLElement | null;
    if (!hero) return;

    const pos = { x: 0.5, y: 0.3 };
    const target = { x: 0.5, y: 0.3 };
    let raf = 0;

    const tick = () => {
      pos.x += (target.x - pos.x) * 0.07;
      pos.y += (target.y - pos.y) * 0.07;
      hero.style.setProperty("--mouse-x", `${pos.x * 100}%`);
      hero.style.setProperty("--mouse-y", `${pos.y * 100}%`);
      hero.style.setProperty("--parallax-x", `${(pos.x - 0.5) * 2}`);
      hero.style.setProperty("--parallax-y", `${(pos.y - 0.5) * 2}`);
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    const onMove = (e: MouseEvent) => {
      const r = hero.getBoundingClientRect();
      target.x = (e.clientX - r.left) / r.width;
      target.y = (e.clientY - r.top) / r.height;
      hero.style.setProperty("--spotlight-opacity", "1");
    };
    const onLeave = () => {
      hero.style.setProperty("--spotlight-opacity", "0");
      target.x = 0.5;
      target.y = 0.3;
    };

    hero.addEventListener("mousemove", onMove);
    hero.addEventListener("mouseleave", onLeave);
    return () => {
      cancelAnimationFrame(raf);
      hero.removeEventListener("mousemove", onMove);
      hero.removeEventListener("mouseleave", onLeave);
    };
  }, []);

  return (
    <div ref={rootRef} className={styles.heroBg} aria-hidden="true">
      <div className={styles.heroMesh} />

      <div className={styles.heroAurora}>
        <div className={styles.auroraLayer} style={{ "--depth": 14 } as React.CSSProperties}>
          <span className={`${styles.auroraBlob} ${styles.auroraBlob1}`} />
        </div>
        <div className={styles.auroraLayer} style={{ "--depth": 24 } as React.CSSProperties}>
          <span className={`${styles.auroraBlob} ${styles.auroraBlob2}`} />
        </div>
        <div className={styles.auroraLayer} style={{ "--depth": 34 } as React.CSSProperties}>
          <span className={`${styles.auroraBlob} ${styles.auroraBlob3}`} />
        </div>
      </div>

      <div className={styles.heroSpotlight} />

      <div className={styles.heroParticles}>
        {PARTICLES.map((p, i) => (
          <span
            key={i}
            className={styles.particle}
            style={
              {
                left: `${p.x}%`,
                top: `${p.y}%`,
                animationDuration: `${p.dur}s`,
                animationDelay: `${p.delay}s`,
              } as React.CSSProperties
            }
          />
        ))}
      </div>

      <div className={styles.heroNoise} />
    </div>
  );
}
