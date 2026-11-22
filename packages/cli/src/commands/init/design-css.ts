/**
 * Writing a design into a project's global stylesheet — the half `apply` shares with `init`.
 *
 * Each function edits one region of the file (see `core/design/css.ts` for the markers) and leaves
 * every other byte alone, which is what lets `apply --only theme` run on a stylesheet the user has
 * been editing. They never create the file: a missing stylesheet is reported, not invented.
 */

import { type DesignConfig } from '@cli/core/design/config.js';
import {
  applyFontBlocks,
  applyThemeBlock,
  hasPointerRule,
  renderFontImports,
  renderFontTheme,
  renderThemeBlock,
} from '@cli/core/design/css.js';
import { designData } from '@cli/utils/design-catalog.js';
import { CliError } from '@cli/utils/errors.js';
import { lineEndingOf } from '@cli/utils/source-file.js';
import { existsSync } from 'node:fs';
import { readFile, writeFile } from 'node:fs/promises';
import * as path from 'node:path';

export type StyleWrite = 'updated' | 'unchanged';

async function readStylesheet(cwd: string, cssPath: string): Promise<{ file: string; css: string }> {
  const file = path.resolve(cwd, cssPath);

  if (!existsSync(file)) {
    throw new CliError(
      `The stylesheet ${cssPath} does not exist. Run \`zard-cli init\` first, or fix "tailwind.css" in components.json.`,
      'CSS_NOT_FOUND',
    );
  }

  return { file, css: await readFile(file, 'utf8') };
}

/** The generated text uses `\n`; a CRLF file gets CRLF back so a diff shows only what changed. */
function inEolOf(original: string, text: string): string {
  return lineEndingOf(original) === '\r\n' ? text.replace(/\r?\n/g, '\r\n') : text;
}

async function save(file: string, original: string, updated: string): Promise<StyleWrite> {
  const content = inEolOf(original, updated);
  if (content === original) return 'unchanged';

  await writeFile(file, content, 'utf8');
  return 'updated';
}

/**
 * Replaces the theme tokens: base color, theme, chart ramp, radius, bold accent and the base layer.
 *
 * `pointer` decides the cursor rule; left undefined it keeps whatever the file has, so applying a
 * preset does not silently drop a pointer rule the project asked for earlier.
 */
export async function writeTheme(
  cwd: string,
  cssPath: string,
  design: DesignConfig,
  options: { pointer?: boolean } = {},
): Promise<StyleWrite> {
  const { file, css } = await readStylesheet(cwd, cssPath);
  const pointer = options.pointer ?? hasPointerRule(css);

  return save(file, css, applyThemeBlock(normalizeEol(css), renderThemeBlock(design, { pointer, data: designData() })));
}

/** Replaces the font imports and the `--font-sans` / `--font-heading` variables. */
export async function writeFonts(cwd: string, cssPath: string, design: DesignConfig): Promise<StyleWrite> {
  const { file, css } = await readStylesheet(cwd, cssPath);
  const data = designData();

  return save(
    file,
    css,
    applyFontBlocks(normalizeEol(css), renderFontImports(design, data), renderFontTheme(design, data)),
  );
}

function normalizeEol(css: string): string {
  return css.replace(/\r\n/g, '\n');
}
