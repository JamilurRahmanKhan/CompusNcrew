import {
  createAdRotationController,
  type RotationScheduler,
} from "./ad-rotation";
import type { MotionPreference } from "./paid-ads-presentation";

export const AD_ROTATION_INTERVAL_MS = 3_800;
export const META_ROTATION_OFFSET_MS = 1_900;
export const REDUCED_MOTION_QUERY = "(prefers-reduced-motion: reduce)";

export interface MediaQueryChangeEventLike {
  matches: boolean;
}

export interface MediaQueryLike {
  readonly matches: boolean;
  addEventListener(type: "change", listener: (event: MediaQueryChangeEventLike) => void): void;
  removeEventListener(type: "change", listener: (event: MediaQueryChangeEventLike) => void): void;
}

export interface VisibilityLike {
  readonly hidden: boolean;
  addEventListener(type: "visibilitychange", listener: () => void): void;
  removeEventListener(type: "visibilitychange", listener: () => void): void;
}

export interface AdPreviewLifecycle {
  dispose(): void;
}

export function createAdPreviewLifecycle(options: {
  matchMedia(query: string): MediaQueryLike;
  visibility: VisibilityLike;
  scheduler: RotationScheduler;
  googleItemCount: number;
  metaItemCount: number;
  onMotionPreferenceChange(preference: MotionPreference): void;
  onGoogleIndexChange(index: number): void;
  onMetaIndexChange(index: number): void;
}): AdPreviewLifecycle {
  const mediaQuery = options.matchMedia(REDUCED_MOTION_QUERY);
  let disposed = false;
  let disposeRotationLifecycle: (() => void) | undefined;

  const resetPreviewIndices = () => {
    options.onGoogleIndexChange(0);
    options.onMetaIndexChange(0);
  };

  const stopRotationLifecycle = () => {
    disposeRotationLifecycle?.();
    disposeRotationLifecycle = undefined;
  };

  const startRotationLifecycle = () => {
    const googleController = createAdRotationController({
      itemCount: options.googleItemCount,
      intervalMs: AD_ROTATION_INTERVAL_MS,
      scheduler: options.scheduler,
      onIndexChange: options.onGoogleIndexChange,
    });
    const metaController = createAdRotationController({
      itemCount: options.metaItemCount,
      intervalMs: AD_ROTATION_INTERVAL_MS,
      startDelayMs: META_ROTATION_OFFSET_MS,
      scheduler: options.scheduler,
      onIndexChange: options.onMetaIndexChange,
    });
    let metaResumeTimer: ReturnType<typeof setTimeout> | undefined;
    let metaResumeGeneration = 0;

    const clearMetaResumeTimer = () => {
      metaResumeGeneration += 1;
      if (metaResumeTimer !== undefined) {
        options.scheduler.clearTimeout(metaResumeTimer);
        metaResumeTimer = undefined;
      }
    };

    const handleVisibilityChange = () => {
      clearMetaResumeTimer();

      if (options.visibility.hidden) {
        googleController.setPaused(true);
        metaController.setPaused(true);
        return;
      }

      googleController.setPaused(false);
      const scheduledGeneration = metaResumeGeneration;
      metaResumeTimer = options.scheduler.setTimeout(() => {
        if (disposed || scheduledGeneration !== metaResumeGeneration || options.visibility.hidden) {
          return;
        }

        metaResumeTimer = undefined;
        metaController.setPaused(false);
      }, META_ROTATION_OFFSET_MS);
    };

    options.visibility.addEventListener("visibilitychange", handleVisibilityChange);

    if (options.visibility.hidden) {
      googleController.setPaused(true);
      metaController.setPaused(true);
    }

    googleController.start();
    metaController.start();

    disposeRotationLifecycle = () => {
      options.visibility.removeEventListener("visibilitychange", handleVisibilityChange);
      clearMetaResumeTimer();
      googleController.dispose();
      metaController.dispose();
    };
  };

  const applyMotionPreference = (matches: boolean) => {
    if (disposed) {
      return;
    }

    stopRotationLifecycle();
    resetPreviewIndices();
    options.onMotionPreferenceChange(matches ? "reduce" : "no-preference");

    if (!matches) {
      startRotationLifecycle();
    }
  };

  const handleMotionPreferenceChange = (event: MediaQueryChangeEventLike) => {
    applyMotionPreference(event.matches);
  };

  mediaQuery.addEventListener("change", handleMotionPreferenceChange);
  applyMotionPreference(mediaQuery.matches);

  return {
    dispose() {
      if (disposed) {
        return;
      }

      disposed = true;
      mediaQuery.removeEventListener("change", handleMotionPreferenceChange);
      stopRotationLifecycle();
    },
  };
}
