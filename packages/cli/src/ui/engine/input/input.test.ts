import assert from 'node:assert/strict';
import { setTimeout as delay } from 'node:timers/promises';

import { createInputManager, type KeyEvent, type MouseEvent } from '../index.js';

function harness(): {
  feed: (s: string) => void;
  keys: KeyEvent[];
  mouse: MouseEvent[];
  pastes: string[];
  stop: () => void;
} {
  let sink: ((b: Buffer) => void) | undefined;
  const im = createInputManager(f => {
    sink = f;
    return { dispose: () => {} };
  });
  const keys: KeyEvent[] = [];
  const mouse: MouseEvent[] = [];
  const pastes: string[] = [];
  im.onKey(e => keys.push(e));
  im.onMouse(e => mouse.push(e));
  im.onPaste(t => pastes.push(t));
  im.start();
  return { feed: s => sink?.(Buffer.from(s, 'latin1')), keys, mouse, pastes, stop: () => im.stop() };
}

test('a simple printable key', () => {
  const h = harness();
  h.feed('a');
  assert.equal(h.keys[0]?.key, 'a');
  h.stop();
});

test('setas, enter, backspace, ctrl', () => {
  const h = harness();
  h.feed('\x1b[A');
  h.feed('\r');
  h.feed('\x7f');
  h.feed('\x03');
  assert.equal(h.keys[0]?.key, 'up');
  assert.equal(h.keys[1]?.key, 'enter');
  assert.equal(h.keys[2]?.key, 'backspace');
  assert.equal(h.keys[3]?.key, 'c');
  assert.equal(h.keys[3]?.ctrl, true);
  h.stop();
});

test('modificadores: ctrl+seta e alt+tecla', () => {
  const h = harness();
  h.feed('\x1b[1;5C'); // ctrl+right
  h.feed('\x1bb'); // alt+b
  assert.equal(h.keys[0]?.key, 'right');
  assert.equal(h.keys[0]?.ctrl, true);
  assert.equal(h.keys[1]?.key, 'b');
  assert.equal(h.keys[1]?.alt, true);
  h.stop();
});

test('fragmentation across chunks', () => {
  const h = harness();
  h.feed('\x1b'); // ESC parcial
  h.feed('[A'); // completa → up
  assert.equal(h.keys[0]?.key, 'up');
  h.stop();
});

test('mouse SGR', () => {
  const h = harness();
  h.feed('\x1b[<0;5;3M');
  assert.deepEqual(
    { x: h.mouse[0]?.x, y: h.mouse[0]?.y, button: h.mouse[0]?.button, action: h.mouse[0]?.action },
    { x: 4, y: 2, button: 'left', action: 'press' },
  );
  h.stop();
});

test('bracketed paste', () => {
  const h = harness();
  h.feed('\x1b[200~hello world\x1b[201~');
  assert.equal(h.pastes[0], 'hello world');
  h.stop();
});

test("a lone ESC becomes 'escape' after the timeout", async () => {
  const h = harness();
  h.feed('\x1b');
  await delay(80);
  assert.equal(h.keys[0]?.key, 'escape');
  h.stop();
});
