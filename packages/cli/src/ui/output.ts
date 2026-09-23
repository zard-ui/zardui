/**
 * Line output — the only door through which the CLI writes loose text to the
 * terminal, outside the interactive screen.
 *
 * Concentrating writes here guarantees the logger, the final summary and the
 * messages re-emitted from the sink all use exactly the same level markers and
 * the same palette.
 */

import { type LogRecord, type LogLevel } from './log-sink.js';
import { style } from './style.js';

const MARKS: Record<LogLevel, (text: string) => string> = {
  info: text => `${style.primary('›')} ${text}`,
  success: text => `${style.success('✔')} ${text}`,
  warn: text => `${style.warning('⚠')} ${text}`,
  error: text => `${style.danger('✖')} ${text}`,
  debug: text => style.dim(`[debug] ${text}`),
};

export function writeLine(text = ''): void {
  process.stdout.write(`${text}\n`);
}

export function formatRecord(record: LogRecord): string {
  return MARKS[record.level](record.message);
}

/** Re-emits into the terminal's history the messages held while the screen was up. */
export function flushRecords(records: readonly LogRecord[]): void {
  for (const record of records) writeLine(formatRecord(record));
}
