/**
 * Guards against the global scrollbar restyle coming back (task #62).
 *
 * The theme used to carry a `windowsScrollbar` constant, duplicated across four
 * files, that wrote a bare `::-webkit-scrollbar` rule with no scoping selector.
 * It repainted every scrollbar in a consumer's app — not just zard's — and
 * repainted them again on any `--muted` / `--muted-foreground` change, because it
 * painted from theme tokens. The fix collapsed the four copies to one opt-in
 * `@utility` (`scrollbar-thin` in `libs/zard/src/lib/shared/core/css/zard.css`);
 * this check keeps a future edit from reintroducing the bare selector anywhere
 * that used to carry it, and keeps the one source itself in place.
 *
 *   npm run check:scrollbar
 */

import * as fs from 'fs';
import * as path from 'path';

const ROOT = path.resolve(__dirname, '..');

/** A `::-webkit-scrollbar*` selector is fine when something scopes it — a class,
 * an element, an `&` nesting selector — on the same line. It is the problem this
 * check exists for only when it opens the line with nothing in front of it. */
const BARE_SELECTOR = /^\s*::-webkit-scrollbar/m;

/** Files that used to carry (or still could accidentally carry) the bare rule. */
const MUST_NOT_CONTAIN_BARE_SELECTOR = [
  'packages/cli/src/core/themes/theme-definitions.ts',
  'apps/web/public/documentation/setup/shared/styles.md',
  'apps/web/src/app/domain/pages/themes/services/theme-generator.service.ts',
  'apps/web/src/styles.css',
];

const ZARD_CORE_CSS = 'libs/zard/src/lib/shared/core/css/zard.css';

const problems: string[] = [];

for (const relative of MUST_NOT_CONTAIN_BARE_SELECTOR) {
  const filePath = path.join(ROOT, relative);
  const content = fs.readFileSync(filePath, 'utf8');

  if (BARE_SELECTOR.test(content)) {
    problems.push(`${relative}: a bare ::-webkit-scrollbar selector reappeared — scope it or drop it.`);
  }
}

// The one source has to still exist, scoped, and opt-in.
const zardCssPath = path.join(ROOT, ZARD_CORE_CSS);
const zardCss = fs.readFileSync(zardCssPath, 'utf8');

if (!/@utility\s+scrollbar-thin\s*\{/.test(zardCss)) {
  problems.push(
    `${ZARD_CORE_CSS}: the "scrollbar-thin" @utility is missing — it is the one source every install gets.`,
  );
} else if (BARE_SELECTOR.test(zardCss)) {
  problems.push(`${ZARD_CORE_CSS}: "scrollbar-thin" must scope its WebKit fallback with "&", not a bare selector.`);
}

if (problems.length > 0) {
  console.error('\n✖ scrollbar restyle check failed:\n');
  for (const problem of problems) console.error(`  ${problem}`);
  console.error('');
  process.exit(1);
}

console.log('✔ no bare ::-webkit-scrollbar selectors; scrollbar-thin is the one scoped source');
