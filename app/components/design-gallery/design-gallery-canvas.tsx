"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

import {
  findNearbyArtwork,
  getQualityTier,
  stepCharacter,
  type CharacterState,
  type GalleryBounds,
  type Vector2,
} from "./gallery-controller";
import { GalleryInputController } from "./gallery-controls";
import { portfolioWorks, type GalleryArtwork } from "./gallery-data";
import { createGalleryScene, type GallerySceneHandle } from "./gallery-scene";

export interface DesignGalleryCanvasProps {
  paused: boolean;
  reducedMotion: boolean;
  joystickVector: Vector2;
  onReady: () => void;
  onNearbyArtworkChange: (artwork: GalleryArtwork | null) => void;
  onAction: (artwork: GalleryArtwork) => void;
  onFatalError: (error: Error) => void;
}

const GALLERY_BOUNDS: GalleryBounds = {
  minX: -3.4,
  maxX: 3.4,
  minY: -8.75,
  maxY: 6.75,
};

const INITIAL_CHARACTER_STATE: CharacterState = {
  position: { x: 0, y: 6.25 },
  velocity: { x: 0, y: 0 },
  facingAngle: 0,
  bobOffset: 0,
  bobPhase: 0,
};

const MAX_FRAME_DELTA_SECONDS = 0.1;

export function createGalleryActionHandler(
  getNearbyArtwork: () => GalleryArtwork | null,
  onAction: (artwork: GalleryArtwork) => void,
): () => boolean {
  return () => {
    const artwork = getNearbyArtwork();
    if (!artwork) return false;
    onAction(artwork);
    return true;
  };
}

export interface GalleryRuntimeBoundary {
  run(operation: () => void): void;
  fail(error: unknown): void;
  shutdown(): void;
}

export function createGalleryRuntimeBoundary(
  cleanup: () => void,
  onFatalError: (error: Error) => void,
): GalleryRuntimeBoundary {
  let stopped = false;

  const stop = () => {
    if (stopped) return false;
    stopped = true;
    try {
      cleanup();
    } catch {
      // Cleanup is best-effort; the original fatal error remains the useful signal.
    }
    return true;
  };
  const fail = (error: unknown) => {
    if (stop()) onFatalError(toError(error));
  };

  return {
    run(operation) {
      if (stopped) return;
      try {
        operation();
      } catch (error) {
        fail(error);
      }
    },
    fail,
    shutdown() {
      stop();
    },
  };
}

export function observeGalleryReadiness(
  ready: Promise<void>,
  runtime: Pick<GalleryRuntimeBoundary, "run" | "fail">,
  renderReadyFrame: () => void,
  onReady: () => void,
): void {
  void ready.then(
    () => runtime.run(() => {
      renderReadyFrame();
      onReady();
    }),
    (error) => runtime.fail(error),
  );
}

export function DesignGalleryCanvas({
  paused,
  reducedMotion,
  joystickVector,
  onReady,
  onNearbyArtworkChange,
  onAction,
  onFatalError,
}: DesignGalleryCanvasProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const controlsRef = useRef<GalleryInputController | null>(null);
  const pausedRef = useRef(paused);
  const reducedMotionRef = useRef(reducedMotion);
  const joystickRef = useRef(joystickVector);
  const onReadyRef = useRef(onReady);
  const onNearbyArtworkChangeRef = useRef(onNearbyArtworkChange);
  const onActionRef = useRef(onAction);
  const onFatalErrorRef = useRef(onFatalError);

  useEffect(() => {
    pausedRef.current = paused;
    reducedMotionRef.current = reducedMotion;
    joystickRef.current = joystickVector;
    onReadyRef.current = onReady;
    onNearbyArtworkChangeRef.current = onNearbyArtworkChange;
    onActionRef.current = onAction;
    onFatalErrorRef.current = onFatalError;
  });

  useEffect(() => {
    controlsRef.current?.setEnabled(!paused && !document.hidden);
  }, [paused]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let animationFrame = 0;
    let renderer: THREE.WebGLRenderer | null = null;
    let sceneHandle: GallerySceneHandle | null = null;
    let controls: GalleryInputController | null = null;
    let resizeObserver: ResizeObserver | null = null;
    let contextLossTarget: HTMLCanvasElement | null = null;
    let characterState: CharacterState = INITIAL_CHARACTER_STATE;
    let previousFrameTime: number | null = null;
    let simulationTime = 0;
    let nearbyArtworkId: string | null | undefined;
    let nearbyArtwork: GalleryArtwork | null = null;
    let disposed = false;
    let cleanedUp = false;

    const getDimensions = () => ({
      width: Math.max(1, Math.floor(container.clientWidth)),
      height: Math.max(1, Math.floor(container.clientHeight)),
    });

    const scheduleFrame = () => {
      runtime.run(() => {
        if (!disposed && !document.hidden && animationFrame === 0) {
          animationFrame = window.requestAnimationFrame(renderFrame);
        }
      });
    };

    const renderFrame = (frameTime: number) => {
      runtime.run(() => {
        animationFrame = 0;
        if (disposed || document.hidden || !renderer || !sceneHandle || !controls) return;

        const delta = previousFrameTime === null
          ? 0
          : Math.min(Math.max((frameTime - previousFrameTime) / 1000, 0), MAX_FRAME_DELTA_SECONDS);
        previousFrameTime = frameTime;
        const isPaused = pausedRef.current;
        controls.setEnabled(!isPaused);
        controls.setJoystick(joystickRef.current.x, joystickRef.current.y);

        if (!isPaused) {
          simulationTime += delta;
          characterState = stepCharacter(
            characterState,
            controls.getVector(),
            delta,
            GALLERY_BOUNDS,
            reducedMotionRef.current,
          );
          sceneHandle.updateCharacter(characterState, simulationTime, reducedMotionRef.current);

          const nearbyCandidate = findNearbyArtwork(characterState.position, portfolioWorks);
          nearbyArtwork = nearbyCandidate
            ? portfolioWorks.find((artwork) => artwork.id === nearbyCandidate.id) ?? null
            : null;
          const nextArtworkId = nearbyArtwork?.id ?? null;
          sceneHandle.setFocusedArtwork(nextArtworkId);
          if (nearbyArtworkId !== nextArtworkId) {
            nearbyArtworkId = nextArtworkId;
            onNearbyArtworkChangeRef.current(nearbyArtwork);
          }
        }

        renderer.render(sceneHandle.scene, sceneHandle.camera);
        scheduleFrame();
      });
    };

    const handleVisibilityChange = () => {
      runtime.run(() => {
        previousFrameTime = null;
        controls?.setEnabled(!document.hidden && !pausedRef.current);

        if (document.hidden) {
          if (animationFrame !== 0) window.cancelAnimationFrame(animationFrame);
          animationFrame = 0;
        } else {
          scheduleFrame();
        }
      });
    };

    const handleContextLost = (event: Event) => {
      event.preventDefault();
      runtime.fail(new Error("The gallery WebGL context was lost"));
    };

    const safely = (operation: () => void) => {
      try {
        operation();
      } catch {
        // Continue releasing the remaining independently owned resources.
      }
    };

    const cleanup = () => {
      if (cleanedUp) return;
      cleanedUp = true;
      disposed = true;
      safely(() => document.removeEventListener("visibilitychange", handleVisibilityChange));
      safely(() => contextLossTarget?.removeEventListener("webglcontextlost", handleContextLost));
      safely(() => resizeObserver?.disconnect());
      safely(() => {
        if (animationFrame !== 0) window.cancelAnimationFrame(animationFrame);
      });
      animationFrame = 0;
      safely(() => controls?.dispose());
      if (controlsRef.current === controls) controlsRef.current = null;
      safely(() => sceneHandle?.dispose());
      safely(() => renderer?.dispose());
      safely(() => {
        if (renderer?.domElement.parentNode === container) {
          container.removeChild(renderer.domElement);
        }
      });
    };

    const runtime = createGalleryRuntimeBoundary(
      cleanup,
      (error) => onFatalErrorRef.current(error),
    );

    try {
      const dimensions = getDimensions();
      const quality = getQualityTier(dimensions.width, window.devicePixelRatio || 1);
      renderer = new THREE.WebGLRenderer({
        antialias: true,
        powerPreference: "high-performance",
      });
      renderer.outputColorSpace = THREE.SRGBColorSpace;
      renderer.shadowMap.enabled = quality.tier === "desktop";
      renderer.setPixelRatio(quality.dpr);
      renderer.setSize(dimensions.width, dimensions.height, false);
      renderer.domElement.style.display = "block";
      renderer.domElement.style.width = "100%";
      renderer.domElement.style.height = "100%";
      container.appendChild(renderer.domElement);
      contextLossTarget = renderer.domElement;
      contextLossTarget.addEventListener("webglcontextlost", handleContextLost);

      const maxAnisotropy = renderer.capabilities.getMaxAnisotropy();

      sceneHandle = createGalleryScene({
        ...dimensions,
        bounds: GALLERY_BOUNDS,
        quality,
        maxAnisotropy,
      });
      controls = new GalleryInputController();
      controlsRef.current = controls;
      controls.setEnabled(!pausedRef.current && !document.hidden);
      controls.setJoystick(joystickRef.current.x, joystickRef.current.y);
      controls.subscribeAction(
        createGalleryActionHandler(
          () => nearbyArtwork,
          (artwork) => onActionRef.current(artwork),
        ),
      );

      sceneHandle.updateCharacter(characterState, simulationTime, reducedMotionRef.current);
      renderer.render(sceneHandle.scene, sceneHandle.camera);

      resizeObserver = new ResizeObserver(() => {
        runtime.run(() => {
          if (!renderer || !sceneHandle) return;
          const nextDimensions = getDimensions();
          renderer.setSize(nextDimensions.width, nextDimensions.height, false);
          sceneHandle.resize(nextDimensions.width, nextDimensions.height);
        });
      });
      resizeObserver.observe(container);
      document.addEventListener("visibilitychange", handleVisibilityChange);
      observeGalleryReadiness(
        sceneHandle.ready,
        runtime,
        () => {
          if (!renderer || !sceneHandle) return;
          renderer.render(sceneHandle.scene, sceneHandle.camera);
        },
        () => onReadyRef.current(),
      );
      scheduleFrame();
    } catch (error) {
      runtime.fail(error);
    }

    return () => {
      try {
        document.removeEventListener("visibilitychange", handleVisibilityChange);
        contextLossTarget?.removeEventListener("webglcontextlost", handleContextLost);
        resizeObserver?.disconnect();
        if (animationFrame !== 0) window.cancelAnimationFrame(animationFrame);
      } finally {
        runtime.shutdown();
      }
    };
  }, []);

  return (
    <div
      ref={containerRef}
      data-gallery-canvas
      aria-hidden="true"
      style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}
    />
  );
}

function toError(error: unknown): Error {
  return error instanceof Error ? error : new Error("Unable to initialize the 3D gallery", { cause: error });
}
