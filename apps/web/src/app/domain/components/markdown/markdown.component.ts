import { ClassValue } from 'class-variance-authority/dist/types';
import { MarkdownModule } from 'ngx-markdown';

import { Component, computed, ElementRef, input, ViewChild } from '@angular/core';
import { ClipboardButtonComponent } from '@zard/domain/components/clipboard-button/clipboard-button.component';

@Component({
  selector: 'z-markdown',
  imports: [MarkdownModule],
  template: `
    @if (codeBox()) {
      <markdown [src]="src()" [class]="classes()" clipboard [clipboardButtonComponent]="clipboardButton" ngPreserveWhitespaces></markdown>
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
  readonly codeBox = input<boolean>(false);
  readonly class = input<ClassValue>('');
  readonly clipboardButton = ClipboardButtonComponent;
  protected readonly classes = computed(() => this.class());

  @ViewChild('markdownEl', { static: false, read: ElementRef })
  markdownEl!: ElementRef;

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
