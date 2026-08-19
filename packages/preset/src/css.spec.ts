import * as legacy from './__fixtures__/legacy-theme-definitions.js';
import { LOCAL_PRESET_CATALOG } from './catalog/index.js';
import { renderThemeCss } from './css.js';
import { DEFAULT_PRESET } from './preset.js';
import { resolvePreset } from './resolve.js';

const CORE_PATH = './app/shared/core';

const LEGACY: Record<string, (corePath: string) => string> = {
  neutral: legacy.neutral,
  stone: legacy.stone,
  zinc: legacy.zinc,
  gray: legacy.gray,
  slate: legacy.slate,
};

describe('renderThemeCss', () => {
  // A razão de a migração existir era tirar os tokens de dois lugares, não mudar
  // o arquivo que quem roda `init` recebe. Byte a byte, portanto — um diff de
  // espaçamento aqui é um diff no projeto de outra pessoa.
  it.each(legacy.availableThemes)('reproduces the legacy CSS for %s, byte for byte', name => {
    const resolved = resolvePreset({ ...DEFAULT_PRESET, baseColor: name }, LOCAL_PRESET_CATALOG);

    expect(renderThemeCss(resolved, { corePath: CORE_PATH })).toBe(LEGACY[name]?.(CORE_PATH).trim());
  });

  it('writes --radius only in :root', () => {
    const resolved = resolvePreset(DEFAULT_PRESET, LOCAL_PRESET_CATALOG);
    const css = renderThemeCss(resolved, { corePath: CORE_PATH });

    expect(css.match(/--radius:/g)).toHaveLength(1);
    expect(css.slice(css.indexOf('.dark {'))).not.toContain('--radius:');
  });

  it('honours the radius chosen in the preset', () => {
    const resolved = resolvePreset({ ...DEFAULT_PRESET, radius: 'none' }, LOCAL_PRESET_CATALOG);

    expect(renderThemeCss(resolved, { corePath: CORE_PATH })).toContain('--radius: 0rem;');
  });

  it('imports the core path it was given', () => {
    const resolved = resolvePreset(DEFAULT_PRESET, LOCAL_PRESET_CATALOG);

    expect(renderThemeCss(resolved, { corePath: '@/shared/core' })).toContain("@import '@/shared/core/css/tailwind';");
  });
});
