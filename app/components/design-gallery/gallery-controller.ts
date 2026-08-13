export interface Vector2 {
  x: number;
  y: number;
}

export interface CharacterState {
  position: Vector2;
  velocity: Vector2;
  facingAngle: number;
  bobOffset: number;
  bobPhase: number;
}

export interface GalleryBounds {
  minX: number;
  maxX: number;
  minY: number;
  maxY: number;
}

export interface Artwork {
  id: string;
  position: Vector2;
  interactionRadius: number;
  wallSide?: "left" | "right";
}

export interface ArtworkViewingPose {
  facingAngle: number;
  cameraDirection: Vector2;
}

export interface QualityTier {
  tier: "mobile" | "balanced" | "desktop";
  dpr: number;
}

const MAX_SPEED = 4;
const ACCELERATION_RESPONSE = 12;
const DAMPING_RESPONSE = 8;
const BOB_FREQUENCY = 6;
const BOB_AMPLITUDE = 0.06;
export function stepCharacter(
  state: CharacterState,
  input: Vector2,
  delta: number,
  bounds: GalleryBounds,
  reducedMotion: boolean,
): CharacterState {
  const inputLength = Math.hypot(input.x, input.y);
  const isMoving = inputLength > 0;
  const inputStrength = Math.min(inputLength, 1);
  const targetVelocity = isMoving
    ? {
        x: (input.x / inputLength) * MAX_SPEED * inputStrength,
        y: (input.y / inputLength) * MAX_SPEED * inputStrength,
      }
    : { x: 0, y: 0 };
  const response = isMoving ? ACCELERATION_RESPONSE : DAMPING_RESPONSE;
  const blend = 1 - Math.exp(-response * delta);
  const velocity = {
    x: state.velocity.x + (targetVelocity.x - state.velocity.x) * blend,
    y: state.velocity.y + (targetVelocity.y - state.velocity.y) * blend,
  };
  const position = {
    x: clamp(state.position.x + velocity.x * delta, bounds.minX, bounds.maxX),
    y: clamp(state.position.y + velocity.y * delta, bounds.minY, bounds.maxY),
  };
  const speedStrength = Math.min(Math.hypot(velocity.x, velocity.y) / MAX_SPEED, 1);
  const isActuallyMoving = speedStrength > 0.035;
  const bobPhase = reducedMotion || !isActuallyMoving
    ? state.bobPhase
    : state.bobPhase + delta * BOB_FREQUENCY;

  return {
    position,
    velocity,
    facingAngle: isMoving ? Math.atan2(-input.x, -input.y) : state.facingAngle,
    bobPhase,
    bobOffset: reducedMotion || !isActuallyMoving
      ? 0
      : Math.sin(bobPhase) * BOB_AMPLITUDE * speedStrength,
  };
}

export function findNearbyArtwork(position: Vector2, artworks: readonly Artwork[]): Artwork | null {
  let nearestArtwork: Artwork | null = null;
  let nearestDistance = Number.POSITIVE_INFINITY;

  for (const artwork of artworks) {
    const distance = Math.hypot(artwork.position.x - position.x, artwork.position.y - position.y);
    if (distance <= artwork.interactionRadius && distance <= nearestDistance) {
      nearestArtwork = artwork;
      nearestDistance = distance;
    }
  }

  return nearestArtwork;
}

export function getArtworkViewingPose(artwork: Artwork): ArtworkViewingPose {
  const isLeftWall = artwork.wallSide === "left" || (artwork.wallSide === undefined && artwork.position.x < 0);
  return isLeftWall
    ? { facingAngle: Math.PI / 2, cameraDirection: { x: -1, y: 0 } }
    : { facingAngle: -Math.PI / 2, cameraDirection: { x: 1, y: 0 } };
}

export function getQualityTier(width: number, dpr: number): QualityTier {
  if (width < 720) return { tier: "mobile", dpr: Math.min(dpr, 1) };
  if (width < 1100) return { tier: "balanced", dpr: Math.min(dpr, 1.25) };
  return { tier: "desktop", dpr: Math.min(dpr, 1.5) };
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}
