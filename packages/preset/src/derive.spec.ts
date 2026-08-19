import { BASE_COLORS, LOCAL_PRESET_CATALOG, THEMES } from './catalog/index.js';
import { AA_CONTRAST, contrastRatio, isInGamut, parseOklch } from './color.js';
import { deriveAccent } from './derive.js';
import { DEFAULT_PRESET } from './preset.js';
import { resolvePreset } from './resolve.js';
import type { ColorScheme } from './types.js';

const SCHEMES: ColorScheme[] = ['light', 'dark'];
const ACCENTS = THEMES.filter(theme => theme.hue !== undefined);

describe('deriveAccent', () => {
  // 5 tons × 17 destaques × 2 modos. Escrito à mão isso seriam 170 pares para
  // alguém conferir a olho uma vez e nunca mais.
  it.each(BASE_COLORS.flatMap(base => SCHEMES.map(scheme => [base.id, scheme] as const)))(
    'keeps primary readable on %s in %s mode',
    (baseColorId, scheme) => {
      const base = BASE_COLORS.find(entry => entry.id === baseColorId);

      for (const accent of ACCENTS) {
        const derived = deriveAccent(accent, base?.[scheme] ?? ({} as never), scheme);
        const primary = parseOklch(derived.primary as string);
        const foreground = parseOklch(derived['primary-foreground'] as string);

        expect(primary).not.toBeNull();
        expect(foreground).not.toBeNull();
        expect(contrastRatio(primary as never, foreground as never)).toBeGreaterThanOrEqual(AA_CONTRAST);
      }
    },
  );

  it('keeps every derived primary inside sRGB', () => {
    for (const base of BASE_COLORS) {
      for (const scheme of SCHEMES) {
        for (const accent of ACCENTS) {
          const primary = parseOklch(deriveAccent(accent, base[scheme], scheme).primary as string);

          expect(isInGamut(primary as never)).toBe(true);
        }
      }
    }
  });

  it('keeps the hue it was given — indigo stays indigo on every base', () => {
    const indigo = THEMES.find(theme => theme.id === 'indigo');

    for (const base of BASE_COLORS) {
      const primary = parseOklch(deriveAccent(indigo as never, base.light, 'light').primary as string);

      expect(primary?.h).toBeCloseTo(indigo?.hue as number, 3);
    }
  });

  it('leaves the base tone alone when there is no accent', () => {
    const neutral = THEMES.find(theme => theme.id === 'neutral');

    expect(deriveAccent(neutral as never, BASE_COLORS[0]?.light as never, 'light')).toEqual({});
  });

  it('resolves the neutral theme to exactly the base tokens', () => {
    const resolved = resolvePreset(DEFAULT_PRESET, LOCAL_PRESET_CATALOG);
    const base = BASE_COLORS.find(entry => entry.id === 'neutral');

    expect(resolved.light.primary).toBe(base?.light.primary);
    expect(resolved.dark.ring).toBe(base?.dark.ring);
  });
});
