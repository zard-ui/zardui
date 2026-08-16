import { computed, Directive, input } from '@angular/core';

@Directive({
  selector: '[prose]',
  host: {
    class: `[&_code]:bg-muted [&_code]:relative [&_code]:rounded-md [&_code]:px-[0.3rem] [&_code]:py-[0.2rem]
            [&_code]:font-mono [&_code]:text-[0.8rem] [&_code]:break-words [&_code]:outline-none
            [&_strong]:font-semibold [&_em]:italic
            [&_a]:underline [&_a]:underline-offset-4 [&_a]:font-medium
            [&_ul]:my-4 [&_ul]:list-disc [&_ul]:space-y-2 [&_ul]:pl-6 [&_li]:leading-relaxed`,
    '[innerHTML]': 'formatted()',
  },
})
export class ProseDirective {
  readonly prose = input<string | null | undefined>('');

  protected readonly formatted = computed(() => {
    const content = this.prose();
    if (!content) return '';

    return groupLines(content.split('\n'))
      .map(block => (block.type === 'list' ? renderList(block.lines) : renderText(block.lines.join(' '))))
      .join('');
  });
}

interface Block {
  type: 'list' | 'text';
  lines: string[];
}

/** Splits the source into runs of `- ` bullets and everything else. */
function groupLines(lines: string[]): Block[] {
  const blocks: Block[] = [];

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed) continue;

    const type = trimmed.startsWith('- ') ? 'list' : 'text';
    const last = blocks[blocks.length - 1];

    if (last?.type === type) {
      last.lines.push(trimmed);
    } else {
      blocks.push({ type, lines: [trimmed] });
    }
  }

  return blocks;
}

function renderList(lines: string[]): string {
  const items = lines.map(line => `<li>${renderText(line.slice(2))}</li>`).join('');
  return `<ul>${items}</ul>`;
}

/** The inline subset: `code`, **bold**, and nothing else. */
function renderText(value: string): string {
  return escapeHtml(value)
    .replace(/`([^`]+)`/g, (_, raw: string) => `<code>${raw}</code>`)
    .replace(/\*\*([^*]+)\*\*/g, (_, raw: string) => `<strong>${raw}</strong>`);
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}
