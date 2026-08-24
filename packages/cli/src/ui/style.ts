/**
 * Styling for line output — what the CLI writes outside the interactive screen.
 *
 * Replaces chalk using the engine's own ANSI vocabulary, which keeps a single
 * source of truth for colour: the same theme tokens apply to the wizard in the
 * alt-screen and to the text left behind in the terminal's history.
 */

import { Attr, createSgrBuilder, createTerminal, type ColorLevel } from './engine/index.js';
import { zardTheme } from './theme.js';

let cachedLevel: ColorLevel | null = null;

/** The current terminal's colour depth, resolved once per process. */
function colorLevel(): ColorLevel {
  cachedLevel ??= createTerminal().caps.colors;
  return cachedLevel;
}

/** Re-evaluates the colour capability — used in tests, when stdout is swapped. */
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
  /** Highlights a file name, command or path inside a sentence. */
  code: (text: string) => paint(text, 'primary', Attr.Bold),
};

/** True when the terminal accepts the UI's Unicode boxes and glyphs. */
export function supportsUnicode(): boolean {
  return createTerminal().caps.unicode;
}
