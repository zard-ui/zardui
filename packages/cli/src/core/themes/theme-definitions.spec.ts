/*
 * Guards the fix for the global scrollbar restyle (task #62): the theme used to
 * carry a `windowsScrollbar` constant that wrote a bare, unscoped
 * `::-webkit-scrollbar` rule into every project `zard-cli init` touches, painted
 * from theme tokens. That constant is gone — the scoped replacement is the
 * `scrollbar-thin` `@utility` in `core/css/zard.css`, which every project already
 * gets through the `@import` this suite also pins.
 *
 * If either regresses — a bare selector creeps back in, or the `@import` that
 * makes `scrollbar-thin` reachable disappears — every theme silently drifts back
 * to repainting scrollbars it does not own.
 */
import * as themes from './theme-definitions';

const THEME_BUILDERS = themes.availableThemes.map(id => {
  const build = (themes as unknown as Record<string, (corePath: string) => string>)[id];
  if (typeof build !== 'function') throw new Error(`theme-definitions.ts exports no "${id}" theme.`);
  return { id, build };
});

describe('theme-definitions', () => {
  describe.each(THEME_BUILDERS)('$id', ({ build }) => {
    const css = build('@/shared/core');

    it('does not emit a bare ::-webkit-scrollbar selector', () => {
      // A bare selector starts at the beginning of a line with no scoping prefix
      // (a class, an `&`, an element, or a combinator) in front of it.
      expect(css).not.toMatch(/^::-webkit-scrollbar/m);
    });

    it('imports the core stylesheet that ships the scrollbar-thin utility', () => {
      expect(css).toContain("@import '@/shared/core/css/zard';");
    });
  });
});
