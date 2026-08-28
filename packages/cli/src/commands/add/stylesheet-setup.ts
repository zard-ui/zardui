import { logger } from '@cli/utils/logger.js';
import { lineEndingOf } from '@cli/utils/source-file.js';
import { existsSync } from 'fs';
import * as fsPromises from 'fs/promises';

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
 */
function alreadyImports(content: string, fileName: string): boolean {
  return cssImports(withoutComments(content)).some(match => match[0].includes(fileName));
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

export function setupTypeset(tailwindCssPath: string): Promise<void> {
  return importIntoGlobalCss(tailwindCssPath, 'typeset.css', 'Typeset');
}

export function setupUtilities(tailwindCssPath: string): Promise<void> {
  return importIntoGlobalCss(tailwindCssPath, 'utilities.css', 'Utilities');
}
