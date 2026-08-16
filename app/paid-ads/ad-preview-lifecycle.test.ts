import assert from "node:assert/strict";
import test from "node:test";

import type { MotionPreference } from "./paid-ads-presentation";

interface MediaQueryChangeEventLike {
  matches: boolean;
}

interface MediaQueryLike {
  readonly matches: boolean;
  addEventListener(type: "change", listener: (event: MediaQueryChangeEventLike) => void): void;
  removeEventListener(type: "change", listener: (event: MediaQueryChangeEventLike) => void): void;
}

interface VisibilityLike {
  readonly hidden: boolean;
  addEventListener(type: "visibilitychange", listener: () => void): void;
  removeEventListener(type: "visibilitychange", listener: () => void): void;
}

interface SchedulerLike {
  setTimeout(callback: () => void, delay: number): ReturnType<typeof setTimeout>;
  clearTimeout(handle: ReturnType<typeof setTimeout>): void;
}

interface LifecycleOptions {
  matchMedia(query: string): MediaQueryLike;
  visibility: VisibilityLike;
  scheduler: SchedulerLike;
  googleItemCount: number;
  metaItemCount: number;
  onMotionPreferenceChange(preference: MotionPreference): void;
  onGoogleIndexChange(index: number): void;
  onMetaIndexChange(index: number): void;
}

type CreateAdPreviewLifecycle = (options: LifecycleOptions) => { dispose(): void };

const lifecycleModule = await import("./ad-preview-lifecycle").catch(() => null);

function requireCreateLifecycle(): CreateAdPreviewLifecycle {
  assert.ok(lifecycleModule, "ad-preview-lifecycle must execute browser lifecycle decisions");
  assert.equal(typeof lifecycleModule.createAdPreviewLifecycle, "function");
  return lifecycleModule.createAdPreviewLifecycle as CreateAdPreviewLifecycle;
}

interface FakeTimer {
  callback: () => void;
  delay: number;
  cleared: boolean;
}

function createFakeScheduler(): SchedulerLike & {
  readonly timers: FakeTimer[];
  pendingDelays(): number[];
  runNext(delay: number): void;
} {
  const timers: FakeTimer[] = [];

  return {
    timers,
    setTimeout(callback, delay) {
      const timer = { callback, delay, cleared: false };
      timers.push(timer);
      return timer as unknown as ReturnType<typeof setTimeout>;
    },
    clearTimeout(handle) {
      (handle as unknown as FakeTimer).cleared = true;
    },
    pendingDelays() {
      return timers
        .filter((timer) => !timer.cleared)
        .map((timer) => timer.delay)
        .sort((left, right) => left - right);
    },
    runNext(delay) {
      const timer = timers.find((candidate) => !candidate.cleared && candidate.delay === delay);
      assert.ok(timer, `expected a pending ${delay}ms timer`);
      timer.cleared = true;
      timer.callback();
    },
  };
}

function createFakeMediaQuery(initialMatches: boolean): MediaQueryLike & {
  listenerCount(): number;
  setMatches(matches: boolean): void;
} {
  let matches = initialMatches;
  const listeners = new Set<(event: MediaQueryChangeEventLike) => void>();

  return {
    get matches() {
      return matches;
    },
    addEventListener(type, listener) {
      assert.equal(type, "change");
      listeners.add(listener);
    },
    removeEventListener(type, listener) {
      assert.equal(type, "change");
      listeners.delete(listener);
    },
    listenerCount() {
      return listeners.size;
    },
    setMatches(nextMatches) {
      matches = nextMatches;
      for (const listener of listeners) {
        listener({ matches });
      }
    },
  };
}

function createFakeVisibility(initialHidden = false): VisibilityLike & {
  listenerCount(): number;
  setHidden(hidden: boolean): void;
} {
  let hidden = initialHidden;
  const listeners = new Set<() => void>();

  return {
    get hidden() {
      return hidden;
    },
    addEventListener(type, listener) {
      assert.equal(type, "visibilitychange");
      listeners.add(listener);
    },
    removeEventListener(type, listener) {
      assert.equal(type, "visibilitychange");
      listeners.delete(listener);
    },
    listenerCount() {
      return listeners.size;
    },
    setHidden(nextHidden) {
      hidden = nextHidden;
      for (const listener of listeners) {
        listener();
      }
    },
  };
}

function setup(initialReducedMotion: boolean, initialHidden = false) {
  const createLifecycle = requireCreateLifecycle();
  const scheduler = createFakeScheduler();
  const mediaQuery = createFakeMediaQuery(initialReducedMotion);
  const visibility = createFakeVisibility(initialHidden);
  const matchMediaQueries: string[] = [];
  const preferences: MotionPreference[] = [];
  const googleIndices: number[] = [];
  const metaIndices: number[] = [];
  const lifecycle = createLifecycle({
    matchMedia(query) {
      matchMediaQueries.push(query);
      return mediaQuery;
    },
    visibility,
    scheduler,
    googleItemCount: 3,
    metaItemCount: 3,
    onMotionPreferenceChange: (preference) => preferences.push(preference),
    onGoogleIndexChange: (index) => googleIndices.push(index),
    onMetaIndexChange: (index) => metaIndices.push(index),
  });

  return {
    lifecycle,
    scheduler,
    mediaQuery,
    visibility,
    matchMediaQueries,
    preferences,
    googleIndices,
    metaIndices,
  };
}

test("initial reduced motion exposes slide one without rotation or visibility lifecycle", () => {
  const context = setup(true);

  assert.deepEqual(context.matchMediaQueries, ["(prefers-reduced-motion: reduce)"]);
  assert.deepEqual(context.preferences, ["reduce"]);
  assert.deepEqual(context.googleIndices, [0]);
  assert.deepEqual(context.metaIndices, [0]);
  assert.deepEqual(context.scheduler.pendingDelays(), []);
  assert.equal(context.scheduler.timers.length, 0);
  assert.equal(context.visibility.listenerCount(), 0);
  assert.equal(context.mediaQuery.listenerCount(), 1);

  context.lifecycle.dispose();
  assert.equal(context.mediaQuery.listenerCount(), 0);
});

test("normal motion rotates independently with the exact 1900ms Meta stagger", () => {
  const context = setup(false);

  assert.deepEqual(context.preferences, ["no-preference"]);
  assert.deepEqual(context.scheduler.pendingDelays(), [1_900, 3_800]);
  assert.equal(context.visibility.listenerCount(), 1);

  context.scheduler.runNext(1_900);
  assert.deepEqual(context.googleIndices, [0]);
  assert.deepEqual(context.metaIndices, [0, 1]);
  assert.deepEqual(context.scheduler.pendingDelays(), [3_800, 3_800]);

  context.scheduler.runNext(3_800);
  assert.deepEqual(context.googleIndices, [0, 1]);
  assert.deepEqual(context.metaIndices, [0, 1]);
});

test("visibility pauses both decks and restores the Meta offset without an immediate jump", () => {
  const context = setup(false);

  context.visibility.setHidden(true);
  assert.deepEqual(context.scheduler.pendingDelays(), []);

  context.visibility.setHidden(false);
  assert.deepEqual(context.scheduler.pendingDelays(), [1_900, 3_800]);

  context.scheduler.runNext(1_900);
  assert.deepEqual(context.googleIndices, [0]);
  assert.deepEqual(context.metaIndices, [0]);
  assert.deepEqual(context.scheduler.pendingDelays(), [3_800, 3_800]);
});

test("a live switch to reduced motion tears down timers and visibility handling", () => {
  const context = setup(false);

  context.mediaQuery.setMatches(true);

  assert.deepEqual(context.preferences, ["no-preference", "reduce"]);
  assert.deepEqual(context.googleIndices, [0, 0]);
  assert.deepEqual(context.metaIndices, [0, 0]);
  assert.deepEqual(context.scheduler.pendingDelays(), []);
  assert.equal(context.visibility.listenerCount(), 0);

  context.visibility.setHidden(true);
  context.visibility.setHidden(false);
  assert.deepEqual(context.scheduler.pendingDelays(), []);

  context.mediaQuery.setMatches(false);
  assert.deepEqual(context.preferences, ["no-preference", "reduce", "no-preference"]);
  assert.deepEqual(context.scheduler.pendingDelays(), [1_900, 3_800]);
  assert.equal(context.visibility.listenerCount(), 1);
});

test("dispose removes every listener and prevents future scheduling", () => {
  const context = setup(false);

  context.lifecycle.dispose();
  assert.deepEqual(context.scheduler.pendingDelays(), []);
  assert.equal(context.visibility.listenerCount(), 0);
  assert.equal(context.mediaQuery.listenerCount(), 0);

  context.mediaQuery.setMatches(true);
  context.visibility.setHidden(true);
  context.visibility.setHidden(false);
  assert.deepEqual(context.scheduler.pendingDelays(), []);
});
