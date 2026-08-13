import assert from "node:assert/strict";
import test from "node:test";

import {
  acquireGalleryPageLock,
  createInitialGalleryState,
  galleryExperienceReducer,
  isGalleryBackgroundInert,
  isGalleryPaused,
} from "./design-gallery-state";

function createClassList(initial: readonly string[] = []) {
  const classes = new Set(initial);
  return {
    classes,
    target: {
      classList: {
        add: (name: string) => classes.add(name),
        contains: (name: string) => classes.has(name),
        remove: (name: string) => classes.delete(name),
      },
    },
  };
}

test("renderer readiness and failure move the experience into the correct terminal state", () => {
  const initial = createInitialGalleryState(false);
  const ready = galleryExperienceReducer(initial, { type: "renderer-ready" });

  assert.equal(ready.status, "ready");

  const withInteraction = {
    ...ready,
    nearbyProjectIndex: 2,
    activeProjectIndex: 2,
    joystickVector: { x: 0.5, y: -0.25 },
  };
  const fallback = galleryExperienceReducer(withInteraction, { type: "renderer-failed" });

  assert.equal(fallback.status, "fallback");
  assert.equal(fallback.nearbyProjectIndex, null);
  assert.equal(fallback.activeProjectIndex, null);
  assert.deepEqual(fallback.joystickVector, { x: 0, y: 0 });
});

test("the guide remains available until the first real movement and can be reopened", () => {
  const initial = createInitialGalleryState(false);
  const stationary = galleryExperienceReducer(initial, {
    type: "joystick-changed",
    vector: { x: 0, y: 0 },
  });
  const moved = galleryExperienceReducer(stationary, {
    type: "joystick-changed",
    vector: { x: 0.01, y: 0 },
  });
  const reopened = galleryExperienceReducer(moved, { type: "toggle-help" });

  assert.equal(stationary.helpVisible, true);
  assert.equal(moved.helpVisible, false);
  assert.equal(reopened.helpVisible, true);
});

test("keyboard movement dismisses the guide without injecting joystick movement", () => {
  const moved = galleryExperienceReducer(createInitialGalleryState(false), {
    type: "movement-detected",
  });

  assert.equal(moved.helpVisible, false);
  assert.deepEqual(moved.joystickVector, { x: 0, y: 0 });
});

test("nearby work opens contextually and previous or next wraps without closing", () => {
  const nearby = galleryExperienceReducer(createInitialGalleryState(false), {
    type: "nearby-project-changed",
    index: 0,
  });
  const opened = galleryExperienceReducer(nearby, { type: "open-nearby-project" });
  const previous = galleryExperienceReducer(opened, {
    type: "show-adjacent-project",
    direction: -1,
    projectCount: 4,
  });
  const next = galleryExperienceReducer(previous, {
    type: "show-adjacent-project",
    direction: 1,
    projectCount: 4,
  });

  assert.equal(opened.activeProjectIndex, 0);
  assert.equal(previous.activeProjectIndex, 3);
  assert.equal(next.activeProjectIndex, 0);
});

test("a project panel or site menu pauses and inerts the gallery background", () => {
  const ready = galleryExperienceReducer(createInitialGalleryState(true), {
    type: "renderer-ready",
  });
  const menuOpen = galleryExperienceReducer(ready, { type: "menu-changed", open: true });
  const projectOpen = galleryExperienceReducer(ready, { type: "open-project", index: 1 });

  assert.equal(ready.reducedMotion, true);
  assert.equal(isGalleryPaused(ready), false);
  assert.equal(isGalleryBackgroundInert(ready), false);
  assert.equal(isGalleryPaused(menuOpen), true);
  assert.equal(isGalleryBackgroundInert(menuOpen), true);
  assert.equal(isGalleryPaused(projectOpen), true);
  assert.equal(isGalleryBackgroundInert(projectOpen), true);
});

test("opening the site menu closes a project panel so modal focus scopes cannot overlap", () => {
  const projectOpen = galleryExperienceReducer(createInitialGalleryState(false), {
    type: "open-project",
    index: 1,
  });
  const menuOpen = galleryExperienceReducer(projectOpen, { type: "menu-changed", open: true });

  assert.equal(menuOpen.menuOpen, true);
  assert.equal(menuOpen.activeProjectIndex, null);
});

test("the gallery page lock owns only the class it adds", () => {
  const added = createClassList();
  const releaseAddedLock = acquireGalleryPageLock(added.target);

  assert.equal(added.classes.has("journey-mode"), true);
  releaseAddedLock();
  assert.equal(added.classes.has("journey-mode"), false);

  const existing = createClassList(["journey-mode"]);
  const releaseExistingLock = acquireGalleryPageLock(existing.target);
  releaseExistingLock();
  assert.equal(existing.classes.has("journey-mode"), true);
});
