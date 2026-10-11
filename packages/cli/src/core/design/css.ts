/**
 * A design, as the CSS that carries it.
 *
 * Everything here is string in, string out: the CLI writes the result into a project's stylesheet,
 * and the docs site can show the very same text in its Theme tab. The generated text is divided by
 * marker comments into a few regions — the theme tokens, the font imports, the font variables — so
 * that `zard-cli apply` can later replace one region and leave every other byte of the file alone,
 * user rules included.
 */

import { type DesignConfig } from './config.js';
import { BASE_RADIUS, FONTS, INHERIT_FONT, POINTER_SELECTOR, RADII, fontById, type FontOption } from './options.js';
import { BASE_COLOR_TOKENS, THEME_COLOR_TOKENS, type ThemeTokenSet, type ThemeTokens } from './theme-data.js';

// --- Data -------------------------------------------------------------------------------------

/**
 * The data a design is resolved against. The bundled copy is the floor; the registry publishes the
 * same shape as `design.json`, which lets a token or a font package be corrected without a release.
 */
export interface DesignData {
  readonly baseColors: Readonly<Record<string, ThemeTokenSet>>;
  readonly accents: Readonly<Record<string, ThemeTokenSet>>;
  readonly fonts: readonly FontOption[];
}

export const BUNDLED_DESIGN_DATA: DesignData = {
  baseColors: BASE_COLOR_TOKENS,
  accents: THEME_COLOR_TOKENS,
  fonts: FONTS,
};

/** The order tokens are written in; anything not listed follows, in source order. */
const TOKEN_ORDER = [
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

const CHART_KEYS = ['chart-1', 'chart-2', 'chart-3', 'chart-4', 'chart-5'];

/** The light and dark tokens a design resolves to. `radius` is light-only and rides along there. */
export interface ResolvedTokens {
  readonly light: ThemeTokens;
  readonly dark: ThemeTokens;
}

/** The tokens of a color — a base color's complete set, or an accent's overrides. */
function tokensOf(id: string, data: DesignData): ThemeTokenSet | undefined {
  return data.baseColors[id] ?? data.accents[id];
}

/**
 * Base color, then theme, then chart ramp, then bold accent, then radius — each layer overriding the
 * one before it, in the order shadcn composes them.
 */
export function resolveTokens(design: DesignConfig, data: DesignData = BUNDLED_DESIGN_DATA): ResolvedTokens {
  const base = data.baseColors[design.baseColor];
  if (!base) throw new Error(`Unknown base color "${design.baseColor}".`);

  const light: Record<string, string> = { ...base.light };
  const dark: Record<string, string> = { ...base.dark };

  // A theme equal to the base color is "no accent": the base set already is the theme.
  const theme = design.theme !== design.baseColor ? data.accents[design.theme] : undefined;
  if (theme) {
    Object.assign(light, theme.light);
    Object.assign(dark, theme.dark);
  }

  const chart = tokensOf(design.chartColor, data);
  if (chart) {
    for (const key of CHART_KEYS) {
      if (chart.light[key]) light[key] = chart.light[key];
      if (chart.dark[key]) dark[key] = chart.dark[key];
    }
  }

  // "Bold" paints hover and selected states with the primary color instead of the neutral wash.
  if (design.menuAccent === 'bold') {
    for (const mode of [light, dark]) {
      if (mode['primary']) mode['accent'] = mode['primary'];
      if (mode['primary-foreground']) mode['accent-foreground'] = mode['primary-foreground'];
    }
  }

  light['radius'] = RADII.find(radius => radius.value === design.radius)?.css ?? BASE_RADIUS;

  return { light, dark };
}

function declarations(tokens: ThemeTokens): string {
  const ordered = [
    ...TOKEN_ORDER.filter(key => key in tokens),
    ...Object.keys(tokens).filter(key => key !== 'radius' && !TOKEN_ORDER.includes(key)),
  ];
  // `--radius` leads the block, as it always has in the themes zard writes.
  const radius = tokens['radius'] ? [`  --radius: ${tokens['radius']};`] : [];

  return [...radius, ...ordered.map(key => `  --${key}: ${tokens[key]};`)].join('\n');
}

// --- Fixed fragments (shared with the hand-written themes) ------------------------------------

export const tailwindHead = (corePath: string): string => `
@layer ng-icon, theme, base, components, utilities;
@import 'tailwindcss';
@import '${corePath}/css/zard';
@plugin "tailwindcss-animate";

@custom-variant dark (&:is(.dark *));
`;

export const INLINE_THEME = `
@theme inline {
  --color-background: var(--background);
  --color-foreground: var(--foreground);
  --color-card: var(--card);
  --color-card-foreground: var(--card-foreground);
  --color-popover: var(--popover);
  --color-popover-foreground: var(--popover-foreground);
  --color-primary: var(--primary);
  --color-primary-foreground: var(--primary-foreground);
  --color-secondary: var(--secondary);
  --color-secondary-foreground: var(--secondary-foreground);
  --color-muted: var(--muted);
  --color-muted-foreground: var(--muted-foreground);
  --color-accent: var(--accent);
  --color-accent-foreground: var(--accent-foreground);
  --color-destructive: var(--destructive);
  --color-destructive-foreground: var(--destructive-foreground);
  --color-border: var(--border);
  --color-input: var(--input);
  --color-ring: var(--ring);
  --color-chart-1: var(--chart-1);
  --color-chart-2: var(--chart-2);
  --color-chart-3: var(--chart-3);
  --color-chart-4: var(--chart-4);
  --color-chart-5: var(--chart-5);
  --radius-sm: calc(var(--radius) - 4px);
  --radius-md: calc(var(--radius) - 2px);
  --radius-lg: var(--radius);
  --radius-xl: calc(var(--radius) + 4px);
  --color-sidebar: var(--sidebar);
  --color-sidebar-foreground: var(--sidebar-foreground);
  --color-sidebar-primary: var(--sidebar-primary);
  --color-sidebar-primary-foreground: var(--sidebar-primary-foreground);
  --color-sidebar-accent: var(--sidebar-accent);
  --color-sidebar-accent-foreground: var(--sidebar-accent-foreground);
  --color-sidebar-border: var(--sidebar-border);
  --color-sidebar-ring: var(--sidebar-ring);
}
`;

const LAYER_BASE_OPEN = `
@layer base {
  * {
    @apply border-border outline-ring/50;
  }
  body {
    @apply bg-background text-foreground;
  }
`;

const LAYER_BASE_SPIN = `
  input[type="number"]::-webkit-inner-spin-button,
  input[type="number"]::-webkit-outer-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }

  input[type="number"] {
    -moz-appearance: textfield;
    appearance: textfield; /* Added for general compatibility */
  }
}
`;

/** The base layer every theme ends with; `pointer` adds the cursor rule. */
export function layerBase(pointer = false): string {
  if (!pointer) return LAYER_BASE_OPEN + LAYER_BASE_SPIN;

  return `${LAYER_BASE_OPEN}
  ${POINTER_SELECTOR} {
    cursor: pointer;
  }
${LAYER_BASE_SPIN}`;
}

// --- Regions ----------------------------------------------------------------------------------

export const THEME_START = '/* zard:theme:start — managed by zard-cli, rules below this block are yours */';
export const THEME_END = '/* zard:theme:end */';
export const FONT_IMPORTS_START = '/* zard:font-imports:start */';
export const FONT_IMPORTS_END = '/* zard:font-imports:end */';
export const FONT_THEME_START = '/* zard:fonts:start */';
export const FONT_THEME_END = '/* zard:fonts:end */';

/** The `:root` and `.dark` blocks of a design. */
export function renderTokenBlocks(design: DesignConfig, data?: DesignData): string {
  const { light, dark } = resolveTokens(design, data);
  return `:root {
${declarations(light)}
}

.dark {
${declarations(dark)}
}`;
}

/** The `:root`, `.dark`, `@theme inline` and base layer — everything that colors the app. */
export function renderThemeBlock(design: DesignConfig, options: { pointer?: boolean; data?: DesignData } = {}): string {
  return [
    THEME_START,
    '',
    renderTokenBlocks(design, options.data),
    INLINE_THEME,
    layerBase(options.pointer ?? false).trimStart(),
    THEME_END,
  ].join('\n');
}

/** The font a design resolves to; a name the data does not know is an error, not a silent default. */
export function resolveFonts(
  design: DesignConfig,
  data: DesignData = BUNDLED_DESIGN_DATA,
): { body: FontOption; heading: FontOption | null } {
  const find = (id: string): FontOption => {
    const font = data.fonts.find(candidate => candidate.id === id) ?? fontById(id);
    if (!font) throw new Error(`Unknown font "${id}".`);
    return font;
  };

  return {
    body: find(design.font),
    heading: design.fontHeading === INHERIT_FONT ? null : find(design.fontHeading),
  };
}

/** The distinct npm packages a design's fonts need. */
export function fontPackagesOf(design: DesignConfig, data?: DesignData): string[] {
  const { body, heading } = resolveFonts(design, data);
  return [...new Set([body.package, ...(heading ? [heading.package] : [])])];
}

/** `@import`s for the font packages — they must sit with the stylesheet's other imports. */
export function renderFontImports(design: DesignConfig, data?: DesignData): string {
  return [FONT_IMPORTS_START, ...fontPackagesOf(design, data).map(pkg => `@import '${pkg}';`), FONT_IMPORTS_END].join(
    '\n',
  );
}

/** `--font-sans` and `--font-heading`, plus the rule that applies the heading font to headings. */
export function renderFontTheme(design: DesignConfig, data?: DesignData): string {
  const { body, heading } = resolveFonts(design, data);

  const lines = [
    FONT_THEME_START,
    '@theme inline {',
    `  --font-sans: ${body.family};`,
    `  --font-heading: ${heading ? heading.family : 'var(--font-sans)'};`,
    '}',
  ];

  if (heading) {
    lines.push(
      '',
      '@layer base {',
      '  h1,',
      '  h2,',
      '  h3,',
      '  h4,',
      '  h5,',
      '  h6 {',
      '    font-family: var(--font-heading);',
      '  }',
      '}',
    );
  }

  lines.push(FONT_THEME_END);
  return lines.join('\n');
}

export interface StylesheetOptions {
  /** Import path to the core stylesheets (`@/shared/core`, resolved relative to the file). */
  corePath: string;
  pointer?: boolean;
  data?: DesignData;
}

/** A complete global stylesheet for a design: what `init --preset` writes. */
export function renderStylesheet(design: DesignConfig, options: StylesheetOptions): string {
  const head = tailwindHead(options.corePath)
    .trim()
    .replace(/^(@import '[^']*\/css\/zard';)$/m, `$1\n${renderFontImports(design, options.data)}`);

  return `${head}

${renderThemeBlock(design, options)}

${renderFontTheme(design, options.data)}
`;
}

// --- Editing an existing stylesheet -----------------------------------------------------------

interface Span {
  readonly start: number;
  readonly end: number;
  /** The text before `{` or `;` — the selector or at-rule name. */
  readonly head: string;
  readonly block: boolean;
}

/**
 * The top-level rules of a stylesheet, as character ranges.
 *
 * A scanner, not a parser: it only needs to know where a rule starts and ends, so it tracks braces
 * and steps over comments and strings. Anything it cannot make sense of simply becomes part of the
 * rule it is in, which is the safe direction for a tool that edits files it does not own.
 */
function topLevelRules(css: string): Span[] {
  const spans: Span[] = [];
  let depth = 0;
  let start = -1;
  let headEnd = -1;

  for (let index = 0; index < css.length; index++) {
    const char = css[index]!;
    const next = css[index + 1];

    if (char === '/' && next === '*') {
      const close = css.indexOf('*/', index + 2);
      index = close === -1 ? css.length : close + 1;
      continue;
    }

    if (char === '"' || char === "'") {
      let cursor = index + 1;
      while (cursor < css.length && css[cursor] !== char && css[cursor] !== '\n')
        cursor += css[cursor] === '\\' ? 2 : 1;
      index = cursor;
      continue;
    }

    if (depth === 0 && start === -1 && !/\s/.test(char)) start = index;

    if (char === '{') {
      if (depth === 0) headEnd = index;
      depth++;
    } else if (char === '}') {
      depth = Math.max(0, depth - 1);
      if (depth === 0 && start !== -1) {
        spans.push({ start, end: index + 1, head: css.slice(start, headEnd).trim(), block: true });
        start = -1;
      }
    } else if (char === ';' && depth === 0 && start !== -1) {
      spans.push({ start, end: index + 1, head: css.slice(start, index).trim(), block: false });
      start = -1;
    }
  }

  return spans;
}

/** Whether `css` has both markers of a region, in order. */
function hasRegion(css: string, start: string, end: string): boolean {
  const from = css.indexOf(start);
  return from !== -1 && css.indexOf(end, from) !== -1;
}

function replaceRegion(css: string, start: string, end: string, replacement: string): string {
  const from = css.indexOf(start);
  const to = css.indexOf(end, from) + end.length;

  return css.slice(0, from) + replacement + css.slice(to);
}

function removeRange(css: string, from: number, to: number): string {
  // Take the line break after the rule with it, and one blank line before, so repeated edits do not
  // pile up empty lines.
  let end = to;
  while (css[end] === '\r' || css[end] === '\n') end++;
  return css.slice(0, from) + css.slice(end);
}

/**
 * The rules a stylesheet written before the markers existed uses for the theme: `:root` and `.dark`
 * that define the color tokens, the `@theme inline` that maps them to Tailwind, and the base layer
 * that applies the border and body colors. Matching on content, not just selector, keeps a user's
 * own `:root` rule out of it.
 */
function isLegacyThemeRule(css: string, span: Span): boolean {
  if (!span.block) return false;
  const body = css.slice(span.start, span.end);

  if (span.head === ':root' || span.head === '.dark') return body.includes('--background');
  if (span.head === '@theme inline') return body.includes('--color-background');
  if (span.head === '@layer base') return body.includes('border-border') && body.includes('bg-background');

  return false;
}

/**
 * Puts a theme block into a stylesheet: in place of the previous one when it is there (marked, or an
 * unmarked theme written by an earlier `init`), otherwise after the Tailwind setup.
 */
export function applyThemeBlock(css: string, block: string): string {
  if (hasRegion(css, THEME_START, THEME_END)) return replaceRegion(css, THEME_START, THEME_END, block);

  const legacy = topLevelRules(css).filter(span => isLegacyThemeRule(css, span));
  if (legacy.length > 0) {
    const first = legacy[0]!;
    let result = css;
    // Remove from the end so earlier offsets stay valid.
    for (const span of [...legacy].reverse()) {
      if (span !== first) result = removeRange(result, span.start, span.end);
    }
    return result.slice(0, first.start) + block + result.slice(first.end);
  }

  const anchor = topLevelRules(css)
    .filter(span => span.head.startsWith('@custom-variant') || span.head.startsWith('@plugin'))
    .pop();
  if (anchor) return `${css.slice(0, anchor.end)}\n\n${block}${css.slice(anchor.end)}`;

  return `${css.trimEnd()}\n\n${block}\n`;
}

/**
 * Puts the font regions into a stylesheet. The imports go with the other `@import`s (CSS requires
 * them first); the variables go right after the theme block, or at the end when there is none.
 */
export function applyFontBlocks(css: string, imports: string, theme: string): string {
  let result = css;

  if (hasRegion(result, FONT_IMPORTS_START, FONT_IMPORTS_END)) {
    result = replaceRegion(result, FONT_IMPORTS_START, FONT_IMPORTS_END, imports);
  } else {
    const lastImport = topLevelRules(result)
      .filter(span => !span.block && /^@import\b/.test(span.head))
      .pop();
    result = lastImport
      ? `${result.slice(0, lastImport.end)}\n${imports}${result.slice(lastImport.end)}`
      : `${imports}\n${result}`;
  }

  if (hasRegion(result, FONT_THEME_START, FONT_THEME_END)) {
    return replaceRegion(result, FONT_THEME_START, FONT_THEME_END, theme);
  }

  const themeEnd = result.indexOf(THEME_END);
  if (themeEnd !== -1) {
    const at = themeEnd + THEME_END.length;
    return `${result.slice(0, at)}\n\n${theme}${result.slice(at)}`;
  }

  return `${result.trimEnd()}\n\n${theme}\n`;
}

/** Whether the theme region in a stylesheet carries the pointer-cursor rule. */
export function hasPointerRule(css: string): boolean {
  const from = css.indexOf(THEME_START);
  const to = from === -1 ? -1 : css.indexOf(THEME_END, from);
  const region = from === -1 || to === -1 ? css : css.slice(from, to);

  return region.includes(POINTER_SELECTOR);
}
