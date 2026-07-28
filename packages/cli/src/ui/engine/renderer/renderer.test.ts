/**
 * Testes de integração da fatia vertical: components → layout → frame → diff
 * → renderer → terminal. Usa MockTerminal (sem TTY) para asserções de bytes e
 * snapshots — ver ARCHITECTURE §18.
 */

import assert from 'node:assert/strict';

import { panel, screen, text, type Node } from '../index.js';
import { createRenderer } from '../index.js';
import { createMockTerminal } from '../testing/index.js';

function make(): {
  render: (n: Node) => ReturnType<ReturnType<typeof createRenderer>['render']>;
  debug: () => string;
  term: ReturnType<typeof createMockTerminal>;
} {
  const term = createMockTerminal({ size: { cols: 40, rows: 8 }, colors: 'truecolor' });
  const r = createRenderer({ terminal: term });
  return { render: n => r.render(n), debug: () => r.debugFrame(), term };
}

function view(label: string): Node {
  return screen(panel({ title: 'Box', border: 'round', padding: 1 }, text(label, { color: 'primary' })));
}

test('primeiro render pinta o painel e escreve bytes', () => {
  const { render, debug } = make();
  const st = render(view('count: 0'));
  assert.ok(st.bytesWritten > 0, 'deve escrever no primeiro frame');
  const snap = debug();
  assert.match(snap, /╭─ Box/u, 'borda arredondada + título');
  assert.match(snap, /count: 0/u, 'conteúdo presente');
});

test('mudar 1 caractere gera patch mínimo (poucas células)', () => {
  const { render } = make();
  render(view('count: 0'));
  const st = render(view('count: 9')); // só o '0' → '9' muda
  assert.equal(st.changedLines, 1, 'apenas 1 linha alterada');
  assert.equal(st.changedCells, 1, 'apenas 1 célula alterada');
  // 1 célula: envelope sync + move + SGR truecolor + glifo + reset (~47 bytes).
  assert.ok(st.bytesWritten < 80, `patch pequeno, foi ${st.bytesWritten} bytes`);
});

test('re-render idêntico não escreve nada (idempotência)', () => {
  const { render, term } = make();
  render(view('stable'));
  const before = term.writes.length;
  const st = render(view('stable'));
  assert.equal(st.bytesWritten, 0, '0 bytes');
  assert.equal(st.changedLines, 0, '0 linhas');
  assert.equal(term.writes.length, before, 'nenhum write novo');
});

test('diff escreve fração ínfima de um redesenho total', () => {
  const r = make();
  r.render(view('a'));
  const incr = r.render(view('b'));
  const rr = createRenderer({ terminal: createMockTerminal({ size: { cols: 40, rows: 8 } }) });
  const full = rr.render(view('b'));
  assert.ok(incr.bytesWritten * 5 < full.bytesWritten, 'update << redesenho total');
});
