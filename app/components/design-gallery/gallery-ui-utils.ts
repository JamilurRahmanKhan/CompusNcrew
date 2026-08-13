import type { Vector2 } from "./gallery-controller";

export const JOYSTICK_RADIUS = 44;

export interface Point {
  x: number;
  y: number;
}

export interface JoystickPosition {
  offset: Vector2;
  vector: Vector2;
}

export interface PointerCaptureTarget {
  setPointerCapture(pointerId: number): void;
  hasPointerCapture(pointerId: number): boolean;
  releasePointerCapture(pointerId: number): void;
}

export interface FocusTarget {
  focus(options?: FocusOptions): void;
}

export interface DialogKeyboardEvent {
  key: string;
  shiftKey: boolean;
  preventDefault(): void;
  stopPropagation(): void;
}

export function calculateJoystickPosition(
  origin: Point,
  pointer: Point,
  radius = JOYSTICK_RADIUS,
): JoystickPosition {
  const delta = {
    x: pointer.x - origin.x,
    y: pointer.y - origin.y,
  };
  const distance = Math.hypot(delta.x, delta.y);
  const scale = distance > radius ? radius / distance : 1;
  const offset = {
    x: delta.x * scale,
    y: delta.y * scale,
  };

  return {
    offset,
    vector: {
      x: offset.x / radius,
      y: offset.y / radius,
    },
  };
}

export function getFocusWrapIndex(
  currentIndex: number,
  focusableCount: number,
  backwards: boolean,
): number | null {
  if (focusableCount <= 0) return null;
  if (currentIndex < 0) return backwards ? focusableCount - 1 : 0;
  if (backwards && currentIndex === 0) return focusableCount - 1;
  if (!backwards && currentIndex === focusableCount - 1) return 0;
  return null;
}

export class GalleryJoystickPointerController {
  private activePointerId: number | null = null;
  private captureTarget: PointerCaptureTarget | null = null;

  constructor(
    private readonly onOffsetChange: (offset: Vector2) => void,
    private readonly onVectorChange: (vector: Vector2) => void,
  ) {}

  begin(
    pointerId: number,
    target: PointerCaptureTarget,
    origin: Point,
    pointer: Point,
  ): boolean {
    if (this.activePointerId !== null) return false;
    target.setPointerCapture(pointerId);
    this.activePointerId = pointerId;
    this.captureTarget = target;
    this.emitPosition(origin, pointer);
    return true;
  }

  move(pointerId: number, origin: Point, pointer: Point): boolean {
    if (pointerId !== this.activePointerId) return false;
    this.emitPosition(origin, pointer);
    return true;
  }

  end(pointerId: number): boolean {
    return this.finish(pointerId, true);
  }

  cancel(pointerId: number): boolean {
    return this.finish(pointerId, true);
  }

  lostCapture(pointerId: number): boolean {
    return this.finish(pointerId, false);
  }

  reset(): void {
    const pointerId = this.activePointerId;
    if (pointerId === null) {
      this.emitZero();
      return;
    }
    this.finish(pointerId, true);
  }

  private finish(pointerId: number, releaseCapture: boolean): boolean {
    if (pointerId !== this.activePointerId) return false;
    const target = this.captureTarget;
    this.activePointerId = null;
    this.captureTarget = null;

    if (releaseCapture && target?.hasPointerCapture(pointerId)) {
      target.releasePointerCapture(pointerId);
    }

    this.emitZero();
    return true;
  }

  private emitPosition(origin: Point, pointer: Point): void {
    const position = calculateJoystickPosition(origin, pointer);
    this.onOffsetChange(position.offset);
    this.onVectorChange(position.vector);
  }

  private emitZero(): void {
    this.onOffsetChange({ x: 0, y: 0 });
    this.onVectorChange({ x: 0, y: 0 });
  }
}

export function handleDialogKeyboardEvent<T extends FocusTarget>(
  event: DialogKeyboardEvent,
  focusableElements: readonly T[],
  activeElement: T | null,
  onClose: () => void,
): boolean {
  if (event.key === "Escape") {
    event.preventDefault();
    event.stopPropagation();
    onClose();
    return true;
  }

  if (event.key !== "Tab") return false;
  const currentIndex = activeElement === null ? -1 : focusableElements.indexOf(activeElement);
  const wrapIndex = getFocusWrapIndex(currentIndex, focusableElements.length, event.shiftKey);
  if (wrapIndex === null) return false;

  event.preventDefault();
  focusableElements[wrapIndex]?.focus({ preventScroll: true });
  return true;
}

export function getPreferredFocusReturnTarget<T extends { isConnected: boolean }>(
  previousTarget: T | null,
  body: T,
  documentElement: T,
  fallbackTarget: T | null,
): T | null {
  if (
    previousTarget?.isConnected
    && previousTarget !== body
    && previousTarget !== documentElement
  ) {
    return previousTarget;
  }

  return fallbackTarget?.isConnected ? fallbackTarget : null;
}
