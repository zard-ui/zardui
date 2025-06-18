import { ClassValue } from 'class-variance-authority/dist/types';
import { MarkdownModule } from 'ngx-markdown';

import { Component, computed, ElementRef, input, ViewChild } from '@angular/core';
import { ClipboardButtonComponent } from '@zard/domain/components/clipboard-button/clipboard-button.component';

@Component({
  selector: 'z-markdown',
  imports: [MarkdownModule],
  template: `
    @if (codeBox()) {
      <markdown
        #codemarkdown
        [src]="src()"
        [lineNumbers]="dirLineNumber()"
        [start]="1"
        [class]="classes()"
        clipboard
        [clipboardButtonComponent]="clipboardButton"
        [lineHighlight]="true"
        [line]="dirLineHighlightLines()"
        [lineOffset]="5"
        (ready)="onExpandAvailable()"
        ngPreserveWhitespaces
      >
      </markdown>
    } @else {
      <markdown class="api" #markdownEl [src]="src()" (ready)="onMarkdownReady()" [class]="classes()" ngPreserveWhitespaces> </markdown>
    }
  `,
  host: {
    '[class]': 'classes()',
  },
})
export class ZardMarkdownComponent {
  readonly src = input.required<string>();
  readonly dirLineNumber = input.required<boolean>();
  readonly codeBox = input<boolean>(false);
  readonly dirLineHighlight = input<boolean>(false);
  readonly dirLineHighlightLines = input<string>('');
  readonly dirExpandable = input<boolean>(false);
  readonly class = input<ClassValue>('');
  readonly clipboardButton = ClipboardButtonComponent;
  protected readonly classes = computed(() => this.class());

  @ViewChild('markdownEl', { static: false, read: ElementRef })
  markdownEl!: ElementRef;
  @ViewChild('codemarkdown', { static: false, read: ElementRef })
  codeMarkdown!: ElementRef;

  onExpandAvailable(): void {
    const container = this.codeMarkdown?.nativeElement?.querySelector('div[style]');

    if (this.dirExpandable() && container && !container.classList.contains('markdown-clipboard-toolbar')) {
      const code = container.querySelector('code') || container.querySelector('pre') || container.firstElementChild;

      if (code) {
        code.style.maxHeight = '20dvh';
        container.classList.add('markdown-clipboard-toolbar');

        const overlayDiv = document.createElement('div');
        overlayDiv.className = 'absolute flex items-center justify-center bg-gradient-to-b from-zinc-700/30 to-zinc-950/90 p-2 inset-0 rounded-md z-1';

        const expandButton = document.createElement('button');
        expandButton.className =
          'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/80 px-4 py-2 h-8 text-xs cursor-pointer';
        expandButton.type = 'button';
        expandButton.textContent = 'Expand';

        expandButton.addEventListener('click', () => {
          const isExpanded = code.style.maxHeight !== '20dvh';

          if (isExpanded) {
            code.style.maxHeight = '20dvh';
            expandButton.textContent = 'Expand';
            overlayDiv.className = 'absolute flex items-center justify-center bg-gradient-to-b from-zinc-700/30 to-zinc-950/90 p-2 inset-0 rounded-md z-1';
          } else {
            code.style.maxHeight = '50dvh';
            expandButton.textContent = 'Collapse';
            overlayDiv.className = 'absolute flex items-center justify-center bg-gradient-to-b from-zinc-700/30 to-zinc-950/90 p-2 inset-x-0 bottom-0 h-12';
          }
        });

        overlayDiv.appendChild(expandButton);
        container.appendChild(overlayDiv);
        container.style.position = 'relative';
      }
    }
  }

  onMarkdownReady(): void {
    const tables = this.markdownEl?.nativeElement?.querySelectorAll('table') || [];

    tables.forEach((table: HTMLTableElement) => {
      if (table.parentElement?.classList.contains('overflow-auto')) return;

      const wrapper = document.createElement('div');
      wrapper.className = 'overflow-auto rounded-md border my-4';
      table.parentNode?.insertBefore(wrapper, table);
      wrapper.appendChild(table);
    });
  }
}
