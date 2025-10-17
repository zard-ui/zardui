import { Component, input, signal, effect, inject } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

import { CodeHighlightService } from '../../services/code-highlight.service';

@Component({
  selector: 'z-simple-code-highlight',
  standalone: true,
  template: `
    <div class="relative">
      @if (showCopyButton()) {
        <button (click)="copyCode()" class="absolute top-2 right-2 z-10 p-2 rounded-md bg-muted hover:bg-muted/80 text-muted-foreground transition-colors" title="Copy code">
          <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            @if (copied()) {
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
            } @else {
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
              />
            }
          </svg>
        </button>
      }

      <div
        class="[&>pre]:m-0 [&>pre]:rounded-lg [&>pre]:border [&>pre]:border-border [&>pre]:bg-muted/30 [&>pre]:p-4 [&>pre]:overflow-x-auto [&>pre]:text-sm [&_code]:bg-transparent"
        [innerHTML]="highlightedCode()"
      ></div>
    </div>
  `,
})
export class SimpleCodeHighlightComponent {
  readonly code = input.required<string>();
  readonly language = input.required<string>();
  readonly showCopyButton = input<boolean>(true);
  readonly showLineNumbers = input<boolean>(false);

  private readonly codeHighlightService = inject(CodeHighlightService);
  private readonly sanitizer = inject(DomSanitizer);

  protected readonly highlightedCode = signal<SafeHtml>('');
  protected readonly copied = signal<boolean>(false);

  constructor() {
    effect(async () => {
      const code = this.code();
      const language = this.language();
      const showLineNumbers = this.showLineNumbers();

      if (!code || !language) {
        this.highlightedCode.set('');
        return;
      }

      const highlighted = await this.codeHighlightService.highlightCode(code, language, showLineNumbers);
      this.highlightedCode.set(this.sanitizer.bypassSecurityTrustHtml(highlighted));
    });
  }

  protected async copyCode(): Promise<void> {
    try {
      await navigator.clipboard.writeText(this.code());
      this.copied.set(true);
      setTimeout(() => this.copied.set(false), 2000);
    } catch (error) {
      console.error('Failed to copy code:', error);
    }
  }
}
