"use client";

import Image from "next/image";
import { useRef } from "react";
import styles from "./graphic-design.module.css";

const panels = [
  {
    img: "/media/design-portfolio/coffee-campaign.png",
    style: { top: "6%", left: "4%", width: "34%", height: "42%", transform: "rotate(-6deg)" },
    depth: 18,
  },
  {
    img: "/media/design-portfolio/gaming-product.png",
    style: { top: "14%", right: "6%", width: "30%", height: "50%", transform: "rotate(5deg)" },
    depth: 28,
  },
  {
    img: "/media/design-portfolio/lemonade-campaign.png",
    style: { bottom: "8%", left: "22%", width: "26%", height: "36%", transform: "rotate(-3deg)" },
    depth: 12,
  },
  {
    img: "/media/design-portfolio/shampoo-product.png",
    style: { bottom: "10%", right: "18%", width: "22%", height: "34%", transform: "rotate(8deg)" },
    depth: 22,
  },
];

/** Floating, mouse-reactive product panels over a gradient stage. */
export function HeroVisual() {
  const stageRef = useRef<HTMLDivElement>(null);

  const onMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const stage = stageRef.current;
    if (!stage) return;
    const rect = stage.getBoundingClientRect();
    const mx = (e.clientX - rect.left) / rect.width - 0.5;
    const my = (e.clientY - rect.top) / rect.height - 0.5;

    stage.querySelectorAll<HTMLElement>("[data-depth]").forEach((el) => {
      const depth = Number(el.dataset.depth);
      const base = el.dataset.baseRotate ?? "0deg";
      el.style.transform = `translate(${mx * depth}px, ${my * depth}px) rotate(${base})`;
    });
  };

  return (
    <div
      ref={stageRef}
      className={styles.heroStage}
      onMouseMove={onMove}
      aria-hidden="true"
    >
      {panels.map((p, i) => {
        const rotateMatch = p.style.transform.match(/-?\d+deg/);
        return (
          <div
            key={i}
            className={styles.floatPanel}
            data-depth={p.depth}
            data-base-rotate={rotateMatch?.[0] ?? "0deg"}
            style={p.style}
          >
            <Image src={p.img} alt="" fill sizes="30vw" />
          </div>
        );
      })}
    </div>
  );
}
