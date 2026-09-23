/**
 * View blocks shared by the wizards.
 *
 * `init` and `add` are different flows, but the user should recognise the same
 * CLI in both: the transcript of answers, the shortcut bar in the footer and the
 * result panels live here so they cannot diverge.
 */

import { column, panel, progressBar, row, spinner, text, type Node } from './engine/index.js';

/** The footer's shortcut bar: `↑/↓ navigate    enter confirm`. */
export function controls(pairs: readonly (readonly [string, string])[]): Node {
  const segments: Node[] = [];
  pairs.forEach(([key, label], index) => {
    segments.push(text(key, { color: 'foreground' }));
    segments.push(text(` ${label}${index < pairs.length - 1 ? '    ' : ''}`, { color: 'muted' }));
  });
  return row({}, ...segments);
}

/** A transcript line: one question already answered. */
export function answeredLine(label: string, value: string): Node {
  return row(
    { gap: 0 },
    text('✔  ', { color: 'success' }),
    text(label, { color: 'muted' }),
    text('  …  ', { color: 'muted', dim: true }),
    text(value, { color: 'foreground' }),
  );
}

/** Enunciado do passo ativo. */
export function question(prompt: string): Node {
  return row(
    { gap: 0 },
    text('◆  ', { color: 'primary' }),
    text(prompt, { color: 'foreground', bold: true, wrap: true }),
  );
}

/** Text field with a block cursor. */
/**
 * Text field with the cursor where it actually is.
 *
 * Always drawing the cursor at the end hid the fact that it can move — and
 * without seeing the position there is no editing the middle of a value with any
 * confidence. The character under the cursor is inverted; at the end of the line
 * that gives the same solid block as before.
 */
export function textField(value: string, caret = [...value].length): Node {
  const chars = [...value];
  const position = Math.max(0, Math.min(caret, chars.length));

  return row(
    { gap: 0 },
    text('   › ', { color: 'muted' }),
    text(chars.slice(0, position).join(''), { color: 'foreground' }),
    text(chars[position] ?? ' ', { color: 'foreground', inverse: true }),
    text(chars.slice(position + 1).join(''), { color: 'foreground' }),
  );
}

export interface Choice {
  readonly label: string;
  readonly hint?: string;
  /**
   * The item's own colour, when it stands for something that already has an
   * identity — a framework, say. Without it the label follows the state (active
   * or not).
   */
  readonly color?: string;
}

/**
 * Single-choice list, with the active item marked by `❯`.
 *
 * A coloured item keeps its colour whether active or not: the colour is what
 * identifies it. State stays legible through the marker and the weight — bold on
 * the active one, dimmed on the rest.
 */
export function choiceList(choices: readonly Choice[], activeIndex: number): Node[] {
  return choices.map((choice, index) => {
    const active = index === activeIndex;
    return row(
      { gap: 0 },
      text(active ? '   ❯  ' : '      ', { color: 'primary', bold: active }),
      text(choice.label, {
        color: choice.color ?? (active ? 'foreground' : 'muted'),
        bold: active,
        dim: !active,
      }),
      ...(choice.hint ? [text(`   ${choice.hint}`, { color: 'muted', dim: true })] : []),
    );
  });
}

/** Multiple-choice list, with a mark per item. */
export function checkList(choices: readonly Choice[], activeIndex: number, selected: ReadonlySet<number>): Node[] {
  return choices.map((choice, index) => {
    const active = index === activeIndex;
    const checked = selected.has(index);
    return row(
      { gap: 0 },
      text(active ? '   ❯ ' : '     ', { color: 'primary', bold: active }),
      text(checked ? '◼ ' : '◻ ', { color: checked ? 'success' : 'muted', dim: !checked }),
      text(choice.label, { color: active ? 'foreground' : checked ? 'foreground' : 'muted', bold: active }),
      ...(choice.hint ? [text(`   ${choice.hint}`, { color: 'muted', dim: true })] : []),
    );
  });
}

/** Par Yes/No com o lado ativo destacado. */
export function confirmField(value: boolean): Node {
  return row(
    { gap: 4 },
    text(`   ${value ? '❯  ' : '   '}Yes`, { color: value ? 'success' : 'muted', bold: value }),
    text(`${!value ? '❯  ' : '   '}No`, { color: !value ? 'danger' : 'muted', bold: !value }),
  );
}

/** Explanation of the active step, in secondary text. */
export function hint(content: string): Node {
  return text(`   ${content}`, { color: 'muted', dim: true });
}

/** A highlighted warning — used when declining the step aborts the flow. */
export function warning(content: string): Node {
  return text(`   ⚠  ${content}`, { color: 'warning', bold: true });
}

export interface TaskLine {
  readonly label: string;
  readonly note?: string;
}

/** Past this point the current step starts showing how long it has been running. */
const SLOW_TASK_MS = 3000;

/**
 * The list of running tasks: done ones with ✔, the current one with a spinner and
 * the pending ones dimmed — the same vocabulary as the transcript.
 *
 * `elapsedMs` is the current step's runtime: past a threshold, the counter shows
 * next to it. Installing dependencies can take minutes, and without that signal a
 * spinning spinner is indistinguishable from a hung process.
 */
export function taskList(tasks: readonly TaskLine[], doneCount: number, elapsedMs?: number): Node[] {
  const allDone = doneCount >= tasks.length;

  return tasks.map((task, index) => {
    const done = index < doneCount;
    const current = index === doneCount && !allDone;
    const mark = done
      ? text('✔', { color: 'success' })
      : current
        ? spinner({ variant: 'dots', color: 'primary' })
        : text('○', { color: 'muted', dim: true });

    const showElapsed = current && elapsedMs !== undefined && elapsedMs >= SLOW_TASK_MS;

    return row(
      { gap: 0 },
      text('   '),
      mark,
      text(`  ${task.label}`, { color: done || current ? 'foreground' : 'muted' }),
      ...(task.note ? [text(`  —  ${task.note}`, { color: 'muted', dim: true })] : []),
      ...(showElapsed ? [text(`  ${Math.round((elapsedMs as number) / 1000)}s`, { color: 'primary', dim: true })] : []),
    );
  });
}

/** Header for the execution phase, with a spinner while work is pending. */
export function taskHeader(label: string, allDone: boolean): Node {
  return row(
    { gap: 0 },
    allDone ? text('✔', { color: 'success' }) : spinner({ variant: 'dots', color: 'primary' }),
    text(`  ${label}`, { color: 'foreground', bold: true }),
  );
}

export function progress(done: number, total: number): Node {
  return progressBar({ value: total ? done / total : 1, width: 44, color: 'success', showPercent: true });
}

/** Painel de desfecho — sucesso, cancelamento ou falha. */
export function resultPanel(kind: 'success' | 'danger', message: string): Node {
  return panel(
    { border: 'round', borderColor: kind, padding: { top: 0, right: 1, bottom: 0, left: 1 } },
    row(
      { gap: 0 },
      text(kind === 'success' ? '✔  ' : '✖  ', { color: kind, bold: true }),
      text(message, { color: 'foreground', bold: true }),
    ),
  );
}

/** A screen's standard frame: breathing room at the sides, content in a column. */
export function page(...children: Node[]): Node {
  return column({ flexGrow: 1, padding: { top: 1, right: 3, bottom: 1, left: 3 }, gap: 0 }, ...children);
}
