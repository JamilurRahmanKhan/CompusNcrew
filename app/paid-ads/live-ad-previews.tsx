"use client";

import Image from "next/image";
import { useEffect, useState, type ReactNode } from "react";

import { createAdRotationController } from "./ad-rotation";
import {
  googleAdPreviews,
  metaAdPreviews,
  type AdPreview,
  type PaidAdsPlatform,
} from "./paid-ads-data";
import styles from "./paid-ads-studio.module.css";

const ROTATION_INTERVAL_MS = 3_800;
const META_START_DELAY_MS = 1_900;
const REDUCED_MOTION_QUERY = "(prefers-reduced-motion: reduce)";

const platformDetails: Record<
  PaidAdsPlatform,
  { label: string; logo: string }
> = {
  google: { label: "Google Ads", logo: "/paid-ads/google-ads-logo.png" },
  meta: { label: "Meta Ads", logo: "/paid-ads/meta-logo.png" },
};

function useReducedMotion() {
  const [reducedMotion, setReducedMotion] = useState<boolean | null>(null);

  useEffect(() => {
    const mediaQuery = window.matchMedia(REDUCED_MOTION_QUERY);
    const handleChange = (event: MediaQueryListEvent) => {
      setReducedMotion(event.matches);
    };

    setReducedMotion(mediaQuery.matches);
    mediaQuery.addEventListener("change", handleChange);

    return () => {
      mediaQuery.removeEventListener("change", handleChange);
    };
  }, []);

  return reducedMotion;
}

function AdPreviewSlide({
  preview,
  active,
}: {
  preview: AdPreview;
  active: boolean;
}) {
  return (
    <div
      className={styles.adPreviewSlide}
      data-active={active}
      aria-hidden={!active}
    >
      <div className={styles.adPreviewArtwork}>
        <Image
          src={preview.image}
          alt={active ? preview.alt : ""}
          fill
          loading={active ? "eager" : "lazy"}
          sizes="(max-width: 700px) 100vw, 28vw"
        />
      </div>

      <div className={styles.adPreviewCopy}>
        <span>Demonstration creative</span>
        <h3>{preview.headline}</h3>
        <p>{preview.body}</p>
        <dl className={styles.adPreviewMetrics}>
          {preview.metrics.map((metric) => (
            <div key={metric.label}>
              <dt>{metric.label}</dt>
              <dd>{metric.value}</dd>
            </div>
          ))}
        </dl>
      </div>
    </div>
  );
}

function PreviewCard({
  platform,
  children,
}: {
  platform: PaidAdsPlatform;
  children: ReactNode;
}) {
  const details = platformDetails[platform];

  return (
    <article className={styles.adPreviewCard} data-platform={platform}>
      <header className={styles.adPreviewHeader}>
        <span className={styles.adPreviewPlatform}>
          <Image src={details.logo} alt="" width={32} height={32} />
          <span>{details.label}</span>
        </span>
        <span className={styles.adPreviewStatus}>
          <span aria-hidden="true" /> Live preview
        </span>
      </header>
      <div className={styles.adPreviewViewport}>{children}</div>
    </article>
  );
}

export function LiveAdPreviews() {
  const [googleIndex, setGoogleIndex] = useState(0);
  const [metaIndex, setMetaIndex] = useState(1);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    if (reducedMotion === null) {
      return;
    }

    const googleController = createAdRotationController({
      itemCount: googleAdPreviews.length,
      intervalMs: ROTATION_INTERVAL_MS,
      onIndexChange: setGoogleIndex,
    });
    const metaController = createAdRotationController({
      itemCount: metaAdPreviews.length,
      intervalMs: ROTATION_INTERVAL_MS,
      startDelayMs: META_START_DELAY_MS,
      onIndexChange: (index) => {
        setMetaIndex((index + 1) % metaAdPreviews.length);
      },
    });
    let metaResumeTimer: number | undefined;

    const clearMetaResumeTimer = () => {
      if (metaResumeTimer !== undefined) {
        window.clearTimeout(metaResumeTimer);
        metaResumeTimer = undefined;
      }
    };

    const handleVisibilityChange = () => {
      clearMetaResumeTimer();

      if (document.hidden) {
        googleController.setPaused(true);
        metaController.setPaused(true);
        return;
      }

      googleController.setPaused(false);
      metaResumeTimer = window.setTimeout(() => {
        metaResumeTimer = undefined;
        if (!document.hidden) {
          metaController.setPaused(false);
        }
      }, META_START_DELAY_MS);
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    if (!reducedMotion) {
      setGoogleIndex(0);
      setMetaIndex(1);
      if (document.hidden) {
        googleController.setPaused(true);
        metaController.setPaused(true);
      }
      googleController.start();
      metaController.start();
    }

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      clearMetaResumeTimer();
      googleController.dispose();
      metaController.dispose();
    };
  }, [reducedMotion]);

  const activeGoogleIndex = reducedMotion === true ? 0 : googleIndex;
  const activeMetaIndex = reducedMotion === true ? 0 : metaIndex;

  const googleSlides = googleAdPreviews.map((preview, index) => (
    <AdPreviewSlide
      key={preview.id}
      preview={preview}
      active={index === activeGoogleIndex}
    />
  ));
  const metaSlides = metaAdPreviews.map((preview, index) => (
    <AdPreviewSlide
      key={preview.id}
      preview={preview}
      active={index === activeMetaIndex}
    />
  ));

  return (
    <div className={styles.liveAdPreviews}>
      <PreviewCard platform="google">{googleSlides}</PreviewCard>
      <PreviewCard platform="meta">{metaSlides}</PreviewCard>
    </div>
  );
}

export function PaidAdsEngine() {
  const [videoFailed, setVideoFailed] = useState(false);
  const reducedMotion = useReducedMotion();
  const showPoster = reducedMotion !== false || videoFailed;

  return (
    <div
      className={styles.adEngineMedia}
      data-video-failed={videoFailed}
      data-reduced-motion={reducedMotion === true}
    >
      {showPoster ? (
        <Image
          className={styles.adEngineFallback}
          src="/paid-ads/ad-engine-poster.png"
          alt="Paid advertising engine illustration"
          fill
          sizes="(max-width: 700px) 100vw, 30vw"
        />
      ) : (
        <video
          autoPlay
          muted
          loop
          playsInline
          poster="/paid-ads/ad-engine-poster.png"
          aria-label="Animated paid advertising engine"
          onError={() => setVideoFailed(true)}
        >
          <source
            src="/paid-ads/ad-engine-alpha.webm"
            type="video/webm"
            onError={() => setVideoFailed(true)}
          />
        </video>
      )}
    </div>
  );
}
