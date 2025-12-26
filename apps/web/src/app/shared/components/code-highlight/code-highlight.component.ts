import { Component, input, signal, effect, inject, ChangeDetectionStrategy } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

import { MarkdownService } from '../../services/markdown.service';

@Component({
  selector: 'z-code-highlight',
  template: `
    <div [innerHTML]="highlightedCode()"></div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CodeHighlightComponent {
  readonly code = input.required<string>();
  readonly language = input.required<string>();
  readonly filename = input<string>();
  readonly showLineNumbers = input<boolean>(false);
  readonly copyButton = input<boolean>(true);

  private readonly markdownService = inject(MarkdownService);
  private readonly sanitizer = inject(DomSanitizer);

  protected readonly highlightedCode = signal<SafeHtml>('');

  constructor() {
    effect(async () => {
      const code = this.code();
      const language = this.language();
      const filename = this.filename();
      const showLineNumbers = this.showLineNumbers();
      const copyButton = this.copyButton();

      if (!code || !language) {
        this.highlightedCode.set('');
        return;
      }

      const highlighted = await this.highlightCode(code, language, filename, showLineNumbers, copyButton);
      this.highlightedCode.set(this.sanitizer.bypassSecurityTrustHtml(highlighted));
    });
  }

  private async highlightCode(
    code: string,
    language: string,
    filename?: string,
    showLineNumbers = false,
    copyButton = true,
  ): Promise<string> {
    const meta: string[] = [];

    if (filename) {
      meta.push(`title="${filename}"`);
    }

    if (showLineNumbers) {
      meta.push('showLineNumbers');
    }

    if (copyButton) {
      meta.push('copyButton');
    }

    const metaString = meta.length > 0 ? ` ${meta.join(' ')}` : '';

    const markdown = `\`\`\`${language}${metaString}\n${code}\n\`\`\``;

    try {
      const html = await this.markdownService.processMarkdown(markdown);
      return html;
    } catch (error) {
      console.error('Error highlighting code:', error);
      return `<pre><code>${this.escapeHtml(code)}</code></pre>`;
    }
  }

  private escapeHtml(text: string): string {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }
}
