import { ClipboardButtonComponent } from '@zard/domain/components/clipboard-button/clipboard-button.component';
import { ClassValue } from 'class-variance-authority/dist/types';
import { Component, computed, input } from '@angular/core';
import { MarkdownModule } from 'ngx-markdown';

@Component({
  selector: 'z-markdown',
  imports: [MarkdownModule],
  template: `
    @if (codeBox()) {
      <markdown [src]="src()" [class]="classes()" clipboard [clipboardButtonComponent]="clipboardButton" ngPreserveWhitespaces></markdown>
    } @else {
      <markdown class="api" [src]="src()" [class]="classes()" ngPreserveWhitespaces> </markdown>
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
}
