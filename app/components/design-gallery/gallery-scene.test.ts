import assert from "node:assert/strict";
import test from "node:test";

import { portfolioWorks } from "./gallery-data";
import { getCameraFollowBlend } from "./gallery-scene";

test("portfolio records preserve the existing project categories", () => {
  assert.deepEqual(
    portfolioWorks.map((work) => work.category),
    ["Campaign design", "Product visual", "Product campaign", "Social campaign"],
  );
});

test("camera follow converges equally across frame sizes", () => {
  const oneFrameBlend = getCameraFollowBlend(1 / 30, "desktop");
  const halfFrameBlend = getCameraFollowBlend(1 / 60, "desktop");
  const oneFrameRemainder = 1 - oneFrameBlend;
  const twoHalfFramesRemainder = (1 - halfFrameBlend) ** 2;

  assert.ok(Math.abs(oneFrameRemainder - twoHalfFramesRemainder) < 0.000001);
});

test("mobile camera follow converges faster than desktop", () => {
  const mobileBlend = getCameraFollowBlend(1 / 60, "mobile");
  const desktopBlend = getCameraFollowBlend(1 / 60, "desktop");

  assert.ok(mobileBlend > desktopBlend);
});
