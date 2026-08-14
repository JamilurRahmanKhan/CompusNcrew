"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { METHOD_STEPS } from "./social-cube-data";
import { InteractiveCube } from "./interactive-cube";
import { CubeBackground } from "./social-cube-background";
import styles from "./social-cube-page.module.css";

export function SocialCubePage() {
  const [activeFace, setActiveFace] = useState(0);
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
          </div>
          <div className={styles.heroCube}>
            <InteractiveCube onFaceChange={setActiveFace} />
          </div>
        </div>
      </section>

      <section className={styles.method} aria-label="How the ecosystem grows">
        <p className={styles.eyebrow}>How the ecosystem grows</p>
        <div className={styles.methodGrid}>
          {METHOD_STEPS.map(([number, label]) => (
            <span key={number}>
              <b>{number}</b>
              {label}
            </span>
          ))}
        </div>
      </section>

      <section className={styles.cta} aria-labelledby="social-cube-cta-heading">
        <div>
          <p className={styles.eyebrow}>Ready to grow your brand?</p>
          <h2 id="social-cube-cta-heading">Let’s create your digital success story.</h2>
        </div>
        <Link href="/contact">
          Start the story <ArrowRight size={18} aria-hidden="true" />
        </Link>
      </section>
    </div>
  );
}
