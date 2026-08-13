import assert from "node:assert/strict";
import test from "node:test";

import * as canvasModule from "./design-gallery-canvas";
import { GalleryInputController } from "./gallery-controls";
import { portfolioWorks, type GalleryArtwork } from "./gallery-data";

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
