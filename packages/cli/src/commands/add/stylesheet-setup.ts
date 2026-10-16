import { logger } from '@cli/utils/logger.js';
import { lineEndingOf } from '@cli/utils/source-file.js';
import { existsSync } from 'fs';
import * as fsPromises from 'fs/promises';
import * as path from 'path';

/**
 * The same text with every CSS comment blanked out.
 *
 * Spaces replace the comment rather than removing it, so every offset into the
 * result still points at the same character of the original. A commented-out
 * `@import` is a note, not a rule, and CSS ignores it — so must we, or we
 * anchor the new import to a line the browser never reads.
 */
function withoutComments(content: string): string {
  return content.replace(/\/\*[\s\S]*?\*\//g, comment => ' '.repeat(comment.length));
}

/**
 * Whether the stylesheet already imports `fileName` for real.
 *
 * It asks the same scan that decides where to anchor, so the two cannot
 * disagree: whatever counts as an import here counts as one there.
 *
 * The target has to name the file the CLI wrote next to the stylesheet, not
 * merely end with it: `tailwindcss/utilities.css` or `./legacy-utilities.css`
 * are other files, and taking them for ours would leave ours unimported.
 */
function alreadyImports(content: string, fileName: string): boolean {
  return importsTarget(content, fileName) || importsTarget(content, `./${fileName}`);
}

/** Whether a real `@import` points at exactly this target (a package specifier or a relative path). */
function importsTarget(content: string, wanted: string): boolean {
  return cssImports(withoutComments(content)).some(match => importTarget(match[0]) === wanted);
}

/** The path an `@import` rule points at, whether quoted or wrapped in `url(...)`. */
function importTarget(rule: string): string | null {
  const target = /@import\s+(?:url\(\s*)?(['"]?)([^'"()\s;]+)\1/.exec(rule);

  return target ? target[2] : null;
}

/** Every CSS `@import` in the file, in the order they appear. */
function cssImports(content: string): RegExpExecArray[] {
  // `url(...)` and the media query list are optional and run to the `;`, so the
  // pattern closes on the semicolon rather than on the quote: an
  // `@import 'x' layer(base);` has to be recognised as the last one too.
  const importRegex = /^[ \t]*@import\s[^;]*;/gm;

  const matches: RegExpExecArray[] = [];
  let match: RegExpExecArray | null;
  while ((match = importRegex.exec(content)) !== null) matches.push(match);

  return matches;
}

/**
 * Wires an installed stylesheet up by importing it into the project's global CSS.
 *
 * The file was written next to that CSS, but a file nobody imports styles
 * nothing — and the order matters: coming after the other `@import`s lets the
 * stylesheet see the theme tokens, which is where it takes colour and radius
 * from.
 *
 * Calling this twice is the same as calling it once; a repeated `add` must not
 * duplicate the line.
 */
async function importIntoGlobalCss(tailwindCssPath: string, fileName: string, label: string): Promise<void> {
  const importLine = `@import './${fileName}';`;

  if (!existsSync(tailwindCssPath)) {
    logger.warn(`${tailwindCssPath} not found. Import ${fileName} in your global stylesheet manually.`);
    return;
  }

  const content = await fsPromises.readFile(tailwindCssPath, 'utf8');

  if (alreadyImports(content, fileName)) {
    logger.info(`${label} already imported in your global stylesheet.`);
    return;
  }

  const imports = cssImports(withoutComments(content));
  const last = imports[imports.length - 1];

  // With no `@import` to anchor to there is no safe position: before a `@layer`
  // or a `@charset` the import is invalid, and guessing would corrupt the CSS
  // of whoever installed it. Better one line to copy than a broken file.
  if (!last) {
    logger.warn(`No @import found in ${tailwindCssPath}. Add \`${importLine}\` to it manually.`);
    return;
  }

  const eol = lineEndingOf(content);
  const end = last.index + last[0].length;
  const updated = content.slice(0, end) + eol + importLine + content.slice(end);

  await fsPromises.writeFile(tailwindCssPath, updated, 'utf8');
  logger.info(`${label} imported in your global stylesheet.`);
}

/**
 * Where a stylesheet sits, as an `@import` target relative to the global CSS.
 *
 * Always POSIX and always starting with `./` or `../`: a bare `components/map/map.css` would be read as a package.
 */
export function relativeImportTarget(globalCssPath: string, stylesheetPath: string): string {
  const relative = path.relative(path.dirname(globalCssPath), stylesheetPath).split(path.sep).join('/');

  return relative.startsWith('.') ? relative : `./${relative}`;
}

export type StyleImportResult = 'added' | 'present' | 'manual';

/**
 * Imports several stylesheets into the global CSS, in the order given.
 *
 * The order is part of the contract: MapLibre's own sheet has to come before the one that styles over it. A target
 * the file already imports stays where it is; a missing one goes just before the next target that is already there
 * (so the order holds), or after the last `@import` when none follows. A second call changes nothing.
 *
 * When the file cannot be edited safely — missing, or with no `@import` to anchor to — nothing is written and the
 * exact lines to paste are logged.
 */
export async function importStylesIntoGlobalCss(
  globalCssPath: string,
  targets: readonly string[],
): Promise<StyleImportResult> {
  const lines = targets.map(target => `@import '${target}';`);

  if (!existsSync(globalCssPath)) {
    logger.warn(`${globalCssPath} not found. Add these to your global stylesheet, in this order:\n${lines.join('\n')}`);
    return 'manual';
  }

  let content = await fsPromises.readFile(globalCssPath, 'utf8');
  const eol = lineEndingOf(content);
  let changed = false;

  for (let index = 0; index < targets.length; index++) {
    if (importsTarget(content, targets[index])) continue;

    const imports = cssImports(withoutComments(content));
    const last = imports[imports.length - 1];

    if (!last) {
      logger.warn(
        `No @import found in ${globalCssPath}. Add these to it manually, after any other @import:\n${lines.join('\n')}`,
      );
      return 'manual';
    }

    const next = imports.find(match => targets.slice(index + 1).includes(importTarget(match[0]) ?? ''));

    content = next
      ? content.slice(0, next.index) + lines[index] + eol + content.slice(next.index)
      : content.slice(0, last.index + last[0].length) + eol + lines[index] + content.slice(last.index + last[0].length);
    changed = true;
  }

  if (!changed) return 'present';

  await fsPromises.writeFile(globalCssPath, content, 'utf8');
  return 'added';
}

export function setupTypeset(tailwindCssPath: string): Promise<void> {
  return importIntoGlobalCss(tailwindCssPath, 'typeset.css', 'Typeset');
}

export function setupUtilities(tailwindCssPath: string): Promise<void> {
  return importIntoGlobalCss(tailwindCssPath, 'utilities.css', 'Utilities');
}
