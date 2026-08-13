import assert from "node:assert/strict";
import test from "node:test";
import * as THREE from "three";

import { portfolioWorks } from "./gallery-data";
import { createGalleryScene, getCameraFollowBlend } from "./gallery-scene";

test("portfolio records preserve the existing project categories", () => {
  assert.deepEqual(
    portfolioWorks.map((work) => work.category),
    ["Campaign design", "Product visual", "Product campaign", "Social campaign"],
  );
});

test("portfolio image alternatives describe each artwork's distinguishing content", () => {
  const alternativesById = Object.fromEntries(
    portfolioWorks.map((work) => [work.id, work.imageAlt.toLowerCase()]),
  );

  assert.match(alternativesById["coffee-campaign"], /dripping.*coffee cup|coffee cup.*dripping/);
  assert.match(alternativesById["coffee-campaign"], /floating coffee beans/);
  assert.doesNotMatch(alternativesById["coffee-campaign"], /packaging/);
  assert.match(alternativesById["gaming-product"], /red-and-black.*gaming controller/);
  assert.match(alternativesById["shampoo-product"], /purple.*shampoo bottle/);
  assert.match(alternativesById["shampoo-product"], /blackberries/);
  assert.match(alternativesById["lemonade-campaign"], /raspberry lemonade social poster/);
  assert.match(alternativesById["lemonade-campaign"], /the bets is here/);
  assert.match(alternativesById["lemonade-campaign"], /large: 30\.50 \/ small: 20\.50/);
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

test("createGalleryScene disposes constructed resources when initialization throws", () => {
  const originalDocument = Object.getOwnPropertyDescriptor(globalThis, "document");
  const originalGeometryDispose = THREE.BufferGeometry.prototype.dispose;
  const originalMaterialDispose = THREE.Material.prototype.dispose;
  const originalTextureDispose = THREE.Texture.prototype.dispose;
  let geometryDisposals = 0;
  let materialDisposals = 0;
  let textureDisposals = 0;
  let canvasCount = 0;

  THREE.BufferGeometry.prototype.dispose = function disposeGeometry() {
    geometryDisposals += 1;
    originalGeometryDispose.call(this);
  };
  THREE.Material.prototype.dispose = function disposeMaterial() {
    materialDisposals += 1;
    originalMaterialDispose.call(this);
  };
  THREE.Texture.prototype.dispose = function disposeTexture() {
    textureDisposals += 1;
    originalTextureDispose.call(this);
  };
  Object.defineProperty(globalThis, "document", {
    configurable: true,
    value: {
      createElement(tagName: string) {
        assert.equal(tagName, "canvas");
        canvasCount += 1;
        const context = {
          clearRect() {},
          fillText() {},
          measureText: (text: string) => ({ width: text.length * 10 }),
          fillStyle: "",
          font: "",
          textAlign: "center",
          textBaseline: "middle",
        };
        return { width: 0, height: 0, getContext: () => (canvasCount === 1 ? context : null) };
      },
    },
  });

  try {
    assert.throws(
      () =>
        createGalleryScene({
          width: 1280,
          height: 720,
          bounds: { minX: -3.4, maxX: 3.4, minY: -8.75, maxY: 6.75 },
          quality: { tier: "desktop", dpr: 1.5 },
        }),
      /Unable to create gallery text texture/,
    );
    assert.ok(geometryDisposals > 0, "constructed geometries should be disposed");
    assert.ok(materialDisposals > 0, "constructed materials should be disposed");
    assert.ok(textureDisposals > 0, "constructed canvas textures should be disposed");
  } finally {
    THREE.BufferGeometry.prototype.dispose = originalGeometryDispose;
    THREE.Material.prototype.dispose = originalMaterialDispose;
    THREE.Texture.prototype.dispose = originalTextureDispose;
    if (originalDocument) Object.defineProperty(globalThis, "document", originalDocument);
    else Reflect.deleteProperty(globalThis, "document");
  }
});
