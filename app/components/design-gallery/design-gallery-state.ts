import type { Vector2 } from "./gallery-controller";

export type GalleryExperienceStatus = "loading" | "ready" | "fallback";

export const SITE_MENU_STATE_EVENT = "compassncrew:site-menu-state-change";

export interface GalleryExperienceState {
  status: GalleryExperienceStatus;
  helpVisible: boolean;
  nearbyProjectIndex: number | null;
  activeProjectIndex: number | null;
  menuOpen: boolean;
  reducedMotion: boolean;
  joystickVector: Vector2;
}

export type GalleryExperienceAction =
  | { type: "renderer-ready" }
  | { type: "renderer-failed" }
  | { type: "show-fallback" }
  | { type: "toggle-help" }
  | { type: "movement-detected" }
  | { type: "joystick-changed"; vector: Vector2 }
  | { type: "nearby-project-changed"; index: number | null }
  | { type: "open-nearby-project" }
  | { type: "open-project"; index: number }
  | { type: "close-project" }
  | { type: "show-adjacent-project"; direction: -1 | 1; projectCount: number }
  | { type: "menu-changed"; open: boolean }
  | { type: "reduced-motion-changed"; reducedMotion: boolean };

const ZERO_VECTOR: Vector2 = { x: 0, y: 0 };

export function createInitialGalleryState(reducedMotion: boolean): GalleryExperienceState {
  return {
    status: "loading",
    helpVisible: true,
    nearbyProjectIndex: null,
    activeProjectIndex: null,
    menuOpen: false,
    reducedMotion,
    joystickVector: ZERO_VECTOR,
  };
}

export function galleryExperienceReducer(
  state: GalleryExperienceState,
  action: GalleryExperienceAction,
): GalleryExperienceState {
  switch (action.type) {
    case "renderer-ready":
      return state.status === "loading" ? { ...state, status: "ready" } : state;
    case "renderer-failed":
    case "show-fallback":
      return {
        ...state,
        status: "fallback",
        nearbyProjectIndex: null,
        activeProjectIndex: null,
        joystickVector: ZERO_VECTOR,
      };
    case "toggle-help":
      return { ...state, helpVisible: !state.helpVisible };
    case "movement-detected":
      return { ...state, helpVisible: false };
    case "joystick-changed":
      return {
        ...state,
        helpVisible: hasMovement(action.vector) ? false : state.helpVisible,
        joystickVector: action.vector,
      };
    case "nearby-project-changed":
      return { ...state, nearbyProjectIndex: action.index };
    case "open-nearby-project":
      return state.nearbyProjectIndex === null
        ? state
        : { ...state, activeProjectIndex: state.nearbyProjectIndex };
    case "open-project":
      return { ...state, activeProjectIndex: action.index };
    case "close-project":
      return { ...state, activeProjectIndex: null };
    case "show-adjacent-project": {
      if (state.activeProjectIndex === null || action.projectCount <= 0) return state;
      const activeProjectIndex = (
        state.activeProjectIndex + action.direction + action.projectCount
      ) % action.projectCount;
      return { ...state, activeProjectIndex };
    }
    case "menu-changed":
      return {
        ...state,
        menuOpen: action.open,
        activeProjectIndex: action.open ? null : state.activeProjectIndex,
      };
    case "reduced-motion-changed":
      return { ...state, reducedMotion: action.reducedMotion };
  }
}

export function isGalleryPaused(state: GalleryExperienceState): boolean {
  return state.status !== "ready" || state.menuOpen || state.activeProjectIndex !== null;
}

export function isGalleryBackgroundInert(state: GalleryExperienceState): boolean {
  return state.menuOpen || state.activeProjectIndex !== null;
}

function hasMovement(vector: Vector2): boolean {
  return vector.x !== 0 || vector.y !== 0;
}
