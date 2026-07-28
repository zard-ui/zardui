/**
 * Identidade visual da CLI — o banner e os cabeçalhos de comando.
 *
 * O banner só aparece quando há altura sobrando: em terminais baixos ele cede
 * lugar ao conteúdo, que é o que o usuário precisa ver para responder.
 */

import { banner, column, row, text, type Node } from './engine/index.js';

export const ZARDUI_BANNER = [
  '███████╗ █████╗ ██████╗ ██████╗ ██╗   ██╗██╗',
  '╚══███╔╝██╔══██╗██╔══██╗██╔══██╗██║   ██║██║',
  '  ███╔╝ ███████║██████╔╝██║  ██║██║   ██║██║',
  ' ███╔╝  ██╔══██║██╔══██╗██║  ██║██║   ██║██║',
  '███████╗██║  ██║██║  ██║██████╔╝╚██████╔╝██║',
  '╚══════╝╚═╝  ╚═╝╚═╝  ╚═╝╚═════╝  ╚═════╝ ╚═╝',
];

const BANNER_COLOR = '#fafafa';
const TAGLINE = 'The Angular component toolkit · beautiful components in seconds';

/** Altura mínima para o banner caber sem espremer as perguntas. */
const BANNER_MIN_ROWS = 24;

export function brandBanner(rows: number): Node[] {
  if (rows < BANNER_MIN_ROWS) {
    return [row({ gap: 1 }, text('◇', { color: 'primary' }), text('ZardUI', { color: 'foreground', bold: true }))];
  }
  return [banner({ lines: ZARDUI_BANNER, colors: [BANNER_COLOR] }), text(TAGLINE, { color: 'muted', dim: true })];
}

/** Cabeçalho compacto de um comando: `◇ ZardUI · initialize`. */
export function commandHeader(command: string, description?: string): Node {
  const head = row(
    { gap: 1 },
    text('◇', { color: 'success' }),
    text('ZardUI', { color: 'foreground', bold: true }),
    text(`· ${command}`, { color: 'muted' }),
  );

  if (!description) return head;
  return column({}, head, text(description, { color: 'muted', dim: true }));
}
