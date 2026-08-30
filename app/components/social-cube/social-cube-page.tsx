"use client";

import { useState } from "react";
import { ArrowRight, MousePointer2, Info } from "lucide-react";
import { PLATFORMS } from "./social-cube-data";
import { InteractiveCube } from "./interactive-cube";
import { RotatingCards } from "./rotating-cards";
import { CubeBackground } from "./social-cube-background";
import { PlatformDetailsModal } from "./platform-details-modal";
import styles from "./social-cube-page.module.css";

export function SocialCubePage() {
  const [activeFace, setActiveFace] = useState(0);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const activePlatform = activeFace < PLATFORMS.length ? PLATFORMS[activeFace] : null;
  return (
    <div className={styles.page}>
      <section className={styles.hero} aria-labelledby="social-cube-heading">
        <CubeBackground activeFace={activeFace} />
        <div className={styles.heroInner}>
          <div className={styles.heroText}>
            <p className={styles.eyebrow}>Social growth system</p>
            <h1 id="social-cube-heading">
              Five platforms.
              <br />
              One rotating story.
            </h1>
            <p className={styles.lead}>
              Drag or scroll — every face is a platform built the way its audience actually behaves, not a copied-and-pasted post.
            </p>
            <button className={styles.dragButton}><MousePointer2 size={16}/> DRAG OR SCROLL</button>
            <button className={styles.detailsButton} onClick={() => setDetailsOpen(true)}>
              <Info size={16} /> See details <ArrowRight size={14} aria-hidden="true" />
            </button>
          </div>
          <div className={styles.heroCube}>
            <InteractiveCube onFaceChange={setActiveFace} />
          </div>
          <RotatingCards activeFace={activeFace} />
        </div>
      </section>

      <PlatformDetailsModal
        platform={activePlatform}
        open={detailsOpen}
        onClose={() => setDetailsOpen(false)}
      />
    </div>
  );
}
