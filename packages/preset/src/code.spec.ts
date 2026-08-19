import { LOCAL_PRESET_CATALOG } from './catalog/index.js';
import { decodePreset, encodePreset, looksLikePresetCode, PresetCodeError } from './code.js';
import { DEFAULT_PRESET, type Preset } from './preset.js';

const catalog = LOCAL_PRESET_CATALOG;

function everyCombination(): Preset[] {
  const presets: Preset[] = [];

  for (const baseColor of catalog.baseColors) {
    for (const theme of catalog.themes) {
      for (const chart of catalog.charts) {
        for (const radius of catalog.radii) {
          for (const icons of catalog.icons) {
            for (const darkMode of ['class', 'off'] as const) {
              for (const rtl of [false, true]) {
                presets.push({
                  version: 1,
                  baseColor: baseColor.id,
                  theme: theme.id,
                  chart: chart.id,
                  radius: radius.id,
                  icons: icons.id,
                  darkMode,
                  rtl,
                });
              }
            }
          }
        }
      }
    }
  }

  return presets;
}

describe('preset code', () => {
  it('round-trips every combination the catalog can express', () => {
    const presets = everyCombination();
    expect(presets.length).toBe(5 * 18 * 3 * 5 * 1 * 2 * 2);

    for (const preset of presets) {
      const code = encodePreset(preset, catalog);
      expect(code).not.toBeNull();
      expect(decodePreset(code as string, catalog)).toEqual(preset);
    }
  });

  it('gives every combination a distinct code', () => {
    const codes = new Set(everyCombination().map(preset => encodePreset(preset, catalog)));

    expect(codes.size).toBe(everyCombination().length);
  });

  it('refuses a code whose checksum does not close, saying that case matters', () => {
    const code = encodePreset(DEFAULT_PRESET, catalog) as string;
    const tampered = `${code.slice(0, 1)}1${code.slice(2)}`;

    expect(() => decodePreset(tampered, catalog)).toThrow(PresetCodeError);
    expect(() => decodePreset(tampered, catalog)).toThrow(/case-sensitive/);
  });

  it('refuses a format it does not read instead of guessing', () => {
    // 'b' seria a v2: mesmo tamanho, mesmo alfabeto, significado que esta versão não conhece.
    const body = 'b00030';
    const sum = [...body].reduce(
      (total, char) => total + '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.indexOf(char),
      0,
    );
    const code = body + '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'[sum % 62];

    expect(() => decodePreset(code, catalog)).toThrow(/Update the CLI/);
  });

  it('refuses anything that is not a code at all', () => {
    for (const value of ['', 'ab', './zard.preset.json', 'https://zardui.com/x', 'a-000301e']) {
      expect(() => decodePreset(value, catalog)).toThrow(PresetCodeError);
    }
  });

  it('falls back to defaults on a payload shorter than it knows', () => {
    // Só a versão e o tom neutro: uma CLI futura pode encurtar, e esta precisa ler.
    const body = 'a4';
    const code = body + '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'[(36 + 4) % 62];

    expect(decodePreset(code, catalog)).toEqual({ ...DEFAULT_PRESET, baseColor: 'slate' });
  });

  it('ignores payload it does not know instead of failing', () => {
    // Um campo acrescentado depois desta versão entra no fim; o resto continua valendo.
    const body = `${encodePreset(DEFAULT_PRESET, catalog)?.slice(0, -1)}Z`;
    const code =
      body +
      '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'[
        [...body].reduce(
          (total, char) => total + '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.indexOf(char),
          0,
        ) % 62
      ];

    expect(decodePreset(code, catalog)).toEqual(DEFAULT_PRESET);
  });

  it('has no code for a preset with hand-edited colors', () => {
    expect(
      encodePreset({ ...DEFAULT_PRESET, colors: { light: { primary: 'oklch(0.5 0.2 264)' } } }, catalog),
    ).toBeNull();
  });

  it('refuses an id the catalog does not have, listing the ones it does', () => {
    expect(() => encodePreset({ ...DEFAULT_PRESET, theme: 'chartreuse' }, catalog)).toThrow(/Available: /);
  });

  it('reads a code aimed at a catalog entry it never heard of as an error, not as the default', () => {
    const shrunk = { ...catalog, themes: catalog.themes.slice(0, 1) };
    const code = encodePreset({ ...DEFAULT_PRESET, theme: 'indigo' }, catalog) as string;

    expect(() => decodePreset(code, shrunk)).toThrow(/silently change the design/);
  });

  it('tells a code apart from a path and a URL', () => {
    expect(looksLikePresetCode('a000301e')).toBe(true);
    expect(looksLikePresetCode('./zard.preset.json')).toBe(false);
    expect(looksLikePresetCode('https://zardui.com/preset.json')).toBe(false);
  });

  it('keeps the default preset on the code the docs print', () => {
    expect(encodePreset(DEFAULT_PRESET, catalog)).toBe('a000301e');
  });
});
