/**
 * Sink de mensagens — desvia a saída do logger enquanto a tela interativa está
 * montada.
 *
 * Em alt-screen, qualquer `console.log` disparado por um módulo interno
 * (tsconfig-updater, theme-loader, package manager…) rasgaria o frame que a
 * engine acabou de pintar. Durante a captura as mensagens ficam retidas aqui e
 * são reemitidas no histórico do terminal depois do unmount, junto do resumo.
 */

export type LogLevel = 'info' | 'warn' | 'error' | 'success' | 'debug';

export interface LogRecord {
  readonly level: LogLevel;
  readonly message: string;
}

let buffer: LogRecord[] | null = null;

/** Passa a reter as mensagens do logger em vez de escrevê-las no terminal. */
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

/** Retém uma mensagem. Devolve false quando não há captura ativa. */
export function capture(level: LogLevel, message: string): boolean {
  if (buffer === null) return false;
  buffer.push({ level, message });
  return true;
}

/** Mensagens retidas até agora, sem encerrar a captura (para exibir na UI). */
export function captured(): readonly LogRecord[] {
  return buffer ?? [];
}
