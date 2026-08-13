import assert from "node:assert/strict";
import test from "node:test";

import {
  findNearbyArtwork,
  getArtworkViewingPose,
  getQualityTier,
  stepCharacter,
  type CharacterState,
  type GalleryBounds,
} from "./gallery-controller";
import { GalleryInputController } from "./gallery-controls";

const bounds: GalleryBounds = { minX: -2, maxX: 2, minY: -1, maxY: 1 };
const restingCharacter: CharacterState = {
  position: { x: 0, y: 0 },
  velocity: { x: 0, y: 0 },
  facingAngle: 0,
  bobOffset: 0,
  bobPhase: 0,
};

test("stepCharacter accelerates at the same rate across frame sizes", () => {
  const oneFrame = stepCharacter(restingCharacter, { x: 1, y: 0 }, 1 / 30, bounds, false);
  const halfFrame = stepCharacter(
    stepCharacter(restingCharacter, { x: 1, y: 0 }, 1 / 60, bounds, false),
    { x: 1, y: 0 },
    1 / 60,
    bounds,
    false,
  );

  assert.ok(oneFrame.velocity.x > 0, "right input should accelerate the character");
  assert.ok(Math.abs(oneFrame.velocity.x - halfFrame.velocity.x) < 0.0001);
});

test("stepCharacter preserves partial analog joystick strength", () => {
  const partialInput = new GalleryInputController(new EventTarget() as unknown as Window, new EventTarget() as unknown as Document);
  const fullInput = new GalleryInputController(new EventTarget() as unknown as Window, new EventTarget() as unknown as Document);
  partialInput.setJoystick(0.25, 0);
  fullInput.setJoystick(1, 0);
  const partial = stepCharacter(restingCharacter, partialInput.getVector(), 1 / 60, bounds, false);
  const full = stepCharacter(restingCharacter, fullInput.getVector(), 1 / 60, bounds, false);

  assert.ok(full.velocity.x > 0);
  assert.ok(Math.abs(partial.velocity.x / full.velocity.x - 0.25) < 0.000001);
  partialInput.dispose();
  fullInput.dispose();
});

test("stepCharacter clamps overdriven input to full speed", () => {
  const full = stepCharacter(restingCharacter, { x: 1, y: 0 }, 1 / 60, bounds, false);
  const overdriven = stepCharacter(restingCharacter, { x: 4, y: 0 }, 1 / 60, bounds, false);

  assert.equal(overdriven.velocity.x, full.velocity.x);
});

test("stepCharacter damps velocity when no movement input is held", () => {
  const movingCharacter = { ...restingCharacter, velocity: { x: 3, y: 0 } };
  const result = stepCharacter(movingCharacter, { x: 0, y: 0 }, 1 / 30, bounds, false);

  assert.ok(result.velocity.x > 0);
  assert.ok(result.velocity.x < 3);
});

test("stepCharacter clamps the character inside gallery bounds", () => {
  const atEdge = { ...restingCharacter, position: { x: 1.95, y: 0 } };
  const result = stepCharacter(atEdge, { x: 1, y: 0 }, 1, bounds, false);

  assert.equal(result.position.x, 2);
});

test("stepCharacter faces forward, backward, and diagonal movement", () => {
  const forward = stepCharacter(restingCharacter, { x: 0, y: -1 }, 1 / 60, bounds, false);
  const backward = stepCharacter(restingCharacter, { x: 0, y: 1 }, 1 / 60, bounds, false);
  const diagonal = stepCharacter(restingCharacter, { x: 1, y: -1 }, 1 / 60, bounds, false);

  assert.ok(Math.abs(forward.facingAngle) < 0.000001);
  assert.ok(Math.abs(Math.abs(backward.facingAngle) - Math.PI) < 0.000001);
  assert.ok(Math.abs(diagonal.facingAngle + Math.PI / 4) < 0.000001);
});

test("stepCharacter removes character bobbing when reduced motion is enabled", () => {
  const result = stepCharacter(restingCharacter, { x: 1, y: 0 }, 1 / 4, bounds, true);

  assert.equal(result.bobOffset, 0);
});

test("findNearbyArtwork returns the nearest artwork inside interaction range", () => {
  const artwork = findNearbyArtwork(
    { x: 0, y: 0 },
    [
      { id: "far", position: { x: 1.5, y: 0 }, interactionRadius: 2 },
      { id: "nearest", position: { x: 0.5, y: 0 }, interactionRadius: 2 },
      { id: "outside", position: { x: 2.1, y: 0 }, interactionRadius: 2 },
    ],
  );

  assert.equal(artwork?.id, "nearest");
});

test("findNearbyArtwork honors each artwork interaction radius", () => {
  const artwork = findNearbyArtwork(
    { x: 0, y: 0 },
    [
      { id: "near-but-outside", position: { x: 0.6, y: 0 }, interactionRadius: 0.5 },
      { id: "farther-but-inside", position: { x: 1.5, y: 0 }, interactionRadius: 2 },
    ],
  );

  assert.equal(artwork?.id, "farther-but-inside");
});

test("findNearbyArtwork returns null when every artwork is out of range", () => {
  const artwork = findNearbyArtwork(
    { x: 0, y: 0 },
    [{ id: "outside", position: { x: 2.01, y: 0 }, interactionRadius: 2 }],
  );

  assert.equal(artwork, null);
});

test("stepCharacter keeps an idle character planted on the floor", () => {
  const idleMidCycle = {
    ...restingCharacter,
    bobPhase: Math.PI / 2,
    bobOffset: 0.06,
  };
  const result = stepCharacter(idleMidCycle, { x: 0, y: 0 }, 1 / 30, bounds, false);

  assert.equal(result.bobOffset, 0);
  assert.equal(result.bobPhase, idleMidCycle.bobPhase);
});

test("stepCharacter scales walking bob by actual movement speed", () => {
  const slow = stepCharacter(
    { ...restingCharacter, velocity: { x: 0.25, y: 0 }, bobPhase: Math.PI / 2 },
    { x: 0, y: 0 },
    0,
    bounds,
    false,
  );
  const fast = stepCharacter(
    { ...restingCharacter, velocity: { x: 3.5, y: 0 }, bobPhase: Math.PI / 2 },
    { x: 0, y: 0 },
    0,
    bounds,
    false,
  );

  assert.ok(Math.abs(slow.bobOffset) < Math.abs(fast.bobOffset));
});

test("artwork viewing pose places the character on the marker facing the wall", () => {
  const leftPose = getArtworkViewingPose({
    id: "left",
    position: { x: -3.65, y: 2 },
    interactionRadius: 0.8,
    wallSide: "left",
  });
  const rightPose = getArtworkViewingPose({
    id: "right",
    position: { x: 3.65, y: -2 },
    interactionRadius: 0.8,
    wallSide: "right",
  });

  assert.equal(leftPose.facingAngle, Math.PI / 2);
  assert.equal(rightPose.facingAngle, -Math.PI / 2);
  assert.deepEqual(leftPose.cameraDirection, { x: -1, y: 0 });
  assert.deepEqual(rightPose.cameraDirection, { x: 1, y: 0 });
});

test("getQualityTier applies mobile and desktop DPR caps", () => {
  assert.deepEqual(getQualityTier(719, 3), { tier: "mobile", dpr: 1 });
  assert.deepEqual(getQualityTier(720, 3), { tier: "balanced", dpr: 1.25 });
  assert.deepEqual(getQualityTier(1100, 3), { tier: "desktop", dpr: 1.5 });
});
