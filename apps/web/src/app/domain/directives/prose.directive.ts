import { computed, Directive, input } from '@angular/core';

@Directive({
  selector: '[prose]',
  host: {
    class: `[&_code]:bg-muted [&_code]:relative [&_code]:rounded-md [&_code]:px-[0.3rem] [&_code]:py-[0.2rem]
            [&_code]:font-mono [&_code]:text-[0.8rem] [&_code]:break-words [&_code]:outline-none
            [&_strong]:font-semibold [&_em]:italic
            [&_a]:underline [&_a]:underline-offset-4 [&_a]:font-medium
            [&_ul]:my-4 [&_ul]:list-disc [&_ul]:space-y-2 [&_ul]:pl-6 [&_li]:leading-relaxed
            [&_ol]:my-4 [&_ol]:list-decimal [&_ol]:space-y-2 [&_ol]:pl-6 [&_p+p]:mt-4`,
    '[innerHTML]': 'formatted()',
  },
})
export class ProseDirective {
  readonly prose = input<string | null | undefined>('');

  protected readonly formatted = computed(() => {
    const content = this.prose();
    if (!content) return '';

    const blocks = groupLines(content.split('\n'));
    // A single run of text stays inline, so `[prose]` keeps working on a `<span>`; several blocks become paragraphs.
    const paragraphs = blocks.length > 1;

    return blocks
      .map(block => {
        if (block.type === 'list') return renderList(block.lines);
        if (block.type === 'ordered') return renderOrderedList(block.lines);
        const text = renderText(block.lines.join(' '));
        return paragraphs ? `<p>${text}</p>` : text;
      })
      .join('');
  });
}

interface Block {
  type: 'list' | 'ordered' | 'text';
  lines: string[];
}

const ORDERED_ITEM = /^\d+\.\s/;

/** Splits the source into runs of `- ` bullets, `1. ` items and text. A blank line ends a paragraph. */
function groupLines(lines: string[]): Block[] {
  const blocks: Block[] = [];
  let paragraphEnded = false;

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed) {
      paragraphEnded = true;
      continue;
    }

    const type = trimmed.startsWith('- ') ? 'list' : ORDERED_ITEM.test(trimmed) ? 'ordered' : 'text';
    const last = blocks[blocks.length - 1];
    const continues = last?.type === type && !(type === 'text' && paragraphEnded);
    paragraphEnded = false;

    if (continues) {
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

function renderOrderedList(lines: string[]): string {
  const items = lines.map(line => `<li>${renderText(line.replace(ORDERED_ITEM, ''))}</li>`).join('');
  return `<ol>${items}</ol>`;
}

/** The inline subset: `code`, **bold** and [links](/docs/rtl) to this site or to an https address. */
function renderText(value: string): string {
  return escapeHtml(value)
    .replace(/`([^`]+)`/g, (_, raw: string) => `<code>${raw}</code>`)
    .replace(/\*\*([^*]+)\*\*/g, (_, raw: string) => `<strong>${raw}</strong>`)
    .replace(/\[([^\]]+)\]\((\/[^)\s]*|https:\/\/[^)\s]+)\)/g, '<a href="$2">$1</a>');
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}
