/**
 * Resumo pós-execução — o que permanece no histórico depois do alt-screen.
 *
 * Ao sair da tela cheia, tudo que o wizard desenhou desaparece. O que o usuário
 * precisa reter (o que foi escrito, o que rodar em seguida, o que deu errado)
 * é reimpresso aqui, no fluxo normal do terminal, onde continua rolável e
 * copiável depois que o comando termina.
 */

import { type LogRecord } from './log-sink.js';
import { flushRecords, writeLine } from './output.js';
import { style } from './style.js';

export type ReportStatus = 'success' | 'cancelled' | 'error';

export interface ReportCommand {
  readonly command: string;
  /** Trecho final destacado, como o `[component]` de `zard-cli add`. */
  readonly argument?: string;
}

export interface Report {
  readonly status: ReportStatus;
  /** Uma frase: o desfecho do comando. */
  readonly headline: string;
  /** Itens do que foi efetivamente feito. */
  readonly items?: readonly string[];
  /** Texto de apoio, exibido em tom secundário. */
  readonly notes?: readonly string[];
  /** Próximos passos sugeridos. */
  readonly commands?: readonly ReportCommand[];
  /** Mensagens retidas enquanto a tela estava montada. */
  readonly logs?: readonly LogRecord[];
}

const HEADLINE: Record<ReportStatus, (text: string) => string> = {
  success: text => `${style.success('✔')} ${style.bold(text)}`,
  cancelled: text => `${style.warning('■')} ${style.bold(text)}`,
  error: text => `${style.danger('✖')} ${style.bold(text)}`,
};

export function printReport(report: Report): void {
  writeLine();
  writeLine(HEADLINE[report.status](report.headline));

  if (report.logs?.length) {
    writeLine();
    flushRecords(report.logs);
  }

  if (report.items?.length) {
    writeLine();
    for (const item of report.items) writeLine(`  ${style.success('✔')} ${item}`);
  }

  if (report.notes?.length) {
    writeLine();
    for (const note of report.notes) writeLine(`  ${style.muted(note)}`);
  }

  if (report.commands?.length) {
    writeLine();
    for (const { command, argument } of report.commands) {
      const suffix = argument ? ` ${style.primary(argument)}` : '';
      writeLine(`  ${style.foreground(command)}${suffix}`);
    }
  }

  // Duas linhas, não uma: o prompt do shell volta logo abaixo e, colado, o
  // último comando sugerido parece parte dele.
  writeLine();
  writeLine();
}
