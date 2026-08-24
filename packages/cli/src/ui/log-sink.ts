/**
 * Message sink — diverts the logger's output while the interactive screen is
 * mounted.
 *
 * In the alt-screen, any `console.log` fired by an internal module
 * (tsconfig-updater, theme-loader, package manager…) would tear the frame the
 * engine just painted. While capturing, messages are held here and re-emitted
 * into the terminal's history after unmount, alongside the summary.
 */

export type LogLevel = 'info' | 'warn' | 'error' | 'success' | 'debug';

export interface LogRecord {
  readonly level: LogLevel;
  readonly message: string;
}

let buffer: LogRecord[] | null = null;

/** Starts holding the logger's messages instead of writing them to the terminal. */
export function beginCapture(): void {
  buffer = [];
}

/** Encerra a captura e devolve o que foi retido, na ordem em que chegou. */
export function endCapture(): LogRecord[] {
  const captured = buffer ?? [];
  buffer = null;
  return captured;
}

export function isCapturing(): boolean {
  return buffer !== null;
}

/** Holds one message. Returns false when no capture is active. */
export function capture(level: LogLevel, message: string): boolean {
  if (buffer === null) return false;
  buffer.push({ level, message });
  return true;
}

/** The messages held so far, without ending the capture (for display in the UI). */
export function captured(): readonly LogRecord[] {
  return buffer ?? [];
}
