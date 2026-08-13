import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import path from "node:path";
import test from "node:test";

import * as canvasModule from "./design-gallery-canvas";
import { GalleryInputController } from "./gallery-controls";
import { portfolioWorks, type GalleryArtwork } from "./gallery-data";

test("mobile presentation suppresses the duplicate floating proximity label", () => {
  const stylesheet = readFileSync(
    path.join(process.cwd(), "app/components/design-gallery/design-gallery.module.css"),
    "utf8",
  );
  const mobileRules = stylesheet.slice(stylesheet.indexOf("@media (pointer: coarse), (max-width: 48rem)"));
  assert.match(mobileRules, /\.proximityLabel\s*\{[^}]*display:\s*none;/s);
});

function enterEvent(): Event {
  const event = new Event("keydown", { cancelable: true });
  Object.defineProperties(event, {
    key: { value: "Enter" },
    repeat: { value: false },
  });
  return event;
}

test("the canvas action bridge delivers one Enter to the current artwork", () => {
  const createActionHandler = (
    canvasModule as unknown as {
      createGalleryActionHandler?: (
        getNearbyArtwork: () => GalleryArtwork | null,
        onAction: (artwork: GalleryArtwork) => void,
      ) => () => boolean;
    }
  ).createGalleryActionHandler;
  assert.equal(typeof createActionHandler, "function");
  if (!createActionHandler) return;

  const windowTarget = new EventTarget();
  const documentTarget = new EventTarget();
  const controller = new GalleryInputController(
    windowTarget as unknown as Window,
    documentTarget as unknown as Document,
  );
  let nearbyArtwork: GalleryArtwork | null = portfolioWorks[0];
  const deliveredArtworkIds: string[] = [];
  controller.subscribeAction(
    createActionHandler(
      () => nearbyArtwork,
      (artwork) => deliveredArtworkIds.push(artwork.id),
    ),
  );

  const handledEnter = enterEvent();
  windowTarget.dispatchEvent(handledEnter);
  nearbyArtwork = null;
  const unhandledEnter = enterEvent();
  windowTarget.dispatchEvent(unhandledEnter);

  assert.deepEqual(deliveredArtworkIds, ["coffee-campaign"]);
  assert.equal(handledEnter.defaultPrevented, true);
  assert.equal(unhandledEnter.defaultPrevented, false);
  controller.dispose();
});

test("gallery readiness delays onReady and rejection uses the fatal shutdown", async () => {
  const createRuntimeBoundary = (
    canvasModule as unknown as {
      createGalleryRuntimeBoundary?: (
        cleanup: () => void,
        onFatalError: (error: Error) => void,
      ) => {
        run: (operation: () => void) => void;
        fail: (error: unknown) => void;
        shutdown: () => void;
      };
    }
  ).createGalleryRuntimeBoundary;
  const observeGalleryReadiness = (
    canvasModule as unknown as {
      observeGalleryReadiness?: (
        ready: Promise<void>,
        runtime: { run: (operation: () => void) => void; fail: (error: unknown) => void },
        renderReadyFrame: () => void,
        onReady: () => void,
      ) => void;
    }
  ).observeGalleryReadiness;
  assert.equal(typeof createRuntimeBoundary, "function");
  assert.equal(typeof observeGalleryReadiness, "function");
  if (!createRuntimeBoundary || !observeGalleryReadiness) return;

  let resolveReady!: () => void;
  const ready = new Promise<void>((resolve) => {
    resolveReady = resolve;
  });
  let readyCalls = 0;
  const readyOrder: string[] = [];
  const runtime = createRuntimeBoundary(() => {}, () => {});
  observeGalleryReadiness(ready, runtime, () => {
    readyOrder.push("render");
  }, () => {
    readyOrder.push("ready");
    readyCalls += 1;
  });

  await Promise.resolve();
  assert.equal(readyCalls, 0);
  resolveReady();
  await ready;
  await Promise.resolve();
  assert.equal(readyCalls, 1);
  assert.deepEqual(readyOrder, ["render", "ready"]);

  let cleanupCalls = 0;
  const fatalErrors: Error[] = [];
  const rejectedRuntime = createRuntimeBoundary(
    () => {
      cleanupCalls += 1;
    },
    (error) => fatalErrors.push(error),
  );
  const failedReady = Promise.reject(new Error("artwork texture failed"));
  observeGalleryReadiness(failedReady, rejectedRuntime, () => {
    readyOrder.push("rejected-render");
  }, () => {
    readyCalls += 1;
  });
  await failedReady.catch(() => {});
  await Promise.resolve();

  assert.equal(cleanupCalls, 1);
  assert.deepEqual(fatalErrors.map((error) => error.message), ["artwork texture failed"]);
  assert.equal(readyCalls, 1);
  assert.deepEqual(readyOrder, ["render", "ready"]);
});

test("a post-ready runtime failure shuts down and reports the fatal error once", () => {
  const createRuntimeBoundary = (
    canvasModule as unknown as {
      createGalleryRuntimeBoundary?: (
        cleanup: () => void,
        onFatalError: (error: Error) => void,
      ) => {
        run: (operation: () => void) => void;
        fail: (error: unknown) => void;
        shutdown: () => void;
      };
    }
  ).createGalleryRuntimeBoundary;
  assert.equal(typeof createRuntimeBoundary, "function");
  if (!createRuntimeBoundary) return;

  let cleanupCalls = 0;
  const fatalErrors: Error[] = [];
  const runtime = createRuntimeBoundary(
    () => {
      cleanupCalls += 1;
    },
    (error) => fatalErrors.push(error),
  );
  const renderFailure = new Error("render failed after ready");

  runtime.run(() => {
    throw renderFailure;
  });
  runtime.run(() => {
    throw new Error("resize failed after shutdown");
  });
  runtime.fail(new Error("WebGL context lost after shutdown"));

  assert.equal(cleanupCalls, 1);
  assert.deepEqual(fatalErrors, [renderFailure]);
});

test("even an undefined runtime failure reports a fatal error once", () => {
  const createRuntimeBoundary = (
    canvasModule as unknown as {
      createGalleryRuntimeBoundary?: (
        cleanup: () => void,
        onFatalError: (error: Error) => void,
      ) => { fail: (error: unknown) => void };
    }
  ).createGalleryRuntimeBoundary;
  assert.equal(typeof createRuntimeBoundary, "function");
  if (!createRuntimeBoundary) return;

  let cleanupCalls = 0;
  const fatalErrors: Error[] = [];
  const runtime = createRuntimeBoundary(
    () => {
      cleanupCalls += 1;
    },
    (error) => fatalErrors.push(error),
  );

  runtime.fail(undefined);
  runtime.fail(new Error("later failure"));

  assert.equal(cleanupCalls, 1);
  assert.equal(fatalErrors.length, 1);
  assert.match(fatalErrors[0]?.message ?? "", /unable to initialize the 3d gallery/i);
});
