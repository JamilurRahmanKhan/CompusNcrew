import assert from "node:assert/strict";
import test from "node:test";
import * as THREE from "three";

import { stepCharacter, type CharacterState } from "./gallery-controller";
import { portfolioWorks } from "./gallery-data";
import {
  createGalleryScene,
  getCameraFollowBlend,
  type GallerySceneHandle,
} from "./gallery-scene";

const gallerySceneOptions = {
  width: 1280,
  height: 720,
  bounds: { minX: -3.4, maxX: 3.4, minY: -8.75, maxY: 6.75 },
  quality: { tier: "desktop", dpr: 1.5 },
} as const;

interface PendingTextureLoad {
  url: string;
  texture: THREE.Texture;
  onLoad?: (texture: THREE.Texture) => void;
  onError?: (error: unknown) => void;
}

function installSuccessfulSceneEnvironment(options: { throwOnUrl?: string } = {}) {
  const originalDocument = Object.getOwnPropertyDescriptor(globalThis, "document");
  const loaderPrototype = THREE.TextureLoader.prototype as unknown as {
    load: (
      url: string,
      onLoad?: (texture: THREE.Texture) => void,
      onProgress?: (event: ProgressEvent<EventTarget>) => void,
      onError?: (error: unknown) => void,
    ) => THREE.Texture;
  };
  const originalLoad = loaderPrototype.load;
  const requests: PendingTextureLoad[] = [];
  const context = {
    clearRect() {},
    fillText() {},
    measureText: (text: string) => ({ width: text.length * 10 }),
    fillStyle: "",
    font: "",
    textAlign: "center",
    textBaseline: "middle",
  };

  Object.defineProperty(globalThis, "document", {
    configurable: true,
    value: {
      createElement(tagName: string) {
        assert.equal(tagName, "canvas");
        return { width: 0, height: 0, getContext: () => context };
      },
    },
  });
  loaderPrototype.load = (url, onLoad, _onProgress, onError) => {
    if (url === options.throwOnUrl) throw new Error("sync loader failure");
    const texture = new THREE.Texture();
    requests.push({ url, texture, onLoad, onError });
    return texture;
  };

  return {
    requests,
    restore() {
      loaderPrototype.load = originalLoad;
      if (originalDocument) Object.defineProperty(globalThis, "document", originalDocument);
      else Reflect.deleteProperty(globalThis, "document");
    },
  };
}

function getSceneReadyPromise(handle: GallerySceneHandle): Promise<void> {
  const ready = (handle as GallerySceneHandle & { ready?: Promise<void> }).ready;
  assert.ok(ready && typeof ready.then === "function", "scene should expose artwork readiness");
  return ready;
}

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

test("gallery scene readiness waits for every artwork texture", async () => {
  const environment = installSuccessfulSceneEnvironment();
  let handle: GallerySceneHandle | null = null;

  try {
    handle = createGalleryScene(gallerySceneOptions);
    const ready = getSceneReadyPromise(handle);
    let settled = false;
    void ready.then(() => {
      settled = true;
    });

    assert.equal(environment.requests.length, portfolioWorks.length);
    await Promise.resolve();
    assert.equal(settled, false);

    for (const request of environment.requests.slice(0, -1)) {
      request.onLoad?.(request.texture);
    }
    await Promise.resolve();
    assert.equal(settled, false, "the final pending artwork should keep the scene loading");

    const finalRequest = environment.requests.at(-1);
    assert.ok(finalRequest);
    finalRequest.onLoad?.(finalRequest.texture);
    await ready;
    assert.equal(settled, true);
  } finally {
    handle?.dispose();
    environment.restore();
  }
});

test("gallery scene readiness rejects when an artwork texture fails", async () => {
  const environment = installSuccessfulSceneEnvironment();
  let handle: GallerySceneHandle | null = null;

  try {
    handle = createGalleryScene(gallerySceneOptions);
    const ready = getSceneReadyPromise(handle);
    const rejection = assert.rejects(ready, /coffee-campaign.*texture/i);

    const failedRequest = environment.requests[0];
    assert.ok(failedRequest);
    failedRequest.onError?.(new Error("decode failed"));

    await rejection;
  } finally {
    handle?.dispose();
    environment.restore();
  }
});

test("gallery scene readiness contains synchronous artwork loader failures", async () => {
  const failedArtwork = portfolioWorks[0];
  assert.ok(failedArtwork);
  const environment = installSuccessfulSceneEnvironment({ throwOnUrl: failedArtwork.imageSrc });
  const unhandledRejections: unknown[] = [];
  const handleUnhandledRejection = (reason: unknown) => {
    unhandledRejections.push(reason);
  };
  process.on("unhandledRejection", handleUnhandledRejection);
  let handle: GallerySceneHandle | null = null;

  try {
    handle = createGalleryScene(gallerySceneOptions);
    const ready = getSceneReadyPromise(handle);
    let rejectionCount = 0;
    void ready.catch(() => {
      rejectionCount += 1;
    });

    await assert.rejects(
      ready,
      (error: unknown) => error instanceof Error
        && /coffee-campaign.*texture/i.test(error.message)
        && error.cause instanceof Error
        && error.cause.message === "sync loader failure",
    );
    await new Promise<void>((resolve) => setImmediate(resolve));

    assert.equal(rejectionCount, 1);
    assert.deepEqual(unhandledRejections, []);
  } finally {
    process.removeListener("unhandledRejection", handleUnhandledRejection);
    handle?.dispose();
    environment.restore();
  }
});

test("the character rig turns its world-forward axis toward controller movement", () => {
  const environment = installSuccessfulSceneEnvironment();
  let handle: GallerySceneHandle | null = null;

  try {
    handle = createGalleryScene(gallerySceneOptions);
    const initialState: CharacterState = {
      position: { x: 0, y: 0 },
      velocity: { x: 0, y: 0 },
      facingAngle: 0,
      bobOffset: 0,
      bobPhase: 0,
    };
    for (const input of [
      { x: 0, y: -1 },
      { x: 1, y: 0 },
      { x: 1, y: -1 },
      { x: -1, y: 0 },
    ]) {
      const movedState = stepCharacter(
        initialState,
        input,
        1 / 60,
        gallerySceneOptions.bounds,
        true,
      );
      handle.updateCharacter(movedState, 0, true);
      const worldQuaternion = handle.character.getWorldQuaternion(new THREE.Quaternion());
      const worldForward = new THREE.Vector3(0, 0, -1)
        .applyQuaternion(worldQuaternion)
        .normalize();
      const expectedForward = new THREE.Vector3(input.x, 0, input.y).normalize();

      assert.ok(
        worldForward.distanceTo(expectedForward) < 0.000001,
        `input ${JSON.stringify(input)} should face ${expectedForward.toArray()}, got ${worldForward.toArray()}`,
      );
    }
  } finally {
    handle?.dispose();
    environment.restore();
  }
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
          ...gallerySceneOptions,
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
