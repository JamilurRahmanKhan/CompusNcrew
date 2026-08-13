import type { Vector2 } from "./gallery-controller";

type ActionHandler = () => void;

const MOVEMENT_KEYS = new Set([
  "arrowup",
  "arrowdown",
  "arrowleft",
  "arrowright",
  "w",
  "a",
  "s",
  "d",
]);

export class GalleryInputController {
  private readonly pressedKeys = new Set<string>();
  private readonly actionHandlers = new Set<ActionHandler>();
  private joystick: Vector2 = { x: 0, y: 0 };
  private enabled = true;
  private disposed = false;

  constructor(
    private readonly windowTarget: Window = window,
    private readonly documentTarget: Document = document,
  ) {
    this.windowTarget.addEventListener("keydown", this.handleKeyDown);
    this.windowTarget.addEventListener("keyup", this.handleKeyUp);
    this.windowTarget.addEventListener("blur", this.clearKeys);
    this.documentTarget.addEventListener("visibilitychange", this.clearKeys);
  }

  setJoystick(x: number, y: number): void {
    this.joystick = normalizeIfNeeded({
      x: Number.isFinite(x) ? x : 0,
      y: Number.isFinite(y) ? y : 0,
    });
  }

  getVector(): Vector2 {
    if (!this.enabled || this.disposed) return { x: 0, y: 0 };

    const keyboard = {
      x: Number(this.isPressed("arrowright", "d")) - Number(this.isPressed("arrowleft", "a")),
      y: Number(this.isPressed("arrowdown", "s")) - Number(this.isPressed("arrowup", "w")),
    };
    const normalizedKeyboard = normalizeIfNeeded(keyboard);

    return normalizeIfNeeded({
      x: normalizedKeyboard.x + this.joystick.x,
      y: normalizedKeyboard.y + this.joystick.y,
    });
  }

  subscribeAction(handler: ActionHandler): () => void {
    this.actionHandlers.add(handler);
    return () => {
      this.actionHandlers.delete(handler);
    };
  }

  setEnabled(enabled: boolean): void {
    if (this.disposed || this.enabled === enabled) return;
    this.enabled = enabled;
    if (!enabled) this.clearKeys();
  }

  dispose(): void {
    if (this.disposed) return;
    this.disposed = true;
    this.clearKeys();
    this.joystick = { x: 0, y: 0 };
    this.actionHandlers.clear();
    this.windowTarget.removeEventListener("keydown", this.handleKeyDown);
    this.windowTarget.removeEventListener("keyup", this.handleKeyUp);
    this.windowTarget.removeEventListener("blur", this.clearKeys);
    this.documentTarget.removeEventListener("visibilitychange", this.clearKeys);
  }

  private readonly handleKeyDown = (event: KeyboardEvent): void => {
    if (!this.enabled || this.disposed) return;
    const key = event.key.toLowerCase();

    if (MOVEMENT_KEYS.has(key)) {
      event.preventDefault();
      this.pressedKeys.add(key);
      return;
    }

    if (key === "enter") {
      event.preventDefault();
      if (!event.repeat) {
        for (const handler of this.actionHandlers) handler();
      }
    }
  };

  private readonly handleKeyUp = (event: KeyboardEvent): void => {
    if (!this.enabled || this.disposed) return;
    const key = event.key.toLowerCase();
    if (!MOVEMENT_KEYS.has(key)) return;
    event.preventDefault();
    this.pressedKeys.delete(key);
  };

  private readonly clearKeys = (): void => {
    this.pressedKeys.clear();
  };

  private isPressed(...keys: string[]): boolean {
    return keys.some((key) => this.pressedKeys.has(key));
  }
}

function normalizeIfNeeded(vector: Vector2): Vector2 {
  const length = Math.hypot(vector.x, vector.y);
  if (length <= 1) return vector;
  return { x: vector.x / length, y: vector.y / length };
}
