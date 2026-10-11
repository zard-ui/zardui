import { readFileSync } from 'node:fs';
import * as path from 'node:path';

import { MENU_TRANSLUCENT_CLASSES, menuMarkers, parseStyleSheet, transformStyle } from './index.js';

const MENU_CSS = path.resolve(__dirname, '../../../../../libs/zard/src/lib/shared/core/css/styles/menu.css');

describe('menu look', () => {
  it('resolves to nothing by default', () => {
    expect(menuMarkers()).toEqual({ 'cn-menu-target': '', 'cn-menu-translucent': '' });
  });

  it('makes the surface dark when inverted and translucent when asked', () => {
    expect(menuMarkers({ menuColor: 'inverted' })['cn-menu-target']).toBe('dark');
    expect(menuMarkers({ menuAppearance: 'translucent' })['cn-menu-translucent']).toBe(MENU_TRANSLUCENT_CLASSES);
  });

  it('is applied by the transform whatever the style', () => {
    const source = "const c = 'cn-box cn-menu-target cn-menu-translucent z-50';";
    const catalog = { lyra: { 'cn-box': 'p-2' } };

    expect(transformStyle(source, 'lyra', catalog)).toBe("const c = 'p-2 z-50';");
    expect(transformStyle(source, 'lyra', catalog, { menuColor: 'inverted' })).toBe("const c = 'p-2 dark z-50';");
    expect(transformStyle(source, 'lyra', catalog, { menuAppearance: 'translucent' })).toContain(
      'bg-popover/70 before:',
    );
  });

  it('keeps menu.css (the docs) in step with the classes the installer inlines', () => {
    const rules = parseStyleSheet(readFileSync(MENU_CSS, 'utf8'));

    expect(rules['cn-menu-translucent']).toBe(MENU_TRANSLUCENT_CLASSES);
  });
});
