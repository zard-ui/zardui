/**
 * Blocos de view compartilhados pelos wizards.
 *
 * `init` e `add` são fluxos diferentes, mas o usuário deve reconhecer a mesma
 * CLI nos dois: o transcript de respostas, a barra de atalhos no rodapé e os
 * painéis de resultado vivem aqui para não divergirem.
 */

import { column, panel, progressBar, row, spinner, text, type Node } from './engine/index.js';

/** Barra de atalhos do rodapé: `↑/↓ navigate    enter confirm`. */
export function controls(pairs: readonly (readonly [string, string])[]): Node {
  const segments: Node[] = [];
  pairs.forEach(([key, label], index) => {
    segments.push(text(key, { color: 'foreground' }));
    segments.push(text(` ${label}${index < pairs.length - 1 ? '    ' : ''}`, { color: 'muted' }));
  });
  return row({}, ...segments);
}

/** Linha do transcript: uma pergunta já respondida. */
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

/** Campo de texto com cursor em bloco. */
/**
 * Campo de texto com o cursor onde ele realmente está.
 *
 * Desenhar o cursor sempre no fim escondia que ele pode andar — e sem enxergar
 * a posição não há como editar o meio do valor com alguma confiança. O
 * caractere sob o cursor é invertido; no fim da linha isso dá o mesmo bloco
 * cheio de antes.
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
}

/** Lista de escolha única, com o item ativo marcado por `❯`. */
export function choiceList(choices: readonly Choice[], activeIndex: number): Node[] {
  return choices.map((choice, index) => {
    const active = index === activeIndex;
    return row(
      { gap: 0 },
      text(active ? '   ❯  ' : '      ', { color: 'primary', bold: active }),
      text(choice.label, { color: active ? 'foreground' : 'muted', bold: active }),
      ...(choice.hint ? [text(`   ${choice.hint}`, { color: 'muted', dim: true })] : []),
    );
  });
}

/** Lista de múltipla escolha, com marcação por item. */
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

/** Explicação do passo ativo, em texto secundário. */
export function hint(content: string): Node {
  return text(`   ${content}`, { color: 'muted', dim: true });
}

/** Aviso destacado — usado quando recusar o passo interrompe o fluxo. */
export function warning(content: string): Node {
  return text(`   ⚠  ${content}`, { color: 'warning', bold: true });
}

export interface TaskLine {
  readonly label: string;
  readonly note?: string;
}

/** A partir daqui a etapa atual passa a mostrar há quanto tempo está rodando. */
const SLOW_TASK_MS = 3000;

/**
 * Lista de tarefas em execução: concluídas com ✔, a atual com spinner e as
 * pendentes apagadas — o mesmo vocabulário do transcript.
 *
 * `elapsedMs` é o tempo da etapa atual: passado dele, o contador aparece ao
 * lado. Instalar dependências pode levar minutos, e sem esse sinal um spinner
 * girando é indistinguível de um processo travado.
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

/** Cabeçalho da fase de execução, com spinner enquanto há trabalho pendente. */
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

/** Moldura padrão de uma tela: respiro nas laterais e conteúdo em coluna. */
export function page(...children: Node[]): Node {
  return column({ flexGrow: 1, padding: { top: 1, right: 3, bottom: 1, left: 3 }, gap: 0 }, ...children);
}
