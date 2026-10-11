import { DEFAULT_DESIGN, designConstraints, designsEqual, normalizeDesign } from './config.js';
import { ACCENT_COLOR_IDS, BASE_COLOR_IDS, RADIUS_IDS, STYLE_IDS, themesFor } from './options.js';

describe('normalizeDesign', () => {
  it('returns the default design for nothing', () => {
    expect(normalizeDesign()).toEqual(DEFAULT_DESIGN);
    expect(normalizeDesign({})).toEqual(DEFAULT_DESIGN);
  });

  it('is idempotent', () => {
    const messy = normalizeDesign({
      style: 'lyra',
      radius: 'large',
      baseColor: 'mist',
      theme: 'neutral',
      menuAppearance: 'translucent',
      menuAccent: 'bold',
      font: 'lora',
      fontHeading: 'lora',
    });

    expect(normalizeDesign(messy)).toEqual(messy);
  });

  describe('radius', () => {
    it.each(['lyra', 'sera'])('is none under %s, whatever was asked', style => {
      for (const radius of RADIUS_IDS) expect(normalizeDesign({ style, radius }).radius).toBe('none');
    });

    it('lets every other style choose', () => {
      for (const style of STYLE_IDS.filter(id => id !== 'lyra' && id !== 'sera' && id !== 'rhea')) {
        for (const radius of RADIUS_IDS) expect(normalizeDesign({ style, radius }).radius).toBe(radius);
      }
    });

    it('turns large into the default under rhea and leaves the rest alone', () => {
      expect(normalizeDesign({ style: 'rhea', radius: 'large' }).radius).toBe('default');
      for (const radius of RADIUS_IDS.filter(id => id !== 'large')) {
        expect(normalizeDesign({ style: 'rhea', radius }).radius).toBe(radius);
      }
    });
  });

  describe('menu', () => {
    it('forces a subtle accent under a translucent menu', () => {
      expect(normalizeDesign({ menuAppearance: 'translucent', menuAccent: 'bold' }).menuAccent).toBe('subtle');
    });

    it('keeps a bold accent on a solid menu, inverted or not', () => {
      expect(normalizeDesign({ menuAppearance: 'solid', menuAccent: 'bold' }).menuAccent).toBe('bold');
      expect(normalizeDesign({ menuColor: 'inverted', menuAccent: 'bold' }).menuAccent).toBe('bold');
    });

    it('lets an inverted menu be translucent', () => {
      expect(normalizeDesign({ menuColor: 'inverted', menuAppearance: 'translucent' })).toMatchObject({
        menuColor: 'inverted',
        menuAppearance: 'translucent',
      });
    });
  });

  describe('theme and chart color', () => {
    it('falls back to the base color when the theme is another base color', () => {
      expect(normalizeDesign({ baseColor: 'mauve', theme: 'neutral' }).theme).toBe('mauve');
      expect(normalizeDesign({ baseColor: 'taupe', theme: 'stone', chartColor: 'olive' })).toMatchObject({
        theme: 'taupe',
        chartColor: 'taupe',
      });
    });

    it('accepts the base color itself and every accent', () => {
      for (const baseColor of BASE_COLOR_IDS) {
        for (const theme of themesFor(baseColor)) {
          expect(normalizeDesign({ baseColor, theme, chartColor: theme })).toMatchObject({ theme, chartColor: theme });
        }
      }
    });

    it('lists the base color first, then the 17 accents', () => {
      expect(themesFor('mist')).toEqual(['mist', ...ACCENT_COLOR_IDS]);
      expect(ACCENT_COLOR_IDS).toHaveLength(17);
    });

    it('falls back for a value that does not exist', () => {
      expect(normalizeDesign({ baseColor: 'chartreuse', theme: 'chartreuse', chartColor: 'chartreuse' })).toMatchObject(
        {
          baseColor: 'neutral',
          theme: 'neutral',
          chartColor: 'neutral',
        },
      );
    });
  });

  describe('fonts', () => {
    it('reads a heading equal to the body font as inherit', () => {
      expect(normalizeDesign({ font: 'lora', fontHeading: 'lora' }).fontHeading).toBe('inherit');
    });

    it('keeps a different heading font', () => {
      expect(normalizeDesign({ font: 'inter', fontHeading: 'playfair-display' }).fontHeading).toBe('playfair-display');
    });

    it('falls back for fonts and libraries that do not exist', () => {
      expect(
        normalizeDesign({ font: 'comic-sans', fontHeading: 'wingdings', iconLibrary: 'fontawesome' }),
      ).toMatchObject({
        font: 'inter',
        fontHeading: 'inherit',
        iconLibrary: 'lucide',
      });
    });
  });

  it('ignores values that are not strings', () => {
    expect(normalizeDesign({ style: 3, radius: null, font: undefined })).toEqual(DEFAULT_DESIGN);
  });

  /**
   * "Two constraints at once": whatever order the user flips things in, the design never lands on a
   * combination the codec would have to bend.
   */
  it('never leaves a state the constraints would change again', () => {
    for (const style of STYLE_IDS) {
      for (const radius of RADIUS_IDS) {
        for (const menuAppearance of ['solid', 'translucent']) {
          for (const menuAccent of ['subtle', 'bold']) {
            const once = normalizeDesign({ style, radius, menuAppearance, menuAccent, menuColor: 'inverted' });
            expect(normalizeDesign(once)).toEqual(once);
          }
        }
      }
    }
  });
});

describe('designConstraints', () => {
  it('locks the radius picker under lyra and sera', () => {
    for (const style of ['lyra', 'sera'] as const) {
      const constraints = designConstraints(normalizeDesign({ style }));

      expect(constraints.radiusLocked).toBe(true);
      expect(constraints.disabledRadii).toEqual(RADIUS_IDS.filter(id => id !== 'none'));
    }
  });

  it('disables only large under rhea', () => {
    const constraints = designConstraints(normalizeDesign({ style: 'rhea' }));

    expect(constraints.radiusLocked).toBe(false);
    expect(constraints.disabledRadii).toEqual(['large']);
  });

  it('disables nothing for the default design', () => {
    expect(designConstraints(DEFAULT_DESIGN)).toMatchObject({
      radiusLocked: false,
      disabledRadii: [],
      disabledMenuAccents: [],
      disabledMenuColors: [],
    });
  });

  it('disables a bold accent under a translucent menu', () => {
    expect(designConstraints(normalizeDesign({ menuAppearance: 'translucent' })).disabledMenuAccents).toEqual(['bold']);
  });

  it('disables an inverted menu in dark mode only', () => {
    expect(designConstraints(DEFAULT_DESIGN, { dark: true }).disabledMenuColors).toEqual(['inverted']);
    expect(designConstraints(DEFAULT_DESIGN, { dark: false }).disabledMenuColors).toEqual([]);
  });

  it('offers the themes and chart colors of the base color, and bars the body font as heading', () => {
    const constraints = designConstraints(normalizeDesign({ baseColor: 'olive', font: 'lora' }));

    expect(constraints.themes).toEqual(themesFor('olive'));
    expect(constraints.chartColors).toEqual(themesFor('olive'));
    expect(constraints.disabledHeadings).toEqual(['lora']);
  });

  it('agrees with normalizeDesign: every disabled option is one normalizeDesign would bend', () => {
    for (const style of STYLE_IDS) {
      const design = normalizeDesign({ style });
      for (const radius of designConstraints(design).disabledRadii) {
        expect(normalizeDesign({ ...design, radius }).radius).not.toBe(radius);
      }
    }
  });
});

describe('designsEqual', () => {
  it('compares field by field', () => {
    expect(designsEqual(DEFAULT_DESIGN, normalizeDesign())).toBe(true);
    expect(designsEqual(DEFAULT_DESIGN, normalizeDesign({ font: 'lora' }))).toBe(false);
  });
});
