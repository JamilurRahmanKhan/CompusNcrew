import assert from "node:assert/strict";
import test from "node:test";

import { GalleryInputController } from "./gallery-controls";

class FakeWindow extends EventTarget {}

class FakeDocument extends EventTarget {
  hidden = false;
}

function keyboardEvent(type: "keydown" | "keyup", key: string, repeat = false): Event {
  const event = new Event(type, { cancelable: true });
  Object.defineProperties(event, {
    key: { value: key },
    repeat: { value: repeat },
  });
  return event;
}

function setupController() {
  const windowTarget = new FakeWindow();
  const documentTarget = new FakeDocument();
  const controller = new GalleryInputController(
    windowTarget as unknown as Window,
    documentTarget as unknown as Document,
  );
  return { controller, windowTarget, documentTarget };
}

test("keyboard movement maps WASD and arrows to a normalized vector", () => {
  const { controller, windowTarget } = setupController();
  const up = keyboardEvent("keydown", "ArrowUp");
  const right = keyboardEvent("keydown", "d");

  windowTarget.dispatchEvent(up);
  windowTarget.dispatchEvent(right);

  assert.equal(up.defaultPrevented, true);
  assert.equal(right.defaultPrevented, true);
  assert.ok(Math.abs(controller.getVector().x - Math.SQRT1_2) < 0.000001);
  assert.ok(Math.abs(controller.getVector().y + Math.SQRT1_2) < 0.000001);

  windowTarget.dispatchEvent(keyboardEvent("keyup", "ArrowUp"));
  assert.deepEqual(controller.getVector(), { x: 1, y: 0 });
  controller.dispose();
});

test("keyboard and joystick input aggregate without exceeding unit length", () => {
  const { controller, windowTarget } = setupController();
  controller.setJoystick(0.8, -0.6);
  windowTarget.dispatchEvent(keyboardEvent("keydown", "w"));

  const vector = controller.getVector();
  assert.ok(Math.abs(Math.hypot(vector.x, vector.y) - 1) < 0.000001);
  assert.ok(vector.x > 0);
  assert.ok(vector.y < 0);
  controller.dispose();
});

test("non-finite joystick axes are ignored instead of poisoning movement", () => {
  const { controller } = setupController();
  controller.setJoystick(Number.NaN, Number.POSITIVE_INFINITY);

  assert.deepEqual(controller.getVector(), { x: 0, y: 0 });
  controller.dispose();
});

test("Enter notifies active subscribers once per physical key press", () => {
  const { controller, windowTarget } = setupController();
  let actions = 0;
  const unsubscribe = controller.subscribeAction(() => {
    actions += 1;
  });

  const initialPress = keyboardEvent("keydown", "Enter");
  windowTarget.dispatchEvent(initialPress);
  windowTarget.dispatchEvent(keyboardEvent("keydown", "Enter", true));
  unsubscribe();
  windowTarget.dispatchEvent(keyboardEvent("keydown", "Enter"));

  assert.equal(initialPress.defaultPrevented, true);
  assert.equal(actions, 1);
  controller.dispose();
});

test("disabled controls do not capture keys and clear movement state", () => {
  const { controller, windowTarget } = setupController();
  windowTarget.dispatchEvent(keyboardEvent("keydown", "a"));
  controller.setEnabled(false);
  const disabledPress = keyboardEvent("keydown", "d");
  windowTarget.dispatchEvent(disabledPress);

  assert.equal(disabledPress.defaultPrevented, false);
  assert.deepEqual(controller.getVector(), { x: 0, y: 0 });
  controller.dispose();
});

test("blur and document visibility changes clear held keys", () => {
  const { controller, windowTarget, documentTarget } = setupController();
  windowTarget.dispatchEvent(keyboardEvent("keydown", "s"));
  windowTarget.dispatchEvent(new Event("blur"));
  assert.deepEqual(controller.getVector(), { x: 0, y: 0 });

  windowTarget.dispatchEvent(keyboardEvent("keydown", "w"));
  documentTarget.hidden = true;
  documentTarget.dispatchEvent(new Event("visibilitychange"));
  assert.deepEqual(controller.getVector(), { x: 0, y: 0 });
  controller.dispose();
});
