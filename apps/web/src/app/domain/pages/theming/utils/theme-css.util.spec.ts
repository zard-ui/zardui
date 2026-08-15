import { resolveToken, toCssVariables, toScopedStyles } from './theme-css.util';
import { BASE_COLORS } from '../data/base-colors.data';

describe('theme-css.util', () => {
  const neutral = BASE_COLORS[0];

  describe('toScopedStyles', () => {
    it('starts with the radius so a preview container can override the whole scale', () => {
      expect(toScopedStyles(neutral, 'light').startsWith(`--radius: ${neutral.radius};`)).toBe(true);
    });

    it('emits one declaration per token', () => {
      const declarations = toScopedStyles(neutral, 'light').split('; ');

      // Every light token, plus --radius.
      expect(declarations).toHaveLength(Object.keys(neutral.light).length + 1);
    });

    it('uses dark values when the dark mode is requested', () => {
      expect(toScopedStyles(neutral, 'dark')).toContain(`--background: ${neutral.dark['background']}`);
      expect(toScopedStyles(neutral, 'dark')).not.toContain(`--background: ${neutral.light['background']};`);
    });
  });

  describe('resolveToken', () => {
    it('reads the value for the requested mode', () => {
      expect(resolveToken(neutral, 'light', 'primary')).toBe(neutral.light['primary']);
      expect(resolveToken(neutral, 'dark', 'primary')).toBe(neutral.dark['primary']);
    });

    it('returns an empty string for an unknown token', () => {
      expect(resolveToken(neutral, 'light', 'does-not-exist')).toBe('');
    });
  });

  describe('toCssVariables', () => {
    const css = toCssVariables(neutral);

    it('renders a :root block and a .dark block', () => {
      expect(css).toContain(':root {');
      expect(css).toContain('.dark {');
    });

    it('declares --radius only once, in :root', () => {
      expect(css.match(/--radius:/g)).toHaveLength(1);
      expect(css.indexOf('--radius:')).toBeLessThan(css.indexOf('.dark {'));
    });

    it('defines every token it references', () => {
      const root = css.slice(css.indexOf(':root {'), css.indexOf('.dark {'));
      const declared = [...root.matchAll(/--([a-z0-9-]+):/g)].map(match => match[1]);

      expect(declared).toContain('destructive-foreground');
      expect(new Set(declared).size).toBe(declared.length);
    });
  });
});
