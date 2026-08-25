/**
 * Regenerates the theming page's base-color table from the CLI's theme definitions.
 *
 * `base-colors.data.ts` documents itself as "every value here is the value the CLI
 * writes, verbatim" — but nothing enforced that, and it drifted: the page showed the
 * old multi-hue chart palette long after the CLI moved to the blue ramp, and it
 * carried a `destructive-foreground` token no theme ever defined.
 *
 * The values now come from `theme-definitions.ts` itself, so the page cannot say
 * something different from what `zard-cli init` writes.
 *
 *   npm run generate:theme-tokens
 */

import * as fs from 'fs';
import * as path from 'path';

import * as themes from '../packages/cli/src/core/themes/theme-definitions';

const OUTPUT = path.resolve(__dirname, '../apps/web/src/app/domain/pages/theming/data/base-colors.data.ts');
const DOCS_STYLESHEET = path.resolve(__dirname, '../apps/web/src/styles.css');

const LABELS: Record<string, string> = {
  neutral: 'Neutral',
  stone: 'Stone',
  zinc: 'Zinc',
  gray: 'Gray',
  slate: 'Slate',
};

/** The declarations inside one CSS block, in source order. */
function blockTokens(css: string, selector: string): Record<string, string> {
  const start = css.indexOf(`${selector} {`);
  if (start === -1) throw new Error(`No "${selector}" block in the generated theme.`);

  const end = css.indexOf('\n}', start);
  if (end === -1) throw new Error(`Unterminated "${selector}" block in the generated theme.`);

  const tokens: Record<string, string> = {};
  for (const match of css.slice(start, end).matchAll(/^\s*--([a-z0-9-]+):\s*([^;]+);/gm)) {
    tokens[match[1]] = match[2].trim();
  }
  return tokens;
}

/** Quotes a token name only when it is not a valid bare object key. */
const key = (name: string) => (/^[a-z][a-zA-Z0-9]*$/.test(name) ? name : `'${name}'`);

function renderTokens(tokens: Record<string, string>, indent: string): string {
  return Object.entries(tokens)
    .map(([name, value]) => `${indent}${key(name)}: '${value}',`)
    .join('\n');
}

const blocks = themes.availableThemes.map(id => {
  const build = (themes as Record<string, unknown>)[id];
  if (typeof build !== 'function') throw new Error(`theme-definitions.ts exports no "${id}" theme.`);

  // The corePath only affects an @import line, which this file does not read.
  const css = (build as (corePath: string) => string)('@/shared/core');
  const light = blockTokens(css, ':root');
  const dark = blockTokens(css, '.dark');

  const radius = light['radius'];
  if (!radius) throw new Error(`The "${id}" theme defines no --radius.`);
  delete light['radius'];

  return `  {
    id: '${id}',
    label: '${LABELS[id] ?? id}',
    radius: '${radius}',
    light: {
${renderTokens(light, '      ')}
    },
    dark: {
${renderTokens(dark, '      ')}
    },
  },`;
});

const output = `import type { BaseColorTheme } from '../models/theming.model';

/**
 * The five base colors \`zard-cli init\` can write.
 *
 * GENERATED — do not edit. Run \`npm run generate:theme-tokens\` after changing
 * \`packages/cli/src/core/themes/theme-definitions.ts\`; the build regenerates it too.
 */
export const BASE_COLORS: BaseColorTheme[] = [
${blocks.join('\n')}
];
`;

/**
 * The docs site keeps its own copy of the tokens in `styles.css` — it adds docs-only
 * ones (surface, code, selection) on top. Only the shared ones have to agree; a
 * mismatch means the site is not rendering what `zard-cli init` writes.
 */
function checkDocsStylesheet(): void {
  const css = (themes as Record<string, unknown>)['neutral'] as (corePath: string) => string;
  const reference = css('@/shared/core');
  const stylesheet = fs.readFileSync(DOCS_STYLESHEET, 'utf8');

  const drift: string[] = [];
  for (const selector of [':root', '.dark']) {
    const expected = blockTokens(reference, selector);
    const actual = blockTokens(stylesheet, selector);

    for (const [name, value] of Object.entries(expected)) {
      if (actual[name] === undefined) drift.push(`${selector} is missing --${name} (${value})`);
      else if (actual[name] !== value) drift.push(`${selector} --${name}: ${actual[name]} — the CLI writes ${value}`);
    }
  }

  if (drift.length > 0) {
    console.error(`\n✖ apps/web/src/styles.css has drifted from the neutral theme:\n`);
    for (const line of drift) console.error(`  ${line}`);
    console.error('');
    process.exit(1);
  }

  console.log('✔ the docs stylesheet matches the neutral theme');
}

const previous = fs.existsSync(OUTPUT) ? fs.readFileSync(OUTPUT, 'utf8') : '';

if (previous === output) {
  console.log(`✅ base-colors.data.ts already matches the CLI themes (${blocks.length} themes)`);
} else {
  fs.writeFileSync(OUTPUT, output);
  console.log(`✅ Regenerated base-colors.data.ts from the CLI themes (${blocks.length} themes)`);
}

checkDocsStylesheet();
