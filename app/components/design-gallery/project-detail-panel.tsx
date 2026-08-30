"use client";

import Image from "next/image";
import { useEffect, useId, useRef } from "react";

import type { GalleryArtwork } from "./gallery-data";
import {
  getPreferredFocusReturnTarget,
  handleDialogKeyboardEvent,
} from "./gallery-ui-utils";
import styles from "./design-gallery.module.css";

export interface ProjectDetailPanelProps {
  project: GalleryArtwork;
  onClose: () => void;
  onPrevious: () => void;
  onNext: () => void;
}

const FOCUSABLE_SELECTOR = [
  "a[href]",
  "button:not([disabled])",
  "input:not([disabled])",
  "select:not([disabled])",
  "textarea:not([disabled])",
  "[tabindex]:not([tabindex='-1'])",
].join(", ");

export function ProjectDetailPanel({
  project,
  onClose,
  onPrevious,
  onNext,
}: ProjectDetailPanelProps) {
  const dialogRef = useRef<HTMLElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const onCloseRef = useRef(onClose);
  const titleId = useId();
  const descriptionId = useId();

  useEffect(() => {
    onCloseRef.current = onClose;
  }, [onClose]);

  useEffect(() => {
    const previouslyFocused = document.activeElement instanceof HTMLElement
      ? document.activeElement
      : null;

    closeButtonRef.current?.focus({ preventScroll: true });

    const handleKeyDown = (event: KeyboardEvent) => {
      const dialog = dialogRef.current;
      if (!dialog) return;

      const focusableElements = Array.from(
        dialog.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR),
      ).filter((element) => element.getAttribute("aria-hidden") !== "true");
      handleDialogKeyboardEvent(
        event,
        focusableElements,
        document.activeElement as HTMLElement | null,
        () => onCloseRef.current(),
      );
    };

    document.addEventListener("keydown", handleKeyDown, true);

    return () => {
      document.removeEventListener("keydown", handleKeyDown, true);
      const returnTarget = getPreferredFocusReturnTarget(
        previouslyFocused,
        document.body,
        document.documentElement,
        document.querySelector<HTMLElement>("[data-gallery-action]"),
      );
      returnTarget?.focus({ preventScroll: true });
    };
  }, []);

  return (
    <div className={styles.detailOverlay}>
      <section
        ref={dialogRef}
        className={styles.detailPanel}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={descriptionId}
      >
        <div className={styles.detailMedia}>
          <Image
            className={styles.detailImage}
            src={project.imageSrc}
            alt={project.imageAlt}
            fill
            sizes="(max-width: 760px) 100vw, 62vw"
          />
        </div>

        <div className={styles.detailContent}>
          <button
            ref={closeButtonRef}
            className={styles.detailClose}
            type="button"
            onClick={onClose}
          >
            <span aria-hidden="true">×</span>
            <span className={styles.visuallyHidden}>Close project details</span>
          </button>

          <p className={styles.detailCategory}>{project.category}</p>
          <h2 className={styles.detailTitle} id={titleId}>{project.title}</h2>
          <p className={styles.detailDescription} id={descriptionId}>
            {project.description}
          </p>

          <div
            className={styles.detailNavigation}
            role="group"
            aria-label="Browse portfolio projects"
          >
            <button type="button" onClick={onPrevious}>
              <span aria-hidden="true">←</span>
              Previous
            </button>
            <button type="button" onClick={onNext}>
              Next
              <span aria-hidden="true">→</span>
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
