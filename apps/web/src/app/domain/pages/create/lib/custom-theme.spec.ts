import { DEFAULT_DESIGN, resolveTokens } from '@zard/design';

import {
  CUSTOM_TOKENS,
  decodeCustomTheme,
  EMPTY_CUSTOM_CODE,
  EMPTY_CUSTOM_THEME,
  encodeCustomTheme,
  normalizeThemeColor,
  renderCustomThemeCss,
  renderCustomTokenBlocks,
  resolveCustomTokens,
  sanitizeCustomTheme,
  withCustomToken,
  withoutCustomChanges,
} from './custom-theme';

const design = { ...DEFAULT_DESIGN };

describe('custom theme', () => {
  it('covers every color token a design resolves to', () => {
    const { light } = resolveTokens(design);
    const colorKeys = Object.keys(light).filter(key => key !== 'radius');

    expect([...CUSTOM_TOKENS].sort()).toEqual(colorKeys.sort());
  });

  describe('normalizeThemeColor', () => {
    it('rewrites any readable color as oklch', () => {
      expect(normalizeThemeColor('#ff0000')).toMatch(/^oklch\(/);
      expect(normalizeThemeColor('oklch(0.205 0 0)')).toMatch(/^oklch\(0\.20\d+ 0 0\)$/);
    });

    it('keeps the alpha of translucent tokens', () => {
      expect(normalizeThemeColor('oklch(1 0 0 / 10%)')).toMatch(/\/ 0\.1\)$/);
    });

    it('rejects anything that is not a color, so nothing else reaches the injected <style>', () => {
      expect(normalizeThemeColor('red;}body{display:none')).toBeNull();
      expect(normalizeThemeColor('url(https://example.com/x.png)')).toBeNull();
      expect(normalizeThemeColor(42)).toBeNull();
      expect(normalizeThemeColor('#'.repeat(100))).toBeNull();
    });
  });

  describe('encode / decode', () => {
    it('writes ~ for a custom theme with no changes', () => {
      expect(encodeCustomTheme(EMPTY_CUSTOM_THEME)).toBe(EMPTY_CUSTOM_CODE);
      expect(decodeCustomTheme(EMPTY_CUSTOM_CODE)).toEqual(EMPTY_CUSTOM_THEME);
    });

    it('reads null as Custom being off', () => {
      expect(decodeCustomTheme(null)).toBeNull();
    });

    it('round-trips the changes, URL-safe', () => {
      const theme = withCustomToken(
        withCustomToken(EMPTY_CUSTOM_THEME, design, 'light', 'primary', '#2563eb'),
        design,
        'dark',
        'border',
        'oklch(1 0 0 / 20%)',
      );
      const code = encodeCustomTheme(theme);

      expect(code).toMatch(/^[A-Za-z0-9_-]+$/);
      expect(decodeCustomTheme(code)).toEqual(theme);
    });

    it('drops unknown tokens and values that are not colors', () => {
      const code = btoa(JSON.stringify({ l: { primary: '#000000', evil: '#fff', ring: 'x;}' } }))
        .replace(/\+/g, '-')
        .replace(/\//g, '_')
        .replace(/=+$/, '');

      const theme = decodeCustomTheme(code);

      expect(Object.keys(theme?.light ?? {})).toEqual(['primary']);
      expect(theme?.dark).toEqual({});
    });

    it('opens a value it cannot read as Custom with no changes', () => {
      expect(decodeCustomTheme('%%%')).toEqual(EMPTY_CUSTOM_THEME);
      expect(decodeCustomTheme('bm90LWpzb24')).toEqual(EMPTY_CUSTOM_THEME);
    });
  });

  describe('withCustomToken', () => {
    it('drops a token set back to what the preset gives it', () => {
      const changed = withCustomToken(EMPTY_CUSTOM_THEME, design, 'light', 'primary', '#2563eb');
      const preset = resolveTokens(design).light['primary'];

      expect(withCustomToken(changed, design, 'light', 'primary', preset)).toEqual(EMPTY_CUSTOM_THEME);
    });

    it('ignores a value that is not a color', () => {
      expect(withCustomToken(EMPTY_CUSTOM_THEME, design, 'light', 'primary', 'nope')).toBe(EMPTY_CUSTOM_THEME);
    });

    it('resets one mode or both', () => {
      const theme = withCustomToken(
        withCustomToken(EMPTY_CUSTOM_THEME, design, 'light', 'primary', '#2563eb'),
        design,
        'dark',
        'primary',
        '#60a5fa',
      );

      expect(withoutCustomChanges(theme, 'light').light).toEqual({});
      expect(withoutCustomChanges(theme, 'light').dark).toEqual(theme.dark);
      expect(withoutCustomChanges(theme)).toEqual(EMPTY_CUSTOM_THEME);
    });
  });

  describe('rendering', () => {
    const theme = withCustomToken(EMPTY_CUSTOM_THEME, design, 'light', 'primary', '#2563eb');
    const primary = theme.light.primary ?? '';

    it('lays the changes over the preset tokens', () => {
      const tokens = resolveCustomTokens(design, theme);

      expect(tokens.light['primary']).toBe(primary);
      expect(tokens.dark['primary']).toBe(resolveTokens(design).dark['primary']);
      expect(tokens.light['radius']).toBe(resolveTokens(design).light['radius']);
    });

    it('renders the token blocks the preview injects', () => {
      const css = renderCustomTokenBlocks(design, theme);

      expect(css).toContain(`--primary: ${primary};`);
      expect(css).toMatch(/^:root \{/);
      expect(css).toContain('.dark {');
    });

    it('renders a whole stylesheet for a manual install, without the CLI markers', () => {
      const css = renderCustomThemeCss(design, theme);

      expect(css).toContain(`--primary: ${primary};`);
      expect(css).toContain('@theme inline');
      expect(css).toContain('@layer base');
      expect(css).not.toContain('zard:theme');
    });
  });
});

describe('sanitizeCustomTheme', () => {
  it('keeps known tokens with real colors and drops the rest', () => {
    const theme = sanitizeCustomTheme({ light: { primary: '#000000', evil: '#fff' }, dark: { ring: '}' } });

    expect(Object.keys(theme?.light ?? {})).toEqual(['primary']);
    expect(theme?.dark).toEqual({});
  });

  it('reads anything that is not an object as no custom theme', () => {
    expect(sanitizeCustomTheme(null)).toBeNull();
    expect(sanitizeCustomTheme('x')).toBeNull();
    expect(sanitizeCustomTheme({})).toEqual({ light: {}, dark: {} });
  });
});
