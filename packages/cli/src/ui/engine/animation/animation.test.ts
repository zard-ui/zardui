import assert from 'node:assert/strict';

import { Easing, tween, createAnimationClock, spinnerFrames } from '../index.js';

test('tween linear avança e termina', () => {
  const tw = tween({ from: 0, to: 10, duration: 100, easing: Easing.linear });
  assert.equal(tw.value, 0);
  tw.update(50);
  assert.ok(Math.abs(tw.value - 5) < 0.001);
  tw.update(50);
  assert.equal(tw.value, 10);
  assert.equal(tw.done, true);
});

test('easing mapeia [0,1]→[0,1]', () => {
  for (const fn of [Easing.easeIn, Easing.easeOut, Easing.easeInOut, Easing.spring]) {
    assert.ok(Math.abs(fn(0)) < 0.001);
    assert.ok(Math.abs(fn(1) - 1) < 0.001);
  }
});

test('clock keyed reporta atividade e fase', () => {
  const clock = createAnimationClock();
  clock.register('p', tween({ from: 0, to: 1, duration: 100 }));
  assert.equal(clock.active, true);
  clock.tick(100);
  assert.ok(Math.abs(clock.phase('p') - 1) < 0.001);
  assert.equal(clock.active, false);
});

test('spinnerFrames tem variantes', () => {
  assert.ok((spinnerFrames['dots']?.length ?? 0) > 0);
  assert.ok((spinnerFrames['line']?.length ?? 0) > 0);
});
