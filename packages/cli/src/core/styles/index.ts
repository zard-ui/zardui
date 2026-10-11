/**
 * Styles — the look a component is installed with.
 *
 * The library's sources carry style markers (`cn-button`, `cn-card-header`) in
 * place of the classes that decide how a part looks. A style is the table that
 * says what each marker stands for, and installing is resolving that table once:
 *
 *   `transformStyle`      source with markers → source with the style's classes
 *   `parseStyleSheet`     a style's `.css` file → its marker table
 *   `buildStyleCatalog`   the eight sheets → what the registry publishes
 *   `LOCAL_STYLE_CATALOG` the bundled copy, the floor when the registry is out of reach
 *
 * See `.claude/specs/decisions/adr-0002-style-system.md` for why the sources are
 * written this way and what the docs site does with the same files.
 */

import { STYLE_IDS, type StyleId } from './ids.js';
import { parseStyleSheet, type StyleMarkers } from './parse-style-sheet.js';
import type { StyleCatalog } from './transform-style.js';

export {
  DEFAULT_STYLE,
  isStyleId,
  isStyleSelection,
  LEGACY_STYLE,
  resolveStyle,
  STYLE_IDS,
  STYLE_SELECTIONS,
  type StyleId,
  type StyleSelection,
} from './ids.js';
export { LOCAL_STYLE_CATALOG } from './local-catalog.js';
export { parseStyleSheet, type StyleMarkers } from './parse-style-sheet.js';
export {
  extractMarkers,
  transformStyle,
  transformStyleReport,
  type StyleCatalog,
  type StyleTransformResult,
} from './transform-style.js';

/** Reads each style's sheet into the catalog the installer and the registry use. */
export function buildStyleCatalog(sheets: Readonly<Record<StyleId, string>>): Record<StyleId, StyleMarkers> {
  const catalog = {} as Record<StyleId, StyleMarkers>;

  for (const id of STYLE_IDS) catalog[id] = parseStyleSheet(sheets[id]);

  return catalog satisfies StyleCatalog;
}
