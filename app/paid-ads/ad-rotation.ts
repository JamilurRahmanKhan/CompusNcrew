export interface RotationScheduler {
  setTimeout(callback: () => void, delay: number): ReturnType<typeof setTimeout>;
  clearTimeout(handle: ReturnType<typeof setTimeout>): void;
}

export interface AdRotationController {
  start(): void;
  setPaused(paused: boolean): void;
  dispose(): void;
}

export function createAdRotationController(options: {
  itemCount: number;
  intervalMs: number;
  startDelayMs?: number;
  scheduler?: RotationScheduler;
  onIndexChange(index: number): void;
}): AdRotationController {
  const scheduler = options.scheduler ?? globalThis;
  let index = 0;
  let timer: ReturnType<typeof setTimeout> | undefined;
  let started = false;
  let paused = false;
  let disposed = false;

  const clearPendingTimer = () => {
    if (timer !== undefined) {
      scheduler.clearTimeout(timer);
      timer = undefined;
    }
  };

  const schedule = (delay: number) => {
    clearPendingTimer();

    timer = scheduler.setTimeout(() => {
      timer = undefined;

      if (disposed || paused) {
        return;
      }

      index = (index + 1) % options.itemCount;
      options.onIndexChange(index);
      schedule(options.intervalMs);
    }, delay);
  };

  return {
    start() {
      if (started || disposed || options.itemCount <= 1) {
        return;
      }

      started = true;
      if (!paused) {
        schedule(options.startDelayMs ?? options.intervalMs);
      }
    },
    setPaused(nextPaused) {
      if (disposed || paused === nextPaused) {
        return;
      }

      paused = nextPaused;
      if (paused) {
        clearPendingTimer();
      } else if (started && options.itemCount > 1) {
        schedule(options.intervalMs);
      }
    },
    dispose() {
      if (disposed) {
        return;
      }

      disposed = true;
      clearPendingTimer();
    },
  };
}
