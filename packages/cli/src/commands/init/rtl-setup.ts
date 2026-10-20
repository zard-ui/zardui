import { logger } from '@cli/utils/logger.js';
import { existsSync } from 'node:fs';
import { readFile, writeFile } from 'node:fs/promises';
import * as path from 'node:path';

const HTML_OPEN_TAG = /<html(\s[^>]*)?>/i;
const DIR_ATTRIBUTE = /\sdir\s*=\s*(?:"[^"]*"|'[^']*'|[^\s>]+)/i;

/** The `<html>` tag with `dir="rtl"`, whatever it had before. */
export function withRtlDirection(content: string): string {
  const match = HTML_OPEN_TAG.exec(content);
  if (!match) return content;

  const attributes = match[1] ?? '';
  const next = DIR_ATTRIBUTE.test(attributes)
    ? attributes.replace(DIR_ATTRIBUTE, ' dir="rtl"')
    : `${attributes.replace(/\s+$/, '')} dir="rtl"`;

  return content.slice(0, match.index) + `<html${next}>` + content.slice(match.index + match[0].length);
}

export type RtlSetupResult = 'updated' | 'unchanged' | 'missing' | 'no-html-tag';

/**
 * Sets `dir="rtl"` on `<html>` in the app's index.html.
 *
 * The components are direction-agnostic, so this attribute is all a project needs
 * to render right to left. A library has no index.html — it belongs to the app
 * consuming it — so a missing file is a note, not a failure.
 */
export async function setupRtlDirection(cwd: string, indexFile: string): Promise<RtlSetupResult> {
  const indexPath = path.resolve(cwd, indexFile);

  if (!existsSync(indexPath)) {
    logger.warn(`${indexFile} not found: add dir="rtl" to the <html> tag of the app's index.html by hand.`);
    return 'missing';
  }

  const content = await readFile(indexPath, 'utf8');

  if (!HTML_OPEN_TAG.test(content)) {
    logger.warn(`No <html> tag found in ${indexFile}: add dir="rtl" to it by hand.`);
    return 'no-html-tag';
  }

  const updated = withRtlDirection(content);
  if (updated === content) return 'unchanged';

  await writeFile(indexPath, updated, 'utf8');
  return 'updated';
}
