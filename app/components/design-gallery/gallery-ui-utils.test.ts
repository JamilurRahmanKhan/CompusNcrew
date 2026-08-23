import assert from "node:assert/strict";
import test from "node:test";

import * as galleryUiUtils from "./gallery-ui-utils";
import {
  calculateJoystickPosition,
  GalleryJoystickPointerController,
  getPreferredFocusReturnTarget,
  getFocusWrapIndex,
  handleDialogKeyboardEvent,
} from "./gallery-ui-utils";

test("the Help disclosure binds its expanded state to a stable guide", () => {
  const getGalleryHelpDisclosure = (
    galleryUiUtils as unknown as {
      getGalleryHelpDisclosure?: (visible: boolean) => {
        guideId: string;
        buttonLabel: string;
        expanded: boolean;
        guideHidden: boolean;
      };
    }
  ).getGalleryHelpDisclosure;
  assert.equal(typeof getGalleryHelpDisclosure, "function");
  if (!getGalleryHelpDisclosure) return;

  assert.deepEqual(getGalleryHelpDisclosure(true), {
    guideId: "gallery-controls-guide",
    buttonLabel: "Hide gallery controls",
    expanded: true,
    guideHidden: false,
  });
  assert.deepEqual(getGalleryHelpDisclosure(false), {
    guideId: "gallery-controls-guide",
    buttonLabel: "Show gallery controls",
    expanded: false,
    guideHidden: true,
  });
});

test("joystick position preserves analog strength inside the 44px radius", () => {
  const position = calculateJoystickPosition(
    { x: 100, y: 100 },
    { x: 122, y: 78 },
  );

  assert.deepEqual(position.offset, { x: 22, y: -22 });
  assert.deepEqual(position.vector, { x: 0.5, y: -0.5 });
});

test("joystick position clamps diagonal input to the 44px radius", () => {
  const position = calculateJoystickPosition(
    { x: 0, y: 0 },
    { x: 100, y: 100 },
  );

  assert.ok(Math.abs(Math.hypot(position.offset.x, position.offset.y) - 44) < 0.000001);
  assert.ok(Math.abs(position.vector.x - Math.SQRT1_2) < 0.000001);
  assert.ok(Math.abs(position.vector.y - Math.SQRT1_2) < 0.000001);
});

test("focus wrapping returns only the boundary target needed to contain Tab", () => {
  assert.equal(getFocusWrapIndex(2, 3, false), 0);
  assert.equal(getFocusWrapIndex(0, 3, true), 2);
  assert.equal(getFocusWrapIndex(1, 3, false), null);
  assert.equal(getFocusWrapIndex(-1, 3, false), 0);
  assert.equal(getFocusWrapIndex(-1, 3, true), 2);
  assert.equal(getFocusWrapIndex(0, 0, false), null);
});

test("focus return prefers the trigger and falls back from document roots", () => {
  const body = { isConnected: true };
  const documentElement = { isConnected: true };
  const trigger = { isConnected: true };
  const detachedTrigger = { isConnected: false };
  const action = { isConnected: true };

  assert.equal(
    getPreferredFocusReturnTarget(trigger, body, documentElement, action),
    trigger,
  );
  assert.equal(
    getPreferredFocusReturnTarget(body, body, documentElement, action),
    action,
  );
  assert.equal(
    getPreferredFocusReturnTarget(documentElement, body, documentElement, action),
    action,
  );
  assert.equal(
    getPreferredFocusReturnTarget(detachedTrigger, body, documentElement, action),
    action,
  );
});

test("joystick pointer controller captures, emits analog movement, and releases to zero", () => {
  const offsets: Array<{ x: number; y: number }> = [];
  const vectors: Array<{ x: number; y: number }> = [];
  const captures: number[] = [];
  const releases: number[] = [];
  const capturedPointers = new Set<number>();
  const target = {
    setPointerCapture(pointerId: number) {
      captures.push(pointerId);
      capturedPointers.add(pointerId);
    },
    hasPointerCapture(pointerId: number) {
      return capturedPointers.has(pointerId);
    },
    releasePointerCapture(pointerId: number) {
      releases.push(pointerId);
      capturedPointers.delete(pointerId);
    },
  };
  const controller = new GalleryJoystickPointerController(
    (offset) => offsets.push(offset),
    (vector) => vectors.push(vector),
  );

  assert.equal(
    controller.begin(7, target, { x: 100, y: 100 }, { x: 122, y: 78 }),
    true,
  );
  assert.equal(
    controller.move(8, { x: 100, y: 100 }, { x: 144, y: 100 }),
    false,
  );
  assert.equal(
    controller.move(7, { x: 100, y: 100 }, { x: 144, y: 100 }),
    true,
  );
  assert.equal(controller.end(7), true);

  assert.deepEqual(captures, [7]);
  assert.deepEqual(releases, [7]);
  assert.deepEqual(offsets, [
    { x: 22, y: -22 },
    { x: 44, y: 0 },
    { x: 0, y: 0 },
  ]);
  assert.deepEqual(vectors, [
    { x: 0.5, y: -0.5 },
    { x: 1, y: 0 },
    { x: 0, y: 0 },
  ]);
});

test("joystick pointer controller resets on cancel, lost capture, and disable", () => {
  const vectors: Array<{ x: number; y: number }> = [];
  const capturedPointers = new Set<number>();
  const target = {
    setPointerCapture(pointerId: number) { capturedPointers.add(pointerId); },
    hasPointerCapture(pointerId: number) { return capturedPointers.has(pointerId); },
    releasePointerCapture(pointerId: number) { capturedPointers.delete(pointerId); },
  };
  const controller = new GalleryJoystickPointerController(
    () => {},
    (vector) => vectors.push(vector),
  );

  controller.begin(1, target, { x: 0, y: 0 }, { x: 22, y: 0 });
  assert.equal(controller.cancel(1), true);
  controller.begin(2, target, { x: 0, y: 0 }, { x: 0, y: 22 });
  capturedPointers.delete(2);
  assert.equal(controller.lostCapture(2), true);
  controller.begin(3, target, { x: 0, y: 0 }, { x: -22, y: 0 });
  controller.reset();

  assert.deepEqual(vectors, [
    { x: 0.5, y: 0 },
    { x: 0, y: 0 },
    { x: 0, y: 0.5 },
    { x: 0, y: 0 },
    { x: -0.5, y: 0 },
    { x: 0, y: 0 },
  ]);
  assert.equal(capturedPointers.size, 0);
});

test("dialog keyboard handler closes on Escape and contains boundary Tab presses", () => {
  const focused: string[] = [];
  const elements = ["close", "previous", "next"].map((name) => ({
    focus() { focused.push(name); },
  }));
  let closes = 0;
  let prevented = 0;
  let stopped = 0;
  const event = (key: string, shiftKey = false) => ({
    key,
    shiftKey,
    preventDefault() { prevented += 1; },
    stopPropagation() { stopped += 1; },
  });

  assert.equal(handleDialogKeyboardEvent(event("Escape"), elements, elements[0], () => {
    closes += 1;
  }), true);
  assert.equal(handleDialogKeyboardEvent(event("Tab"), elements, elements[2], () => {}), true);
  assert.equal(handleDialogKeyboardEvent(event("Tab", true), elements, elements[0], () => {}), true);
  assert.equal(handleDialogKeyboardEvent(event("Tab"), elements, elements[1], () => {}), false);

  assert.equal(closes, 1);
  assert.equal(prevented, 3);
  assert.equal(stopped, 1);
  assert.deepEqual(focused, ["close", "next"]);
});
