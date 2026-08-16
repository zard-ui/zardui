/**
 * Estilo para saída em linha — o que a CLI escreve fora da tela interativa.
 *
 * Substitui o chalk usando o vocabulário ANSI da própria engine, o que mantém
 * uma única fonte de verdade de cor: os mesmos tokens do tema valem para o
 * wizard em alt-screen e para o texto que sobra no histórico do terminal.
 */

import { Attr, createSgrBuilder, createTerminal, type ColorLevel } from './engine/index.js';
import { zardTheme } from './theme.js';

let cachedLevel: ColorLevel | null = null;

/** Nível de cor do terminal atual, resolvido uma única vez por processo. */
function colorLevel(): ColorLevel {
  cachedLevel ??= createTerminal().caps.colors;
  return cachedLevel;
}

/** Reavalia a capacidade de cor — usado em teste, quando o stdout é trocado. */
export function resetColorLevel(): void {
  cachedLevel = null;
}

function paint(text: string, token: string | undefined, attrs: Attr = Attr.None): string {
  const level = colorLevel();
  if (level === 'none' || (token === undefined && attrs === Attr.None)) return text;

  const sgr = createSgrBuilder();
  const fg = zardTheme.resolve(token, level);
  return sgr.transition(fg, { kind: 'default' }, attrs) + text + sgr.reset();
}

export const style = {
  primary: (text: string) => paint(text, 'primary'),
  success: (text: string) => paint(text, 'success'),
  warning: (text: string) => paint(text, 'warning'),
  danger: (text: string) => paint(text, 'danger'),
  muted: (text: string) => paint(text, 'muted'),
  foreground: (text: string) => paint(text, 'foreground'),
  bold: (text: string) => paint(text, undefined, Attr.Bold),
  dim: (text: string) => paint(text, undefined, Attr.Dim),
  /** Destaque de nome de arquivo, comando ou caminho dentro de uma frase. */
  code: (text: string) => paint(text, 'primary', Attr.Bold),
};

/** true quando o terminal aceita as caixas e glifos Unicode da UI. */
export function supportsUnicode(): boolean {
  return createTerminal().caps.unicode;
}
