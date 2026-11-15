import { ChangeDetectionStrategy, Component } from '@angular/core';

import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideArrowUp } from '@ng-icons/lucide';

import { ZardButtonComponent } from '@zard/components/button/button.component';
import { ZardCardImports } from '@zard/components/card/card.imports';
import { ZardMessageScrollerImports } from '@zard/components/message-scroller/message-scroller.imports';
import { SCROLL_BEHAVIOR_SCRIPT } from '@zard/demo-utils/chat-scripts';
import { injectScriptedChat, scriptMessages, ZardDemoChatRowComponent } from '@zard/demo-utils/scripted-chat';

import { ExampleImports } from './example.component';

/** The message scroller's behaviours, in zard. */
@Component({
  selector: 'z-message-scroller-example',
  imports: [
    ExampleImports,
    NgIcon,
    ZardButtonComponent,
    ZardDemoChatRowComponent,
    ...ZardCardImports,
    ...ZardMessageScrollerImports,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  viewProviders: [provideIcons({ lucideArrowUp })],
  template: `
    <z-example-wrapper>
      <z-example zTitle="Transcript">
        <z-card class="h-96 w-full max-w-sm gap-0 overflow-hidden">
          <z-card-header class="gap-1 border-b">
            <z-card-title zTitle="Saved chat" />
            <z-card-description zDescription="Scroll up to reveal the button." />
          </z-card-header>
          <z-card-content class="min-h-0 flex-1 overflow-hidden p-0">
            <z-message-scroller zContentClass="p-(--card-spacing)">
              @for (message of saved; track message.id) {
                <z-message-scroller-item [zMessageId]="message.id">
                  <z-demo-chat-row [zMessage]="message" />
                </z-message-scroller-item>
              }
              <button type="button" z-message-scroller-button aria-label="Scroll to latest message"></button>
            </z-message-scroller>
          </z-card-content>
        </z-card>
      </z-example>

      <z-example zTitle="Streaming">
        <z-card class="h-96 w-full max-w-sm gap-0 overflow-hidden">
          <z-card-header class="gap-1 border-b">
            <z-card-title zTitle="New chat" />
            <z-card-description zDescription="Press send to stream the next reply." />
          </z-card-header>
          <z-card-content class="min-h-0 flex-1 overflow-hidden p-0">
            <z-message-scroller zAutoScroll [zBusy]="chat.busy()" zContentClass="p-(--card-spacing)">
              @for (message of chat.messages(); track message.id) {
                <z-message-scroller-item [zMessageId]="message.id" [zAnchor]="message.role === 'user'">
                  <z-demo-chat-row [zMessage]="message" />
                </z-message-scroller-item>
              }
              <button type="button" z-message-scroller-button aria-label="Scroll to latest message"></button>
            </z-message-scroller>
          </z-card-content>
          <z-card-footer class="justify-end border-t">
            <button
              type="button"
              z-button
              zSize="icon-sm"
              aria-label="Send"
              [disabled]="!chat.next() || chat.busy()"
              (click)="chat.send()"
            >
              <ng-icon name="lucideArrowUp" />
            </button>
          </z-card-footer>
        </z-card>
      </z-example>
    </z-example-wrapper>
  `,
})
export class MessageScrollerExampleComponent {
  protected readonly saved = scriptMessages(SCROLL_BEHAVIOR_SCRIPT);
  protected readonly chat = injectScriptedChat(SCROLL_BEHAVIOR_SCRIPT, { delayMs: 20 });
}
