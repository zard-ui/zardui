import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';

import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideChevronDown } from '@ng-icons/lucide';

import { ZardButtonComponent } from '@/shared/components/button/button.component';
import { injectHighlightedCode } from '@/shared/components/code-block/code-block.highlight';
import { ZardCodeBlockImports } from '@/shared/components/code-block/code-block.imports';

const CHAT_COMPONENT_CODE = `@Component({
  selector: 'app-chat',
  imports: [FormsModule, ZardButtonComponent, ZardInputDirective],
  template: \`
    <div class="flex flex-col gap-4">
      @for (message of chat.messages(); track message.id) {
        <p>{{ message.text }}</p>
      }
      <form (ngSubmit)="send()">
        <input z-input name="draft" [(ngModel)]="draft" />
        <button z-button [disabled]="chat.status() !== 'ready'">Send</button>
      </form>
    </div>
  \`,
})
export class ChatComponent {
  protected readonly chat = inject(ChatService);
  protected draft = '';

  protected send(): void {
    this.chat.send(this.draft);
    this.draft = '';
  }
}`;

@Component({
  selector: 'z-demo-code-block-show-more',
  imports: [NgIcon, ZardButtonComponent, ...ZardCodeBlockImports],
  template: `
    <z-code-block class="max-w-md">
      <z-code-block-header>
        <z-code-block-title>src/app/chat/chat.component.ts</z-code-block-title>
        <z-code-block-actions>
          <z-code-block-copy-button [zValue]="code" />
        </z-code-block-actions>
      </z-code-block-header>
      <z-code-block-content id="code-block-show-more" zLineNumbers [class]="cap()">
        @for (line of lines(); track $index) {
          <z-code-block-line [zTokens]="line" />
        }
      </z-code-block-content>
      <z-code-block-footer class="justify-center">
        <button
          type="button"
          z-button
          zType="ghost"
          zSize="xs"
          aria-controls="code-block-show-more"
          [attr.aria-expanded]="expanded()"
          (click)="expanded.set(!expanded())"
        >
          <ng-icon name="lucideChevronDown" class="transition-transform in-aria-expanded:rotate-180" />
          {{ expanded() ? 'Show less' : 'Show more' }}
        </button>
      </z-code-block-footer>
    </z-code-block>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  viewProviders: [provideIcons({ lucideChevronDown })],
  host: { class: 'contents' },
})
export class ZardDemoCodeBlockShowMoreComponent {
  protected readonly code = CHAT_COMPONENT_CODE;
  protected readonly expanded = signal(false);
  protected readonly lines = injectHighlightedCode(CHAT_COMPONENT_CODE, 'angular-ts');

  protected readonly cap = computed(() => (this.expanded() ? '' : 'scroll-fade-y max-h-64 overflow-y-hidden'));
}
