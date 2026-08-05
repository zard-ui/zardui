import { inject, Pipe, type PipeTransform } from '@angular/core';
import { DomSanitizer, type SafeHtml } from '@angular/platform-browser';

const HTML_ESCAPES: Record<string, string> = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#39;',
};

const CODE_CLASSES = 'bg-muted rounded px-1 py-0.5 font-mono';

/**
 * Renders the `` `inline code` `` spans used in this page's data files.
 *
 * The input is escaped before any markup is added, so the only tags in the output are the ones
 * this pipe writes — which is what makes bypassing the sanitizer safe here.
 */
@Pipe({ name: 'inlineCode' })
export class InlineCodePipe implements PipeTransform {
  private readonly sanitizer = inject(DomSanitizer);

  transform(value: string): SafeHtml {
    const escaped = value.replace(/[&<>"']/g, char => HTML_ESCAPES[char]);
    const withCode = escaped.replace(/`([^`]+)`/g, `<code class="${CODE_CLASSES}">$1</code>`);
    return this.sanitizer.bypassSecurityTrustHtml(withCode);
  }
}
