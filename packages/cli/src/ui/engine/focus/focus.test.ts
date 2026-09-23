import assert from 'node:assert/strict';

import { createFocusManager } from '../index.js';

const ev = (key: string, shift = false) => ({ key, ctrl: false, alt: false, shift, raw: key });

test('auto-foca o primeiro registrado', () => {
  const fm = createFocusManager();
  fm.register({ key: 'a', tabIndex: 0 });
  fm.register({ key: 'b', tabIndex: 1 });
  assert.equal(fm.activeKey, 'a');
});

test('focusNext/Prev com wrap-around por tabIndex', () => {
  const fm = createFocusManager();
  fm.register({ key: 'a', tabIndex: 0 });
  fm.register({ key: 'b', tabIndex: 1 });
  fm.register({ key: 'c', tabIndex: 2 });
  fm.focusNext();
  assert.equal(fm.activeKey, 'b');
  fm.focusPrev();
  assert.equal(fm.activeKey, 'a');
  fm.focusPrev();
  assert.equal(fm.activeKey, 'c'); // wrap
});

test('routeKey delivers to the focused node; tab navigates; unconsumed keys bubble', () => {
  const fm = createFocusManager();
  let seen = '';
  fm.register({ key: 'a', tabIndex: 0, onKey: e => (e.key === 'x' ? ((seen = 'x'), true) : false) });
  fm.register({ key: 'b', tabIndex: 1 });
  assert.equal(fm.routeKey(ev('x')), true); // consumido pelo componente
  assert.equal(seen, 'x');
  assert.equal(fm.routeKey(ev('tab')), true); // tab navega
  assert.equal(fm.activeKey, 'b');
  assert.equal(fm.routeKey(ev('z')), false); // borbulha (global)
});

test('desabilitado e tabIndex negativo saem do anel', () => {
  const fm = createFocusManager();
  fm.register({ key: 'a', tabIndex: 0 });
  fm.register({ key: 'b', tabIndex: 1, disabled: true });
  fm.register({ key: 'c', tabIndex: -1 });
  fm.focusNext();
  assert.equal(fm.activeKey, 'a'); // only 'a' is eligible → it stays
});
