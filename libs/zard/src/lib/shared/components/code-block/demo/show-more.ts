import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';

import { ZardButtonComponent } from '@/shared/components/button/button.component';
import { ZardCodeBlockImports } from '@/shared/components/code-block/code-block.imports';

@Component({
  selector: 'z-demo-code-block-show-more',
  imports: [ZardCodeBlockImports, ZardButtonComponent],
  template: `
    <z-code-block class="max-w-md">
      <z-code-block-header>
        <z-code-block-title>chat.component.ts</z-code-block-title>
        <z-code-block-actions>
          <z-code-block-copy-button [zValue]="code" />
        </z-code-block-actions>
      </z-code-block-header>
      <z-code-block-content id="show-more-code" zLineNumbers [class]="cap()">{{ code }}</z-code-block-content>
      <z-code-block-footer class="justify-center">
        <button
          z-button
          type="button"
          zType="ghost"
          zSize="xs"
          aria-controls="show-more-code"
          [attr.aria-expanded]="expanded()"
          (click)="expanded.set(!expanded())"
        >
          {{ expanded() ? 'Show less' : 'Show more' }}
        </button>
      </z-code-block-footer>
    </z-code-block>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ZardDemoCodeBlockShowMoreComponent {
  protected readonly expanded = signal(false);

  protected readonly cap = computed(() => (this.expanded() ? 'max-h-96' : 'scroll-fade-y max-h-40 overflow-y-hidden'));

  protected readonly code = `@Component({
  selector: 'app-chat',
  imports: [FormsModule, ZardButtonComponent, ZardInputDirective],
  template: \`
    @for (message of messages(); track message.id) {
      <p>{{ message.text }}</p>
    }
    <input z-input [(ngModel)]="draft" />
    <button z-button (click)="send()">Send</button>
  \`,
})
export class ChatComponent {
  protected readonly messages = signal<Message[]>([]);
  protected draft = '';

  protected send(): void {
    this.messages.update(messages => [...messages, { id: crypto.randomUUID(), text: this.draft }]);
    this.draft = '';
  }
}`;
}
