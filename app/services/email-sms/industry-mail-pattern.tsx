"use client";

import { useEffect, useRef } from "react";
import styles from "./email-sms.module.css";

// Deterministic jittered grid (no Math.random) so SSR and the client
// hydrate to identical markup — "organic" scatter, not a perfect grid.
const SMALL = Array.from({ length: 70 }, (_, i) => {
  const cols = 10;
  const rows = 7;
  const col = i % cols;
  const row = Math.floor(i / cols);
  const jx = (((i * 53) % 100) - 50) / 100 * (100 / cols) * 0.7;
  const jy = (((i * 91) % 100) - 50) / 100 * (100 / rows) * 0.7;
  return {
    x: (col + 0.5) / cols * 100 + jx,
    y: (row + 0.5) / rows * 100 + jy,
    size: 16 + (i % 5) * 2,
    depth: 4 + (i % 5) * 2,
    dur: 14 + (i % 6) * 3,
    delay: (i % 9) * 0.7,
  };
});

const LARGE = Array.from({ length: 8 }, (_, j) => ({
  x: (j * 47 + 13) % 100,
  y: (j * 71 + 29) % 100,
  size: 28 + (j % 3) * 4,
  depth: 16 + (j % 3) * 6,
  dur: 20 + (j % 4) * 3,
  delay: (j % 5) * 0.9,
}));

function MailIcon({ size }: { size: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.7}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <rect width="20" height="16" x="2" y="4" rx="2" />
      <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
    </svg>
  );
}

export function IndustryMailPattern() {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    const section = root?.closest(`.${styles.industrySection}`) as HTMLElement | null;
    if (!section) return;

    const pos = { x: 0.5, y: 0.5 };
    const target = { x: 0.5, y: 0.5 };
    let raf = 0;

    const tick = () => {
      pos.x += (target.x - pos.x) * 0.08;
      pos.y += (target.y - pos.y) * 0.08;
      section.style.setProperty("--mail-px", `${(pos.x - 0.5) * 2}`);
      section.style.setProperty("--mail-py", `${(pos.y - 0.5) * 2}`);
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    const onMove = (e: MouseEvent) => {
      const r = section.getBoundingClientRect();
      target.x = (e.clientX - r.left) / r.width;
      target.y = (e.clientY - r.top) / r.height;
    };
    section.addEventListener("mousemove", onMove);
    return () => {
      cancelAnimationFrame(raf);
      section.removeEventListener("mousemove", onMove);
    };
  }, []);

  return (
    <div ref={rootRef} className={styles.mailPattern} aria-hidden="true">
      {SMALL.map((p, i) => (
        <span
          key={`s${i}`}
          className={styles.mailIconDepth}
          style={{ left: `${p.x}%`, top: `${p.y}%`, "--depth": p.depth } as React.CSSProperties}
        >
          <span
            className={styles.mailIconFloat}
            style={{ animationDuration: `${p.dur}s`, animationDelay: `${p.delay}s` }}
          >
            <MailIcon size={p.size} />
          </span>
        </span>
      ))}
      {LARGE.map((p, j) => (
        <span
          key={`l${j}`}
          className={`${styles.mailIconDepth} ${styles.mailIconLarge}`}
          style={{ left: `${p.x}%`, top: `${p.y}%`, "--depth": p.depth } as React.CSSProperties}
        >
          <span
            className={styles.mailIconFloat}
            style={{ animationDuration: `${p.dur}s`, animationDelay: `${p.delay}s` }}
          >
            <MailIcon size={p.size} />
          </span>
        </span>
      ))}
    </div>
  );
}
