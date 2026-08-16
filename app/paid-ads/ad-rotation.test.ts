import assert from "node:assert/strict";
import test from "node:test";

import { createAdRotationController, type RotationScheduler } from "./ad-rotation";

interface ScheduledTimer {
  callback: () => void;
  delay: number;
  cleared: boolean;
}

function createFakeScheduler(): RotationScheduler & {
  readonly timers: ScheduledTimer[];
  runNext(): void;
} {
  const timers: ScheduledTimer[] = [];

  return {
    timers,
    setTimeout(callback, delay) {
      const timer = { callback, delay, cleared: false };
      timers.push(timer);
      return timer as unknown as ReturnType<typeof setTimeout>;
    },
    clearTimeout(handle) {
      (handle as unknown as ScheduledTimer).cleared = true;
    },
    runNext() {
      const timer = timers.find((candidate) => !candidate.cleared);
      assert.ok(timer, "expected a pending timer");
      timer.cleared = true;
      timer.callback();
    },
  };
}

test("schedules its first rotation once when started", () => {
  const scheduler = createFakeScheduler();
  const controller = createAdRotationController({
    itemCount: 3,
    intervalMs: 4_000,
    startDelayMs: 750,
    scheduler,
    onIndexChange: () => {},
  });

  controller.start();
  controller.start();

  assert.equal(scheduler.timers.length, 1);
  assert.equal(scheduler.timers[0].delay, 750);
  assert.equal(scheduler.timers[0].cleared, false);
});

test("wraps from the final item back to the first item", () => {
  const scheduler = createFakeScheduler();
  const changes: number[] = [];
  const controller = createAdRotationController({
    itemCount: 3,
    intervalMs: 4_000,
    scheduler,
    onIndexChange: (index) => changes.push(index),
  });

  controller.start();
  scheduler.runNext();
  scheduler.runNext();
  scheduler.runNext();

  assert.deepEqual(changes, [1, 2, 0]);
});

test("pausing clears the pending rotation", () => {
  const scheduler = createFakeScheduler();
  const changes: number[] = [];
  const controller = createAdRotationController({
    itemCount: 3,
    intervalMs: 4_000,
    scheduler,
    onIndexChange: (index) => changes.push(index),
  });

  controller.start();
  controller.setPaused(true);

  assert.equal(scheduler.timers[0].cleared, true);
  assert.deepEqual(changes, []);
});

test("resuming schedules exactly one pending rotation", () => {
  const scheduler = createFakeScheduler();
  const controller = createAdRotationController({
    itemCount: 3,
    intervalMs: 4_000,
    scheduler,
    onIndexChange: () => {},
  });

  controller.start();
  controller.setPaused(true);
  controller.setPaused(false);
  controller.setPaused(false);

  assert.equal(scheduler.timers.length, 2);
  assert.equal(scheduler.timers.filter((timer) => !timer.cleared).length, 1);
  assert.equal(scheduler.timers[1].delay, 4_000);
});

test("disposing prevents a queued callback from changing the index", () => {
  const scheduler = createFakeScheduler();
  const changes: number[] = [];
  const controller = createAdRotationController({
    itemCount: 3,
    intervalMs: 4_000,
    scheduler,
    onIndexChange: (index) => changes.push(index),
  });

  controller.start();
  const queuedCallback = scheduler.timers[0].callback;
  controller.dispose();
  queuedCallback();

  assert.equal(scheduler.timers[0].cleared, true);
  assert.deepEqual(changes, []);
});
