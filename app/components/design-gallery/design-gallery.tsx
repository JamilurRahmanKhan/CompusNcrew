"use client";

import Image from "next/image";
import { useCallback, useEffect, useReducer } from "react";

import { DesignGalleryCanvas } from "./design-gallery-canvas";
import styles from "./design-gallery.module.css";
import {
  acquireGalleryPageLock,
  createInitialGalleryState,
  galleryExperienceReducer,
  isGalleryBackgroundInert,
  isGalleryPaused,
  SITE_MENU_STATE_EVENT,
} from "./design-gallery-state";
import { designServices, portfolioWorks, type GalleryArtwork } from "./gallery-data";
import { GalleryHelp } from "./gallery-help";
import { ProjectDetailPanel } from "./project-detail-panel";
import { VirtualJoystick } from "./virtual-joystick";

const REDUCED_MOTION_QUERY = "(prefers-reduced-motion: reduce)";
const MOVEMENT_KEYS = new Set([
  "ArrowUp",
  "ArrowDown",
  "ArrowLeft",
  "ArrowRight",
  "w",
  "a",
  "s",
  "d",
]);

export function DesignGallery() {
  const [state, dispatch] = useReducer(
    galleryExperienceReducer,
    false,
    createInitialGalleryState,
  );
  const paused = isGalleryPaused(state);
  const backgroundInert = isGalleryBackgroundInert(state);
  const nearbyProject = state.nearbyProjectIndex === null
    ? null
    : portfolioWorks[state.nearbyProjectIndex] ?? null;
  const activeProject = state.activeProjectIndex === null
    ? null
    : portfolioWorks[state.activeProjectIndex] ?? null;

  useEffect(() => {
    return acquireGalleryPageLock(document.body);
  }, []);

  useEffect(() => {
    const mediaQuery = window.matchMedia(REDUCED_MOTION_QUERY);
    const updatePreference = () => {
      dispatch({ type: "reduced-motion-changed", reducedMotion: mediaQuery.matches });
    };

    updatePreference();
    mediaQuery.addEventListener("change", updatePreference);
    return () => mediaQuery.removeEventListener("change", updatePreference);
  }, []);

  useEffect(() => {
    const updateMenuState = (event?: Event) => {
      const eventOpen = event instanceof CustomEvent
        ? Boolean((event.detail as { open?: boolean } | null)?.open)
        : null;
      const open = eventOpen ?? document.body.dataset.siteMenuOpen === "true";
      dispatch({ type: "menu-changed", open });
    };

    updateMenuState();
    window.addEventListener(SITE_MENU_STATE_EVENT, updateMenuState);
    return () => window.removeEventListener(SITE_MENU_STATE_EVENT, updateMenuState);
  }, []);

  useEffect(() => {
    if (state.status !== "ready" || paused || !state.helpVisible) return;

    const dismissGuideOnMovement = (event: KeyboardEvent) => {
      if (!MOVEMENT_KEYS.has(event.key.toLowerCase()) && !MOVEMENT_KEYS.has(event.key)) {
        return;
      }
      if (isInteractiveTarget(event.target)) return;
      dispatch({ type: "movement-detected" });
    };

    window.addEventListener("keydown", dismissGuideOnMovement);
    return () => window.removeEventListener("keydown", dismissGuideOnMovement);
  }, [paused, state.helpVisible, state.status]);

  const getProjectIndex = useCallback((project: GalleryArtwork): number | null => {
    const index = portfolioWorks.findIndex((item) => item.id === project.id);
    return index < 0 ? null : index;
  }, []);

  const handleNearbyProjectChange = useCallback((project: GalleryArtwork | null) => {
    dispatch({
      type: "nearby-project-changed",
      index: project === null ? null : getProjectIndex(project),
    });
  }, [getProjectIndex]);

  const handleCanvasAction = useCallback((project: GalleryArtwork) => {
    const index = getProjectIndex(project);
    if (index !== null) dispatch({ type: "open-project", index });
  }, [getProjectIndex]);

  const handleJoystickChange = useCallback((vector: { x: number; y: number }) => {
    dispatch({ type: "joystick-changed", vector });
  }, []);

  const showFallback = useCallback((event: React.MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();
    dispatch({ type: "show-fallback" });
    window.requestAnimationFrame(() => {
      document.getElementById("gallery-fallback")?.focus({ preventScroll: true });
    });
  }, []);

  if (state.status === "fallback") {
    return <GalleryFallback />;
  }

  return (
    <section className={styles.experience} aria-label="Interactive graphic design gallery">
      <div
        className={styles.canvasLayer}
        inert={backgroundInert}
        aria-hidden={backgroundInert || undefined}
      >
        <a
          className="skip-link"
          href="#gallery-fallback"
          style={{ top: "4.5rem" }}
          onClick={showFallback}
        >
          Skip the 3D gallery
        </a>

        <DesignGalleryCanvas
          paused={paused}
          reducedMotion={state.reducedMotion}
          joystickVector={state.joystickVector}
          onReady={() => dispatch({ type: "renderer-ready" })}
          onNearbyArtworkChange={handleNearbyProjectChange}
          onAction={handleCanvasAction}
          onFatalError={() => dispatch({ type: "renderer-failed" })}
        />

        {state.status === "ready" ? (
          <div className={styles.interfaceLayer}>
            <GalleryHelp
              visible={state.helpVisible}
              classNames={{
                guide: styles.controlGuide,
                group: styles.controlGuideGroup,
                keyboard: styles.keyboardHelp,
                touch: styles.touchHelp,
                button: styles.helpButton,
              }}
              onToggle={() => dispatch({ type: "toggle-help" })}
            />

            {nearbyProject ? (
              <button
                className={`${styles.proximityLabel} ${styles.actionButton}`}
                data-gallery-action
                type="button"
                aria-label={`View ${nearbyProject.title}`}
                onClick={() => dispatch({ type: "open-nearby-project" })}
              >
                {nearbyProject.title} — view work
              </button>
            ) : null}

            <div className={styles.mobileControls}>
              <VirtualJoystick disabled={paused} onChange={handleJoystickChange} />
              <button
                className={styles.actionButton}
                type="button"
                disabled={!nearbyProject}
                onClick={() => dispatch({ type: "open-nearby-project" })}
              >
                {nearbyProject ? "View work" : "Explore gallery"}
              </button>
            </div>
          </div>
        ) : null}

        <div
          className={styles.loadingLayer}
          data-hidden={state.status !== "loading"}
          role="status"
          aria-live="polite"
        >
          <p className={styles.loadingStatus}>
            <span className={styles.loadingMark} aria-hidden="true" />
            Preparing the design gallery
          </p>
        </div>
      </div>

      {activeProject ? (
        <ProjectDetailPanel
          project={activeProject}
          onClose={() => dispatch({ type: "close-project" })}
          onPrevious={() => dispatch({
            type: "show-adjacent-project",
            direction: -1,
            projectCount: portfolioWorks.length,
          })}
          onNext={() => dispatch({
            type: "show-adjacent-project",
            direction: 1,
            projectCount: portfolioWorks.length,
          })}
        />
      ) : null}
    </section>
  );
}

function GalleryFallback() {
  return (
    <section
      className={`${styles.experience} overflow-y-auto bg-[#f7f4ed] px-6 pb-20 pt-28`}
      id="gallery-fallback"
      style={{ overflowY: "auto" }}
      tabIndex={-1}
      aria-labelledby="gallery-fallback-title"
    >
      <div className="mx-auto max-w-[80rem]">
        <header className="max-w-3xl pb-14">
          <p className="font-mono text-xs uppercase tracking-[0.16em] text-[#67645e]">
            CompassNCrew Design Studio
          </p>
          <h1
            className="mt-4 font-display text-5xl leading-[0.95] tracking-[-0.045em] text-[#171715] sm:text-7xl"
            id="gallery-fallback-title"
          >
            Graphic design with a system behind it.
          </h1>
          <p className="mt-6 max-w-2xl text-base leading-7 text-[#67645e]">
            Brand, campaign, product, and social design built as one coherent visual language.
          </p>
        </header>

        <section className="border-y border-black/15 py-8" aria-labelledby="design-services-title">
          <h2 className="font-mono text-xs uppercase tracking-[0.16em] text-[#67645e]" id="design-services-title">
            Design services
          </h2>
          <ul className="mt-6 grid gap-3 text-2xl text-[#171715] sm:grid-cols-2 lg:grid-cols-4">
            {designServices.map((service) => <li key={service}>{service}</li>)}
          </ul>
        </section>

        <section className="pt-14" aria-labelledby="selected-work-title">
          <h2 className="font-display text-4xl text-[#171715] sm:text-5xl" id="selected-work-title">
            Selected work
          </h2>
          <div className="mt-8 grid gap-8 sm:grid-cols-2">
            {portfolioWorks.map((project) => (
              <article className="overflow-hidden border border-black/15 bg-white" key={project.id}>
                <div className="relative aspect-[4/3] bg-[#e8e5de]">
                  <Image
                    src={project.imageSrc}
                    alt={project.imageAlt}
                    fill
                    sizes="(max-width: 640px) 100vw, 50vw"
                    className="object-contain"
                  />
                </div>
                <div className="p-6">
                  <p className="font-mono text-xs uppercase tracking-[0.14em] text-[#67645e]">
                    {project.category}
                  </p>
                  <h3 className="mt-2 font-display text-3xl text-[#171715]">{project.title}</h3>
                  <p className="mt-3 max-w-xl leading-7 text-[#67645e]">{project.description}</p>
                </div>
              </article>
            ))}
          </div>
        </section>
      </div>
    </section>
  );
}

function isInteractiveTarget(target: EventTarget | null): boolean {
  if (!(target instanceof Element)) return false;
  return Boolean(target.closest("a, button, input, select, textarea, [contenteditable], [role]"));
}
