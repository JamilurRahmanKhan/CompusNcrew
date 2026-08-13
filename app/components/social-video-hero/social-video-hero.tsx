"use client";

import { useEffect, useRef } from "react";
import styles from "./social-video-hero.module.css";

export function SocialVideoHero() {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    video.muted = true;
    void video.play().catch(() => {
      // Browser media policies remain authoritative. Muted inline autoplay is
      // retried by the browser as soon as the page becomes active.
    });
  }, []);

  return (
    <section className={styles.hero} aria-label="Social media showreel">
      <video
        ref={videoRef}
        className={styles.video}
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        aria-hidden="true"
      >
        <source src="/media/social/social-edited.mp4" type="video/mp4" />
      </video>
    </section>
  );
}
