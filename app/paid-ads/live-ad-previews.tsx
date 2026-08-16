"use client";

import Image from "next/image";
import { useEffect, useState, type ReactNode } from "react";

import { createAdPreviewLifecycle, REDUCED_MOTION_QUERY } from "./ad-preview-lifecycle";
import {
  paidAdsRenderContract,
  type AdPreview,
  type PaidAdsPlatform,
} from "./paid-ads-data";
import {
  getActivePreviewIndices,
  getEngineMediaPresentation,
  getPreviewArtworkPresentation,
  type MotionPreference,
} from "./paid-ads-presentation";
import styles from "./paid-ads-studio.module.css";

const [googlePreviewDeck, metaPreviewDeck] = paidAdsRenderContract.previewDecks;
const googleAdPreviews = googlePreviewDeck.previews;
const metaAdPreviews = metaPreviewDeck.previews;

const platformDetails: Record<
  PaidAdsPlatform,
  { label: string; logo: string }
> = {
  google: { label: "Google Ads", logo: "/paid-ads/google-ads-logo.png" },
  meta: { label: "Meta Ads", logo: "/paid-ads/meta-logo.png" },
};

function useMotionPreference() {
  const [motionPreference, setMotionPreference] =
    useState<MotionPreference>("unresolved");

  useEffect(() => {
    const mediaQuery = window.matchMedia(REDUCED_MOTION_QUERY);
    const handleChange = (event: MediaQueryListEvent) => {
      setMotionPreference(event.matches ? "reduce" : "no-preference");
    };

    setMotionPreference(mediaQuery.matches ? "reduce" : "no-preference");
    mediaQuery.addEventListener("change", handleChange);

    return () => {
      mediaQuery.removeEventListener("change", handleChange);
    };
  }, []);

  return motionPreference;
}

function AdPreviewSlide({
  preview,
  active,
}: {
  preview: AdPreview;
  active: boolean;
}) {
  const [imageFailed, setImageFailed] = useState(false);
  const artwork = getPreviewArtworkPresentation({
    active,
    imageFailed,
    imageAlt: preview.alt,
  });

  return (
    <div
      className={styles.adPreviewSlide}
      data-active={active}
      aria-hidden={!active}
    >
      <div className={styles.adPreviewArtwork} data-image-failed={imageFailed}>
        {artwork.showImage ? (
          <Image
            src={preview.image}
            alt={artwork.renderedImageAlt}
            fill
            loading={active ? "eager" : "lazy"}
            sizes="(max-width: 700px) 100vw, 28vw"
            onError={() => setImageFailed(true)}
          />
        ) : null}
        {artwork.showFallback ? (
          <div
            className={styles.adPreviewFallback}
            role={active ? "img" : undefined}
            aria-label={artwork.fallbackLabel || undefined}
          >
            <span className={styles.adPreviewFallbackMark} aria-hidden="true">
              C
            </span>
            <strong>CompassNCrew</strong>
            <span>Creative preview unavailable</span>
          </div>
        ) : null}
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
  const [metaIndex, setMetaIndex] = useState(0);
  const [motionPreference, setMotionPreference] =
    useState<MotionPreference>("unresolved");

  useEffect(() => {
    const lifecycle = createAdPreviewLifecycle({
      matchMedia(query) {
        const mediaQuery = window.matchMedia(query);

        return {
          get matches() {
            return mediaQuery.matches;
          },
          addEventListener(type, listener) {
            mediaQuery.addEventListener(type, listener as (event: MediaQueryListEvent) => void);
          },
          removeEventListener(type, listener) {
            mediaQuery.removeEventListener(type, listener as (event: MediaQueryListEvent) => void);
          },
        };
      },
      visibility: {
        get hidden() {
          return document.hidden;
        },
        addEventListener(type, listener) {
          document.addEventListener(type, listener);
        },
        removeEventListener(type, listener) {
          document.removeEventListener(type, listener);
        },
      },
      scheduler: {
        setTimeout(callback, delay) {
          return window.setTimeout(callback, delay) as unknown as ReturnType<typeof setTimeout>;
        },
        clearTimeout(handle) {
          window.clearTimeout(handle as unknown as number);
        },
      },
      googleItemCount: googleAdPreviews.length,
      metaItemCount: metaAdPreviews.length,
      onMotionPreferenceChange: setMotionPreference,
      onGoogleIndexChange: setGoogleIndex,
      onMetaIndexChange: setMetaIndex,
    });

    return () => {
      lifecycle.dispose();
    };
  }, []);

  const activeIndices = getActivePreviewIndices({
    motionPreference,
    googleIndex,
    metaIndex,
  });

  const googleSlides = googleAdPreviews.map((preview, index) => (
    <AdPreviewSlide
      key={preview.id}
      preview={preview}
      active={index === activeIndices.google}
    />
  ));
  const metaSlides = metaAdPreviews.map((preview, index) => (
    <AdPreviewSlide
      key={preview.id}
      preview={preview}
      active={index === activeIndices.meta}
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
  const motionPreference = useMotionPreference();
  const presentation = getEngineMediaPresentation({ motionPreference, videoFailed });

  return (
    <div
      className={styles.adEngineMedia}
      data-video-failed={videoFailed}
      data-reduced-motion={motionPreference === "reduce"}
      aria-hidden={presentation.decorative}
    >
      {presentation.showPoster ? (
        <Image
          className={styles.adEngineFallback}
          src="/paid-ads/ad-engine-poster.png"
          alt=""
          fill
          sizes="(max-width: 700px) 100vw, 30vw"
        />
      ) : (
        <video
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          poster="/paid-ads/ad-engine-poster.png"
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
