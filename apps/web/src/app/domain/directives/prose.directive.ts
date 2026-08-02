import { computed, Directive, input } from '@angular/core';

@Directive({
  selector: '[prose]',
  host: {
    class: `[&_code]:bg-muted [&_code]:relative [&_code]:rounded-md [&_code]:px-[0.3rem] [&_code]:py-[0.2rem]
            [&_code]:font-mono [&_code]:text-[0.8rem] [&_code]:break-words [&_code]:outline-none
            [&_strong]:font-semibold [&_em]:italic
            [&_a]:underline [&_a]:underline-offset-4 [&_a]:font-medium`,
    '[innerHTML]': 'formatted()',
  },
})
export class ProseDirective {
  readonly prose = input<string | null | undefined>('');

  protected readonly formatted = computed(() => {
    const content = this.prose();
    if (!content) return '';
    return content.replace(/`([^`]+)`/g, (_, raw: string) => `<code>${escapeHtml(raw)}</code>`);
  });
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}
