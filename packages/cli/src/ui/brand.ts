/**
 * The CLI's visual identity — the banner and the command headers.
 *
 * The banner only appears when there is height to spare: in short terminals it
 * gives way to the content, which is what the user needs to see to answer.
 */

import { banner, column, row, text, type Node } from './engine/index.js';

/** The brand name as it is written — the slash is part of it. */
export const BRAND = 'zard/ui';

export const ZARDUI_BANNER = [
  '███████╗ █████╗ ██████╗ ██████╗     ██╗██╗   ██╗██╗',
  '╚══███╔╝██╔══██╗██╔══██╗██╔══██╗   ██╔╝██║   ██║██║',
  '  ███╔╝ ███████║██████╔╝██║  ██║  ██╔╝ ██║   ██║██║',
  ' ███╔╝  ██╔══██║██╔══██╗██║  ██║ ██╔╝  ██║   ██║██║',
  '███████╗██║  ██║██║  ██║██████╔╝██╔╝   ╚██████╔╝██║',
  '╚══════╝╚═╝  ╚═╝╚═╝  ╚═╝╚═════╝ ╚═╝     ╚═════╝ ╚═╝',
];

const BANNER_COLOR = '#fafafa';
const TAGLINE = 'The Angular component toolkit · beautiful components in seconds';

/** Minimum height for the banner to fit without squeezing the questions. */
const BANNER_MIN_ROWS = 24;

export function brandBanner(rows: number): Node[] {
  if (rows < BANNER_MIN_ROWS) {
    return [row({ gap: 1 }, text('◇', { color: 'primary' }), text(BRAND, { color: 'foreground', bold: true }))];
  }
  return [banner({ lines: ZARDUI_BANNER, colors: [BANNER_COLOR] }), text(TAGLINE, { color: 'muted', dim: true })];
}

/** A command's compact header: `◇ zard/ui · initialize`. */
export function commandHeader(command: string, description?: string): Node {
  const head = row(
    { gap: 1 },
    text('◇', { color: 'success' }),
    text(BRAND, { color: 'foreground', bold: true }),
    text(`· ${command}`, { color: 'muted' }),
  );

  if (!description) return head;
  return column({}, head, text(description, { color: 'muted', dim: true }));
}
