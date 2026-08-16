/**
 * Saída em linha — a única porta por onde a CLI escreve texto solto no
 * terminal, fora da tela interativa.
 *
 * Concentrar a escrita aqui garante que o logger, o resumo final e as
 * mensagens reemitidas do sink usem exatamente a mesma marcação de nível e a
 * mesma paleta.
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

/** Reemite no histórico do terminal as mensagens retidas durante a tela. */
export function flushRecords(records: readonly LogRecord[]): void {
  for (const record of records) writeLine(formatRecord(record));
}
