/**
 * The post-run summary — what stays in the history after the alt-screen.
 *
 * On leaving the full screen, everything the wizard drew disappears. What the
 * user needs to keep (what was written, what to run next, what went wrong) is
 * reprinted here, in the terminal's normal flow, where it stays scrollable and
 * copyable after the command ends.
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
  /** What was actually done. */
  readonly items?: readonly string[];
  /** Supporting text, shown in a secondary tone. */
  readonly notes?: readonly string[];
  /** Suggested next steps. */
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

  // Two lines, not one: the shell prompt comes back right below and, pressed up
  // against it, the last suggested command looks like part of it.
  writeLine();
  writeLine();
}
