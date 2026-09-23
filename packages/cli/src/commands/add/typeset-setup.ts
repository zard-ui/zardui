import { logger } from '@cli/utils/logger.js';
import { lineEndingOf } from '@cli/utils/source-file.js';
import { existsSync } from 'fs';
import * as fsPromises from 'fs/promises';

const TYPESET_IMPORT = "@import './typeset.css';";

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

/** Whether the stylesheet already imports typeset.css for real. */
function importsTypeset(content: string): boolean {
  return /@import\s[^;]*['"][^'"]*typeset\.css['"][^;]*;/.test(withoutComments(content));
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
 * Wires typeset up by importing it into the project's global CSS.
 *
 * The file was written next to that CSS, but a file nobody imports styles
 * nothing — and the order matters: coming after the other `@import`s lets
 * typeset see the theme tokens, which is where it takes colour and radius from.
 *
 * Calling this twice is the same as calling it once; a repeated `add typeset`
 * must not duplicate the line.
 */
export async function setupTypeset(tailwindCssPath: string): Promise<void> {
  if (!existsSync(tailwindCssPath)) {
    logger.warn(`${tailwindCssPath} not found. Import typeset.css in your global stylesheet manually.`);
    return;
  }

  const content = await fsPromises.readFile(tailwindCssPath, 'utf8');

  if (importsTypeset(content)) {
    logger.info('Typeset already imported in your global stylesheet.');
    return;
  }

  const imports = cssImports(withoutComments(content));
  const last = imports[imports.length - 1];

  // With no `@import` to anchor to there is no safe position: before a `@layer`
  // or a `@charset` the import is invalid, and guessing would corrupt the CSS
  // of whoever installed it. Better one line to copy than a broken file.
  if (!last) {
    logger.warn(`No @import found in ${tailwindCssPath}. Add \`${TYPESET_IMPORT}\` to it manually.`);
    return;
  }

  const eol = lineEndingOf(content);
  const end = last.index + last[0].length;
  const updated = content.slice(0, end) + eol + TYPESET_IMPORT + content.slice(end);

  await fsPromises.writeFile(tailwindCssPath, updated, 'utf8');
  logger.info('Typeset imported in your global stylesheet.');
}
