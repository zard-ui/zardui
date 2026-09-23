import assert from 'node:assert/strict';

import { createScreen, screen, panel, column, input, checkbox, select, type Node } from '../index.js';
import { createMockTerminal } from '../testing/index.js';

test('digitar num input atualiza o estado e renderiza', () => {
  const term = createMockTerminal({ size: { cols: 44, rows: 8 } });
  const ui = createScreen({ terminal: term, handleExitSignals: false });
  const st = { name: '' };
  ui.setView(
    (): Node =>
      screen(
        panel(
          { title: 'x', border: 'round', padding: 1 },
          input({ key: 'name', label: 'name', value: st.name, onChange: v => (st.name = v) }),
        ),
      ),
  );
  ui.mount();
  term.feed('zard'); // 4 teclas numa rajada
  assert.equal(st.name, 'zard', 'estado atualizado apesar da rajada');
  ui.scheduler.renderSync();
  assert.match(ui.renderer.debugFrame(), /zard/u, 'texto aparece no frame');
  ui.unmount();
});

test('TAB navega e space alterna checkbox', () => {
  const term = createMockTerminal({ size: { cols: 44, rows: 10 } });
  const ui = createScreen({ terminal: term, handleExitSignals: false });
  const st = { name: '', checked: false };
  ui.setView(
    (): Node =>
      screen(
        column(
          {},
          input({ key: 'name', value: st.name, onChange: v => (st.name = v) }),
          checkbox({ key: 'ts', label: 'ts', checked: st.checked, onChange: v => (st.checked = v) }),
        ),
      ),
  );
  ui.mount();
  assert.equal(ui.focus.activeKey, 'name');
  term.feed('\t'); // tab → checkbox
  assert.equal(ui.focus.activeKey, 'ts');
  term.feed(' '); // space → toggle
  assert.equal(st.checked, true);
  ui.unmount();
});

test('select responds to the arrow keys', () => {
  const term = createMockTerminal({ size: { cols: 44, rows: 8 } });
  const ui = createScreen({ terminal: term, handleExitSignals: false });
  const st = { pm: 'npm' };
  ui.setView(
    (): Node =>
      screen(
        select({
          key: 'pm',
          value: st.pm,
          options: [
            { label: 'npm', value: 'npm' },
            { label: 'pnpm', value: 'pnpm' },
            { label: 'bun', value: 'bun' },
          ],
          onChange: v => (st.pm = v),
        }),
      ),
  );
  ui.mount();
  term.feed('\x1b[B'); // down → pnpm
  assert.equal(st.pm, 'pnpm');
  term.feed('\x1b[B'); // down → bun
  assert.equal(st.pm, 'bun');
  ui.unmount();
});
