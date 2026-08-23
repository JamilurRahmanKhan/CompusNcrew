"use client";

import { useEffect, useRef, useState } from "react";
import { getCubeFaces, type CubeFaceContent } from "./social-cube-data";
import styles from "./social-cube-background.module.css";

const FACES = getCubeFaces();
const FACE_COUNT = FACES.length;
const CTA_ACCENT = "#d9622b";
const PHOTO_MAP: Record<string, string> = {
  instagram: "/media/social/instagram.png",
  facebook: "/media/social/facebook.png",
  linkedin: "/media/social/linkedIn.png",
  pinterest: "/media/social/pinterest.png",
  twitter: "/media/social/x(twitter).png",
};
const CTA_PHOTO = "/media/social/all-in-one.png";

function accentFor(face: CubeFaceContent): string {
  return face.kind === "platform" ? face.color : CTA_ACCENT;
}

function photoFor(face: CubeFaceContent): string {
  return face.kind === "platform" ? PHOTO_MAP[face.id] : CTA_PHOTO;
}

type Layer = { id: number; face: CubeFaceContent; entered: boolean };

// Crossfades a full-bleed gradient "environment" behind the cube as the
// active face changes. Layers stack in DOM order: each new face pushes a
// layer on top starting transparent, then flips to opaque next paint so the
// CSS opacity/scale transition actually runs. Once the newest layer finishes
// fading in, every layer beneath it is dropped — it's already fully hidden.
export function CubeBackground({ activeFace }: { activeFace: number }) {
  const normalized = ((activeFace % FACE_COUNT) + FACE_COUNT) % FACE_COUNT;
  const face = FACES[normalized];
  const nextId = useRef(1);
  const [layers, setLayers] = useState<Layer[]>(() => [{ id: 0, face, entered: true }]);

  useEffect(() => {
    setLayers((prev) => {
      const top = prev[prev.length - 1];
      if (top.face === face) return prev;
      return [...prev, { id: nextId.current++, face, entered: false }];
    });
  }, [face]);

  useEffect(() => {
    const top = layers[layers.length - 1];
    if (top.entered) return;
    let raf2 = 0;
    const raf1 = requestAnimationFrame(() => {
      raf2 = requestAnimationFrame(() => {
        setLayers((prev) => prev.map((layer) => (layer.id === top.id ? { ...layer, entered: true } : layer)));
      });
    });
    return () => {
      cancelAnimationFrame(raf1);
      cancelAnimationFrame(raf2);
    };
  }, [layers]);

  const handleTransitionEnd = (id: number, property: string) => {
    if (property !== "opacity") return;
    setLayers((prev) => {
      if (id !== prev[prev.length - 1].id) return prev;
      const index = prev.findIndex((layer) => layer.id === id);
      return index <= 0 ? prev : prev.slice(index);
    });
  };

  return (
    <div className={styles.backdrop} aria-hidden="true">
      {layers.map((layer) => {
        const photo = photoFor(layer.face);
        return (
          <div
            key={layer.id}
            className={`${styles.layer} ${layer.entered ? styles.visible : ""}`}
            style={{ "--accent": accentFor(layer.face), "--photo": `url("${photo}")` } as React.CSSProperties}
            onTransitionEnd={(event) => handleTransitionEnd(layer.id, event.propertyName)}
          />
        );
      })}
    </div>
  );
}
