import assert from "node:assert/strict";
import test from "node:test";

const presentationModule = await import("./paid-ads-presentation").catch(() => null);

function requirePresentationModule() {
  assert.ok(
    presentationModule,
    "paid-ads-presentation must execute the server/hydration render decisions",
  );
  return presentationModule;
}

test("keeps unresolved and reduced preview renders on the first creative", () => {
  const presentation = requirePresentationModule();

  assert.deepEqual(
    presentation.getActivePreviewIndices({
      motionPreference: "unresolved",
      googleIndex: 2,
      metaIndex: 1,
    }),
    { google: 0, meta: 0 },
  );
  assert.deepEqual(
    presentation.getActivePreviewIndices({
      motionPreference: "reduce",
      googleIndex: 1,
      metaIndex: 2,
    }),
    { google: 0, meta: 0 },
  );
});

test("normal motion renders the independently controlled preview indices", () => {
  const presentation = requirePresentationModule();

  assert.deepEqual(
    presentation.getActivePreviewIndices({
      motionPreference: "no-preference",
      googleIndex: 2,
      metaIndex: 1,
    }),
    { google: 2, meta: 1 },
  );
});

test("a failed creative is replaced by an in-frame branded placeholder", () => {
  const presentation = requirePresentationModule();

  assert.deepEqual(
    presentation.getPreviewArtworkPresentation({
      active: true,
      imageFailed: true,
      imageAlt: "Demonstration Google Ads search campaign preview",
    }),
    {
      showImage: false,
      showFallback: true,
      renderedImageAlt: "",
      fallbackLabel: "Demonstration Google Ads search campaign preview unavailable",
    },
  );
});

test("the decorative engine uses its poster before motion resolves, for reduced motion, and on failure", () => {
  const presentation = requirePresentationModule();

  for (const input of [
    { motionPreference: "unresolved" as const, videoFailed: false },
    { motionPreference: "reduce" as const, videoFailed: false },
    { motionPreference: "no-preference" as const, videoFailed: true },
  ]) {
    assert.deepEqual(presentation.getEngineMediaPresentation(input), {
      showPoster: true,
      decorative: true,
    });
  }

  assert.deepEqual(
    presentation.getEngineMediaPresentation({
      motionPreference: "no-preference",
      videoFailed: false,
    }),
    { showPoster: false, decorative: true },
  );
});
