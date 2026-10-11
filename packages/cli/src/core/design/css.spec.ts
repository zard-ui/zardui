import { decodePreset } from './codec.js';
import { DEFAULT_DESIGN, normalizeDesign } from './config.js';
import {
  FONT_IMPORTS_END,
  FONT_IMPORTS_START,
  FONT_THEME_END,
  FONT_THEME_START,
  THEME_END,
  THEME_START,
  applyFontBlocks,
  applyThemeBlock,
  fontPackagesOf,
  hasPointerRule,
  renderFontImports,
  renderFontTheme,
  renderStylesheet,
  renderThemeBlock,
  resolveFonts,
  resolveTokens,
} from './css.js';
import { ACCENT_COLOR_IDS, BASE_COLOR_IDS, FONTS, POINTER_SELECTOR, themesFor } from './options.js';
import { neutral } from '../themes/theme-definitions.js';

const B = decodePreset('Z6KtfCaQt'); // lyra + mauve + emerald + JetBrains Mono + Phosphor + inverted translucent
const C = decodePreset('ZK4OZp6bW'); // sera + taupe + rose chart + Playfair over Inter + HugeIcons + bold

const REQUIRED_TOKENS = [
  'background',
  'foreground',
  'card',
  'card-foreground',
  'popover',
  'popover-foreground',
  'primary',
  'primary-foreground',
  'secondary',
  'secondary-foreground',
  'muted',
  'muted-foreground',
  'accent',
  'accent-foreground',
  'destructive',
  'destructive-foreground',
  'border',
  'input',
  'ring',
  'chart-1',
  'chart-2',
  'chart-3',
  'chart-4',
  'chart-5',
  'sidebar',
  'sidebar-foreground',
  'sidebar-primary',
  'sidebar-primary-foreground',
  'sidebar-accent',
  'sidebar-accent-foreground',
  'sidebar-border',
  'sidebar-ring',
];

describe('resolveTokens', () => {
  it('gives every base color and theme a complete token set, in both modes', () => {
    for (const baseColor of BASE_COLOR_IDS) {
      for (const theme of themesFor(baseColor)) {
        const { light, dark } = resolveTokens(normalizeDesign({ baseColor, theme, chartColor: theme }));

        for (const token of REQUIRED_TOKENS) {
          expect(light[token]).toBeTruthy();
          expect(dark[token]).toBeTruthy();
        }
        expect(light['radius']).toBe('0.625rem');
      }
    }
  });

  it('has 7 base colors and 17 accents', () => {
    expect(BASE_COLOR_IDS).toHaveLength(7);
    expect(ACCENT_COLOR_IDS).toHaveLength(17);
  });

  it('writes the neutral palette of shadcn for the default design', () => {
    const { light, dark } = resolveTokens(DEFAULT_DESIGN);

    expect(light).toMatchObject({
      background: 'oklch(1 0 0)',
      primary: 'oklch(0.205 0 0)',
      'destructive-foreground': 'oklch(0.985 0 0)',
      'chart-1': 'oklch(0.87 0 0)',
    });
    expect(dark).toMatchObject({ background: 'oklch(0.145 0 0)', primary: 'oklch(0.922 0 0)' });
  });

  it('lays an accent over the base color', () => {
    const { light } = resolveTokens(normalizeDesign({ theme: 'blue', chartColor: 'blue' }));

    expect(light['primary']).toBe('oklch(0.488 0.243 264.376)');
    // untouched by the accent
    expect(light['background']).toBe('oklch(1 0 0)');
    expect(light['border']).toBe('oklch(0.922 0 0)');
  });

  it('takes only the chart ramp from the chart color', () => {
    const { light } = resolveTokens(normalizeDesign({ theme: 'blue', chartColor: 'amber' }));

    expect(light['primary']).toBe('oklch(0.488 0.243 264.376)'); // blue's
    expect(light['chart-1']).toBe('oklch(0.879 0.169 91.605)'); // amber's
  });

  it('takes the chart ramp of a base color too', () => {
    const { light } = resolveTokens(normalizeDesign({ baseColor: 'stone', theme: 'stone', chartColor: 'stone' }));

    expect(light['chart-1']).toBe('oklch(0.869 0.005 56.366)');
  });

  describe('the bold accent', () => {
    it('paints accent with the primary color in both modes', () => {
      const { light, dark } = resolveTokens(
        normalizeDesign({ theme: 'emerald', chartColor: 'emerald', menuAccent: 'bold' }),
      );

      expect(light['accent']).toBe(light['primary']);
      expect(light['accent-foreground']).toBe(light['primary-foreground']);
      expect(dark['accent']).toBe(dark['primary']);
      expect(dark['accent-foreground']).toBe(dark['primary-foreground']);
    });

    it('leaves the subtle wash alone', () => {
      const { light } = resolveTokens(DEFAULT_DESIGN);

      expect(light['accent']).toBe('oklch(0.97 0 0)');
    });
  });

  describe('the radius', () => {
    it.each([
      ['default', '0.625rem'],
      ['none', '0rem'],
      ['small', '0.45rem'],
      ['medium', '0.625rem'],
      ['large', '0.875rem'],
    ] as const)('writes %s as %s', (radius, css) => {
      expect(resolveTokens(normalizeDesign({ radius })).light['radius']).toBe(css);
    });

    it('is none under lyra and sera whatever the radius asked for', () => {
      expect(resolveTokens(normalizeDesign({ style: 'lyra', radius: 'large' })).light['radius']).toBe('0rem');
      expect(resolveTokens(normalizeDesign({ style: 'sera' })).light['radius']).toBe('0rem');
    });
  });

  it('rejects a base color the data does not have', () => {
    expect(() => resolveTokens({ ...DEFAULT_DESIGN, baseColor: 'nope' as never })).toThrow(/nope/);
  });
});

describe('the base colors written the old way', () => {
  it('matches the hand-written neutral theme token for token, except where shadcn moved on', () => {
    // The CLI has always written the blue chart ramp for `neutral`; the design data uses the gray one
    // of shadcn's registry. Everything that is not a chart token must agree.
    const handWritten = neutral('@/shared/core');
    const { light, dark } = resolveTokens(DEFAULT_DESIGN);

    for (const [mode, tokens] of [
      [':root', light],
      ['.dark', dark],
    ] as const) {
      const block = handWritten.slice(
        handWritten.indexOf(`${mode} {`),
        handWritten.indexOf('\n}', handWritten.indexOf(`${mode} {`)),
      );
      for (const [name, value] of Object.entries(tokens)) {
        if (name.startsWith('chart-') || name === 'radius') continue;
        expect(block).toContain(`--${name}: ${value};`);
      }
    }
  });
});

describe('renderThemeBlock', () => {
  const block = renderThemeBlock(DEFAULT_DESIGN);

  it('is bounded by the markers', () => {
    expect(block.startsWith(THEME_START)).toBe(true);
    expect(block.endsWith(THEME_END)).toBe(true);
  });

  it('holds :root, .dark, the Tailwind mapping and the base layer — in that order', () => {
    const positions = [':root {', '.dark {', '@theme inline {', '@layer base {'].map(part => block.indexOf(part));

    expect(positions.every(position => position > 0)).toBe(true);
    expect([...positions].sort((a, b) => a - b)).toEqual(positions);
  });

  it('opens :root with the radius', () => {
    expect(block).toContain(':root {\n  --radius: 0.625rem;\n  --background: oklch(1 0 0);');
  });

  it('does not repeat the radius in .dark', () => {
    expect(block.slice(block.indexOf('.dark {'))).not.toContain('--radius:');
  });

  it('adds the pointer rule only when asked', () => {
    expect(block).not.toContain(POINTER_SELECTOR);
    expect(renderThemeBlock(DEFAULT_DESIGN, { pointer: true })).toContain(
      `${POINTER_SELECTOR} {\n    cursor: pointer;\n  }`,
    );
  });

  it('is golden for reference preset B (lyra + mauve + emerald, square corners)', () => {
    const css = renderThemeBlock(B);
    const { light, dark } = resolveTokens(B);

    expect(css).toContain('--radius: 0rem;');
    // emerald's accent over mauve's neutrals
    expect(css).toContain(`--primary: ${light['primary']};`);
    expect(light['primary']).toBe(resolveTokens(normalizeDesign({ theme: 'emerald' })).light['primary']);
    expect(light['foreground']).toBe(resolveTokens(normalizeDesign({ baseColor: 'mauve' })).light['foreground']);
    expect(light['foreground']).not.toBe(resolveTokens(DEFAULT_DESIGN).light['foreground']);
    // the menu settings are not CSS: they live in components.json
    expect(dark['background']).toBeTruthy();
    expect(css).not.toContain('inverted');
  });

  it('is golden for reference preset C (taupe, rose chart, bold accent)', () => {
    const css = renderThemeBlock(C);
    const { light } = resolveTokens(C);

    expect(light['accent']).toBe(light['primary']);
    expect(css).toContain(`--accent: ${light['primary']};`);
    expect(css).toContain(`--chart-3: ${resolveTokens(normalizeDesign({ chartColor: 'rose' })).light['chart-3']};`);
    expect(light['primary']).toBe(
      resolveTokens(normalizeDesign({ baseColor: 'taupe', theme: 'taupe' })).light['primary'],
    );
  });
});

describe('the fonts', () => {
  it('has 26 fonts: 17 sans, 2 mono, 7 serif', () => {
    expect(FONTS).toHaveLength(26);
    expect(FONTS.filter(font => font.kind === 'sans')).toHaveLength(17);
    expect(FONTS.filter(font => font.kind === 'mono')).toHaveLength(2);
    expect(FONTS.filter(font => font.kind === 'serif')).toHaveLength(7);
  });

  it('self-hosts everything through fontsource, Instrument Serif as the only static one', () => {
    for (const font of FONTS) {
      expect(font.package).toMatch(font.id === 'instrument-serif' ? /^@fontsource\// : /^@fontsource-variable\//);
      expect(font.package.endsWith(font.id)).toBe(true);
    }
    expect(FONTS.find(font => font.id === 'instrument-serif')?.family).toBe("'Instrument Serif', serif");
    expect(FONTS.find(font => font.id === 'inter')?.family).toBe("'Inter Variable', sans-serif");
    expect(FONTS.find(font => font.id === 'jetbrains-mono')?.family).toBe("'JetBrains Mono Variable', monospace");
  });

  it('resolves the body and heading fonts of a design', () => {
    const { body, heading } = resolveFonts(C);

    expect(body.id).toBe('inter');
    expect(heading?.id).toBe('playfair-display');
    expect(resolveFonts(DEFAULT_DESIGN).heading).toBeNull();
  });

  it('lists each package once', () => {
    expect(fontPackagesOf(DEFAULT_DESIGN)).toEqual(['@fontsource-variable/inter']);
    expect(fontPackagesOf(C)).toEqual(['@fontsource-variable/inter', '@fontsource-variable/playfair-display']);
    expect(fontPackagesOf(B)).toEqual(['@fontsource-variable/jetbrains-mono']);
  });

  it('writes @import lines inside their markers', () => {
    expect(renderFontImports(C)).toBe(
      [
        FONT_IMPORTS_START,
        "@import '@fontsource-variable/inter';",
        "@import '@fontsource-variable/playfair-display';",
        FONT_IMPORTS_END,
      ].join('\n'),
    );
  });

  it('makes the heading inherit the body font when no heading font is chosen', () => {
    expect(renderFontTheme(DEFAULT_DESIGN)).toBe(
      [
        FONT_THEME_START,
        '@theme inline {',
        "  --font-sans: 'Inter Variable', sans-serif;",
        '  --font-heading: var(--font-sans);',
        '}',
        FONT_THEME_END,
      ].join('\n'),
    );
  });

  it('applies a distinct heading font to the headings', () => {
    const css = renderFontTheme(C);

    expect(css).toContain("--font-sans: 'Inter Variable', sans-serif;");
    expect(css).toContain("--font-heading: 'Playfair Display Variable', serif;");
    expect(css).toContain('h1,\n  h2,\n  h3,\n  h4,\n  h5,\n  h6 {\n    font-family: var(--font-heading);');
  });

  it('puts a mono body font on --font-sans, which is what the page body reads', () => {
    expect(renderFontTheme(B)).toContain("--font-sans: 'JetBrains Mono Variable', monospace;");
  });

  it('rejects a font the data does not know', () => {
    expect(() => resolveFonts({ ...DEFAULT_DESIGN, font: 'comic-sans' })).toThrow(/comic-sans/);
  });
});

describe('renderStylesheet', () => {
  const css = renderStylesheet(C, { corePath: '@/shared/core' });

  it('keeps the font imports with the other imports, before the first rule', () => {
    const lastImport = css.lastIndexOf('@import');
    const firstRule = css.indexOf('@plugin');

    expect(css.indexOf("@import 'tailwindcss';")).toBeLessThan(css.indexOf("@import '@fontsource-variable/inter';"));
    expect(lastImport).toBeLessThan(firstRule);
  });

  it('is the Tailwind setup, the theme and the fonts, in that order', () => {
    const order = [
      "@import 'tailwindcss';",
      "@import '@/shared/core/css/zard';",
      FONT_IMPORTS_START,
      '@plugin "tailwindcss-animate";',
      '@custom-variant dark',
      THEME_START,
      FONT_THEME_START,
    ].map(part => css.indexOf(part));

    expect(order.every(position => position >= 0)).toBe(true);
    expect([...order].sort((a, b) => a - b)).toEqual(order);
  });

  it('ends with a newline and has no unbalanced braces', () => {
    expect(css.endsWith('\n')).toBe(true);
    expect(css.split('{').length).toBe(css.split('}').length);
  });

  it('is golden for the default design', () => {
    const lines = renderStylesheet(DEFAULT_DESIGN, { corePath: '@/shared/core' }).split('\n');

    expect(lines.slice(0, 9)).toEqual([
      '@layer ng-icon, theme, base, components, utilities;',
      "@import 'tailwindcss';",
      "@import '@/shared/core/css/zard';",
      FONT_IMPORTS_START,
      "@import '@fontsource-variable/inter';",
      FONT_IMPORTS_END,
      '@plugin "tailwindcss-animate";',
      '',
      '@custom-variant dark (&:is(.dark *));',
    ]);
  });
});

describe('applyThemeBlock', () => {
  const USER_RULES = `\n.my-card {\n  padding: 1px;\n}\n\n:root {\n  --brand: red;\n}\n`;

  it('replaces the marked region and leaves everything around it byte for byte', () => {
    const before = renderStylesheet(DEFAULT_DESIGN, { corePath: '@/shared/core' });
    const file = `${before}${USER_RULES}`;

    const updated = applyThemeBlock(file, renderThemeBlock(C));

    expect(updated).toContain(renderThemeBlock(C));
    expect(updated).not.toContain(renderThemeBlock(DEFAULT_DESIGN));
    expect(updated.endsWith(USER_RULES)).toBe(true);
    expect(updated.startsWith(before.slice(0, before.indexOf(THEME_START)))).toBe(true);
    // the font regions were not part of it
    expect(updated).toContain(renderFontTheme(DEFAULT_DESIGN));
  });

  it('is idempotent', () => {
    const file = renderStylesheet(C, { corePath: '@/shared/core' }) + USER_RULES;
    const once = applyThemeBlock(file, renderThemeBlock(B));

    expect(applyThemeBlock(once, renderThemeBlock(B))).toBe(once);
  });

  it('replaces an unmarked theme written by an earlier init, keeping the user rules', () => {
    const legacy = neutral('@/shared/core').trim() + USER_RULES;

    const updated = applyThemeBlock(legacy, renderThemeBlock(B));

    expect(updated).toContain(THEME_START);
    // one theme, not two
    expect(updated.match(/--background:/g)).toHaveLength(2); // :root and .dark
    expect(updated.match(/@theme inline/g)).toHaveLength(1);
    expect(updated.match(/@layer base/g)).toHaveLength(1);
    // the user's own :root rule, which has no theme tokens, is not mistaken for the theme
    expect(updated).toContain(':root {\n  --brand: red;\n}');
    expect(updated).toContain('.my-card {\n  padding: 1px;\n}');
    // Tailwind setup untouched
    expect(updated).toContain("@import 'tailwindcss';");
  });

  it('inserts the block after the Tailwind setup when the file has no theme', () => {
    const file = `@import 'tailwindcss';\n@plugin "tailwindcss-animate";\n\n@custom-variant dark (&:is(.dark *));\n\n.mine { color: red; }\n`;

    const updated = applyThemeBlock(file, renderThemeBlock(DEFAULT_DESIGN));

    expect(updated.indexOf(THEME_START)).toBeGreaterThan(updated.indexOf('@custom-variant'));
    expect(updated.indexOf(THEME_START)).toBeLessThan(updated.indexOf('.mine'));
  });

  it('appends to a file with no Tailwind setup at all', () => {
    const updated = applyThemeBlock('.mine { color: red; }\n', renderThemeBlock(DEFAULT_DESIGN));

    expect(updated.startsWith('.mine { color: red; }')).toBe(true);
    expect(updated).toContain(THEME_END);
  });

  it('does not take braces inside comments and strings for rules', () => {
    const file = `/* } { */\n@import 'tailwindcss';\n.x::after { content: "}"; }\n${neutral('@/c').trim()}\n.y { color: blue; }\n`;

    const updated = applyThemeBlock(file, renderThemeBlock(B));

    expect(updated).toContain('.x::after { content: "}"; }');
    expect(updated).toContain('.y { color: blue; }');
    expect(updated.match(/@theme inline/g)).toHaveLength(1);
  });
});

describe('applyFontBlocks', () => {
  const imports = renderFontImports(C);
  const theme = renderFontTheme(C);

  it('replaces the two marked regions and nothing else', () => {
    const before = renderStylesheet(DEFAULT_DESIGN, { corePath: '@/shared/core' });
    const file = `${before}\n.mine { color: red; }\n`;

    const updated = applyFontBlocks(file, imports, theme);

    expect(updated).toContain(imports);
    expect(updated).toContain(theme);
    expect(updated).not.toContain("--font-sans: 'Inter Variable', sans-serif;\n  --font-heading: var(--font-sans);");
    expect(updated).toContain(renderThemeBlock(DEFAULT_DESIGN));
    expect(updated.endsWith('\n.mine { color: red; }\n')).toBe(true);
  });

  it('adds the imports after the last @import and the variables after the theme block', () => {
    const file = `@layer a;\n@import 'tailwindcss';\n@import './typeset.css';\n@plugin "x";\n\n${renderThemeBlock(DEFAULT_DESIGN)}\n\n.mine {}\n`;

    const updated = applyFontBlocks(file, imports, theme);

    expect(updated.indexOf(FONT_IMPORTS_START)).toBeGreaterThan(updated.indexOf("@import './typeset.css';"));
    expect(updated.indexOf(FONT_IMPORTS_START)).toBeLessThan(updated.indexOf('@plugin'));
    expect(updated.indexOf(FONT_THEME_START)).toBeGreaterThan(updated.indexOf(THEME_END));
    expect(updated.indexOf(FONT_THEME_START)).toBeLessThan(updated.indexOf('.mine'));
  });

  it('is idempotent', () => {
    const file = renderStylesheet(DEFAULT_DESIGN, { corePath: '@/shared/core' });
    const once = applyFontBlocks(file, imports, theme);

    expect(applyFontBlocks(once, imports, theme)).toBe(once);
  });

  it('drops the heading rule when the heading goes back to inherit', () => {
    const withHeading = renderStylesheet(C, { corePath: '@/shared/core' });

    const updated = applyFontBlocks(withHeading, renderFontImports(DEFAULT_DESIGN), renderFontTheme(DEFAULT_DESIGN));

    expect(updated).not.toContain('font-family: var(--font-heading)');
    expect(updated).not.toContain('playfair');
  });
});

describe('hasPointerRule', () => {
  it('sees the rule inside the theme region only', () => {
    expect(hasPointerRule(renderThemeBlock(DEFAULT_DESIGN, { pointer: true }))).toBe(true);
    expect(hasPointerRule(renderThemeBlock(DEFAULT_DESIGN))).toBe(false);
    // a user's own copy of the rule, outside the managed block, is theirs
    expect(hasPointerRule(`${renderThemeBlock(DEFAULT_DESIGN)}\n${POINTER_SELECTOR} { cursor: pointer; }`)).toBe(false);
  });
});
