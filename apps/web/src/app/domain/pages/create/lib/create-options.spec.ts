import { readFileSync } from 'node:fs';
import { join } from 'node:path';

import { DEFAULT_DESIGN, designConstraints, normalizeDesign, FONTS, ICON_LIBRARIES } from '@zard/design';

import {
  accentSections,
  changeFor,
  colorDot,
  fontSections,
  headingLabel,
  menuLabel,
  menuSections,
  radiusSections,
  themeSections,
} from './create-options';
import { ICON_MAP } from '../../../../../../../../packages/cli/src/core/icons/icon-map';

const design = (overrides: Partial<Record<keyof typeof DEFAULT_DESIGN, string>> = {}) =>
  normalizeDesign({ ...DEFAULT_DESIGN, ...overrides });

const disabled = (sections: { options: readonly { value: string; disabled?: boolean }[] }[]) =>
  sections.flatMap(section => section.options.filter(option => option.disabled).map(option => option.value));

describe('create options', () => {
  it('disables Large for rhea and everything but None for lyra', () => {
    const rhea = design({ style: 'rhea' });
    expect(disabled(radiusSections(rhea, designConstraints(rhea)))).toEqual(['large']);

    const lyra = design({ style: 'lyra' });
    expect(disabled(radiusSections(lyra, designConstraints(lyra)))).toEqual(['default', 'small', 'medium', 'large']);
  });

  it('disables Bold under a translucent menu and Inverted in dark mode', () => {
    const translucent = design({ menuAppearance: 'translucent' });
    expect(disabled(accentSections(translucent, designConstraints(translucent)))).toEqual(['bold']);

    expect(disabled(menuSections(DEFAULT_DESIGN, designConstraints(DEFAULT_DESIGN, { dark: true })))).toEqual([
      'inverted',
    ]);
  });

  it('lists the base color first, then a separator, then the 17 accents', () => {
    const sections = themeSections('theme', design({ baseColor: 'zinc' }), designConstraints(DEFAULT_DESIGN));

    expect(sections[0]?.options.map(option => option.value)).toEqual(['zinc']);
    expect(sections[0]?.separatorAfter).toBe(true);
    expect(sections[1]?.options).toHaveLength(17);
  });

  it('groups the fonts as sans, mono and serif and puts Inherit first for the heading', () => {
    const body = fontSections('font', DEFAULT_DESIGN);
    expect(body.map(section => section.label)).toEqual(['Sans', 'Mono', 'Serif']);
    expect(body.flatMap(section => section.options)).toHaveLength(FONTS.length);

    const heading = fontSections('fontHeading', DEFAULT_DESIGN);
    expect(heading[0]?.options[0]).toEqual({ value: 'inherit', label: 'Inter' });
  });

  it('shows Inherit as the name of the body font and the menu as color / appearance', () => {
    expect(headingLabel(DEFAULT_DESIGN)).toBe('Inter');
    expect(headingLabel(design({ fontHeading: 'lora' }))).toBe('Lora');
    expect(menuLabel(design({ menuColor: 'inverted', menuAppearance: 'translucent' }))).toBe('Inverted / Translucent');
  });

  it('turns a menu event into the field it changes', () => {
    expect(changeFor('menu', { section: 'color', value: 'inverted' })).toEqual({ menuColor: 'inverted' });
    expect(changeFor('menu', { section: 'appearance', value: 'translucent' })).toEqual({
      menuAppearance: 'translucent',
    });
    expect(changeFor('font', { section: 'font', value: 'lora' })).toEqual({ font: 'lora' });
  });

  it('has a dot color for every base color and accent', () => {
    for (const id of ['neutral', 'taupe', 'amber', 'yellow']) {
      expect(colorDot('theme', id)).not.toBe('currentColor');
      expect(colorDot('chart', id)).not.toBe('currentColor');
    }
  });
});

describe('icon tables of the preview', () => {
  const dir = join(__dirname, '../data/icons');

  it.each(ICON_LIBRARIES.map(library => library.value))('%s covers every token of the CLI icon map', family => {
    const source = readFileSync(join(dir, `${family}.ts`), 'utf8');
    const tokens = [...source.matchAll(/^\s*'?([a-z0-9-]+)'?:\s/gm)].map(match => match[1]);

    const expected = Object.entries(ICON_MAP)
      .filter(([, row]) => row[family])
      .map(([token]) => token);

    expect(tokens).toEqual(expect.arrayContaining(expected));
  });
});
