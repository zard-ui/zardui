import assert from 'node:assert/strict';
import { setTimeout as delay } from 'node:timers/promises';

import { createScheduler } from '../index.js';

test('coalesce múltiplos requestRender em um só frame', async () => {
  let renders = 0;
  const s = createScheduler({ fps: 60, onRender: () => renders++ });
  s.start();
  s.requestRender();
  s.requestRender();
  s.requestRender();
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

test('ocioso não renderiza', async () => {
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
  await delay(80);
  assert.ok(frames >= 3, `onFrame chamado ${frames}x`);
  s.stop();
});
