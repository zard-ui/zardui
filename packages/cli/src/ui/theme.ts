/**
 * The CLI's theme — semantic tokens consumed by the whole terminal UI.
 *
 * The palette follows ZardUI's neutral base (zinc) for text and borders, with
 * the accents reserved for state: primary marks the active step and the cursor,
 * while success/warning/danger communicate each step's outcome.
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
