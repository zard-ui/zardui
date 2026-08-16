/**
 * scheduler — game loop que separa "algo mudou" de "desenhe agora" (ADR-0006).
 * Coalesce pedidos, limita FPS, dorme quando ocioso, permite render síncrono.
 * (Implementação real.)
 */

import { performance } from 'node:perf_hooks';

import type { Disposable } from '../events/index.js';

export interface SchedulerOptions {
  readonly fps?: number | 'uncapped';
  readonly onRender: () => void;
}

export interface Scheduler {
  requestRender(reason?: string): void;
  renderSync(): void;
  start(): void;
  stop(): void;
  setFps(fps: number | 'uncapped'): void;
  onFrame(cb: (dtMs: number) => void): Disposable;
  readonly running: boolean;
  readonly dirty: boolean;
}

export function createScheduler(options: SchedulerOptions): Scheduler {
  const onFrameCbs = new Set<(dt: number) => void>();
  let interval = options.fps === 'uncapped' || options.fps === undefined ? 1000 / 60 : 1000 / options.fps;
  if (options.fps === 'uncapped') interval = 0;

  let running = false;
  let dirty = false;
  let timer: ReturnType<typeof setTimeout> | undefined;
  let last = performance.now();

  const scheduleTick = (): void => {
    if (!running || timer !== undefined) return;
    timer = setTimeout(tick, interval);
  };

  function tick(): void {
    timer = undefined;
    const now = performance.now();
    const dt = now - last;
    last = now;

    // hook de animação: pode chamar requestRender() para se manter vivo
    for (const cb of [...onFrameCbs]) cb(dt);

    if (dirty) {
      dirty = false;
      options.onRender();
    }
    // se algo pediu render (animação/input) durante o tick, continua; senão dorme
    if (dirty) scheduleTick();
  }

  return {
    requestRender() {
      dirty = true;
      scheduleTick();
    },
    renderSync() {
      dirty = false;
      last = performance.now();
      options.onRender();
    },
    start() {
      if (running) return;
      running = true;
      last = performance.now();
      if (dirty) scheduleTick();
    },
    stop() {
      running = false;
      if (timer !== undefined) {
        clearTimeout(timer);
        timer = undefined;
      }
    },
    setFps(fps) {
      interval = fps === 'uncapped' ? 0 : 1000 / fps;
    },
    onFrame(cb) {
      onFrameCbs.add(cb);
      return { dispose: () => onFrameCbs.delete(cb) };
    },
    get running() {
      return running;
    },
    get dirty() {
      return dirty;
    },
  };
}
