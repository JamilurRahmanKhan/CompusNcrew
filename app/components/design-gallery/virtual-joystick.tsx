"use client";

import { useEffect, useRef, useState } from "react";

import type { Vector2 } from "./gallery-controller";
import { GalleryJoystickPointerController } from "./gallery-ui-utils";
import styles from "./design-gallery.module.css";

export interface VirtualJoystickProps {
  disabled: boolean;
  onChange: (vector: Vector2) => void;
}

export function VirtualJoystick({ disabled, onChange }: VirtualJoystickProps) {
  const baseRef = useRef<HTMLDivElement>(null);
  const onChangeRef = useRef(onChange);
  const [knobOffset, setKnobOffset] = useState<Vector2>({ x: 0, y: 0 });
  const controllerRef = useRef<GalleryJoystickPointerController | null>(null);

  onChangeRef.current = onChange;

  if (controllerRef.current === null) {
    controllerRef.current = new GalleryJoystickPointerController(
      setKnobOffset,
      (vector) => onChangeRef.current(vector),
    );
  }

  useEffect(() => {
    if (disabled) controllerRef.current?.reset();
  }, [disabled]);

  const getPointerGeometry = (event: React.PointerEvent<HTMLDivElement>) => {
    const bounds = event.currentTarget.getBoundingClientRect();
    return {
      origin: {
        x: bounds.left + bounds.width / 2,
        y: bounds.top + bounds.height / 2,
      },
      pointer: { x: event.clientX, y: event.clientY },
    };
  };

  const handlePointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    if (disabled || !event.isPrimary || event.button !== 0) return;
    const geometry = getPointerGeometry(event);
    const handled = controllerRef.current?.begin(
      event.pointerId,
      event.currentTarget,
      geometry.origin,
      geometry.pointer,
    );
    if (handled) event.preventDefault();
  };

  const handlePointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    const bounds = event.currentTarget.getBoundingClientRect();
    const handled = controllerRef.current?.move(
      event.pointerId,
      { x: bounds.left + bounds.width / 2, y: bounds.top + bounds.height / 2 },
      { x: event.clientX, y: event.clientY },
    );
    if (handled) event.preventDefault();
  };

  const handlePointerEnd = (event: React.PointerEvent<HTMLDivElement>) => {
    if (controllerRef.current?.end(event.pointerId)) event.preventDefault();
  };

  const handlePointerCancel = (event: React.PointerEvent<HTMLDivElement>) => {
    if (controllerRef.current?.cancel(event.pointerId)) event.preventDefault();
  };

  const handleLostPointerCapture = (event: React.PointerEvent<HTMLDivElement>) => {
    controllerRef.current?.lostCapture(event.pointerId);
  };

  return (
    <div
      ref={baseRef}
      className={styles.joystick}
      role="group"
      aria-label="Move around the design gallery"
      aria-disabled={disabled}
      data-disabled={disabled || undefined}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerEnd}
      onPointerCancel={handlePointerCancel}
      onLostPointerCapture={handleLostPointerCapture}
    >
      <span
        className={styles.joystickKnob}
        aria-hidden="true"
        style={{ transform: `translate3d(${knobOffset.x}px, ${knobOffset.y}px, 0)` }}
      />
    </div>
  );
}
