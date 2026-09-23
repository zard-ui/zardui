import assert from 'node:assert/strict';
import { setTimeout as delay } from 'node:timers/promises';

import { createScheduler } from '../index.js';

/**
 * Waits for the condition instead of betting on a fixed delay.
 *
 * Scheduling runs on setTimeout: under load — the whole suite running in
 * parallel — the timer slips well past its nominal interval, and a fixed `delay`
 * turns the test into a coin flip. Here the deadline only says when to give up.
 */
async function waitUntil(condition: () => boolean, timeoutMs = 2000): Promise<void> {
  const deadline = performance.now() + timeoutMs;
  while (!condition() && performance.now() < deadline) await delay(5);
}

test('coalesces several requestRender calls into one frame', async () => {
  let renders = 0;
  const s = createScheduler({ fps: 60, onRender: () => renders++ });
  s.start();
  s.requestRender();
  s.requestRender();
  s.requestRender();
  await waitUntil(() => renders > 0);
  // and stays at 1: all three requests fitted into the same frame
  await delay(40);
  assert.equal(renders, 1, '3 pedidos → 1 render');
  s.stop();
});

test('renderSync desenha imediatamente', () => {
  let renders = 0;
  const s = createScheduler({ fps: 60, onRender: () => renders++ });
  s.renderSync();
  assert.equal(renders, 1);
  s.stop();
});

test('idle does not render', async () => {
  let renders = 0;
  const s = createScheduler({ fps: 60, onRender: () => renders++ });
  s.start();
  await delay(40);
  assert.equal(renders, 0, 'sem dirty → sem render');
  s.stop();
});

test('onFrame recebe dt e pode manter o loop vivo', async () => {
  let frames = 0;
  let renders = 0;
  const s = createScheduler({ fps: 120, onRender: () => renders++ });
  s.onFrame(() => {
    frames++;
    if (frames < 3) s.requestRender();
  });
  s.start();
  s.requestRender();
  await waitUntil(() => frames >= 3);
  assert.ok(frames >= 3, `onFrame chamado ${frames}x`);
  assert.ok(renders >= 1, `render chamado ${renders}x`);
  s.stop();
});
