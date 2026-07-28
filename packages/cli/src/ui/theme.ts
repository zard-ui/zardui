/**
 * Tema da CLI — tokens semânticos consumidos por toda a UI do terminal.
 *
 * A paleta segue a base neutra do ZardUI (zinc) para texto e bordas, com os
 * acentos reservados para estado: primary marca o passo ativo e o cursor,
 * success/warning/danger comunicam o resultado de cada etapa.
 */

import { createTheme, type Theme } from './engine/index.js';

export const zardTheme: Theme = createTheme({
  primary: '#7c93ff',
  secondary: '#a78bfa',
  success: '#4ade80',
  warning: '#fbbf24',
  danger: '#f87171',
  muted: '#a1a1aa',
  foreground: '#fafafa',
  background: '#09090b',
  border: '#27272a',
});
