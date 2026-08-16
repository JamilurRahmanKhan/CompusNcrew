export type MotionPreference = "unresolved" | "reduce" | "no-preference";

export function getActivePreviewIndices({
  motionPreference,
  googleIndex,
  metaIndex,
}: {
  motionPreference: MotionPreference;
  googleIndex: number;
  metaIndex: number;
}) {
  if (motionPreference !== "no-preference") {
    return { google: 0, meta: 0 } as const;
  }

  return { google: googleIndex, meta: metaIndex } as const;
}

export function getPreviewArtworkPresentation({
  active,
  imageFailed,
  imageAlt,
}: {
  active: boolean;
  imageFailed: boolean;
  imageAlt: string;
}) {
  return {
    showImage: !imageFailed,
    showFallback: imageFailed,
    renderedImageAlt: active && !imageFailed ? imageAlt : "",
    fallbackLabel: imageFailed && active ? `${imageAlt} unavailable` : "",
  } as const;
}

export function getEngineMediaPresentation({
  motionPreference,
  videoFailed,
}: {
  motionPreference: MotionPreference;
  videoFailed: boolean;
}) {
  return {
    showPoster: motionPreference !== "no-preference" || videoFailed,
    decorative: true,
  } as const;
}
