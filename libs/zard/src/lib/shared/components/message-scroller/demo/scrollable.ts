import { ChangeDetectionStrategy, Component } from '@angular/core';

import { ZardCardImports } from '@/shared/components/card/card.imports';
import { ZardMessageScrollerImports } from '@/shared/components/message-scroller/message-scroller.imports';
import type { ZardScrollableEdges } from '@/shared/components/message-scroller/message-scroller.service';
import { type ChatMessage, ZardDemoChatRowComponent } from '@/shared/demo-utils/scripted-chat';

const MESSAGES: ChatMessage[] = Array.from({ length: 12 }, (_, index) => ({
  id: `scrollable-${index + 1}`,
  role: index % 2 === 0 ? 'user' : 'assistant',
  text:
    index % 2 === 0
      ? `Review scroll checkpoint ${index + 1}.`
      : `Checkpoint ${index + 1} is synced. The scrollable signal updates as the viewport moves.\n\nWhen the reader is at the first message, the footer should only point them down. Once they move into the middle of the transcript, it should explain that both directions are available.\n\nAt the latest message, the footer should switch again and only point them back up.`,
}));

@Component({
  selector: 'z-demo-message-scroller-scrollable',
  imports: [ZardDemoChatRowComponent, ...ZardCardImports, ...ZardMessageScrollerImports],
  template: `
    <div class="mx-auto flex w-full max-w-sm flex-col gap-4">
      <z-card class="h-140 w-full gap-0 overflow-hidden">
        <z-card-header class="gap-1 border-b">
          <z-card-title zTitle="Scroll Status" />
          <z-card-description zDescription="Where the reader can scroll to, based on the current scroll position." />
        </z-card-header>
        <z-card-content class="min-h-0 flex-1 overflow-hidden p-0">
          <z-message-scroller
            #scroller="zMessageScroller"
            zDefaultPosition="start"
            zContentClass="gap-4 p-(--card-spacing)"
          >
            @for (message of messages; track message.id) {
              <z-message-scroller-item [zMessageId]="message.id" [zAnchor]="message.role === 'user'">
                <z-demo-chat-row [zMessage]="message" />
              </z-message-scroller-item>
            }
            <button type="button" z-message-scroller-button aria-label="Scroll to latest message"></button>
          </z-message-scroller>
        </z-card-content>
        <z-card-footer class="text-muted-foreground justify-center border-t text-center text-sm">
          {{ status(scroller.service.scrollable()) }}
        </z-card-footer>
      </z-card>
      <p class="text-muted-foreground px-0.5 text-center text-xs">Scroll the transcript to see the footer update.</p>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'contents' },
})
export class ZardDemoMessageScrollerScrollableComponent {
  protected readonly messages = MESSAGES;

  /** `start` / `end` say which edges the viewport can still scroll toward. */
  protected status({ start, end }: ZardScrollableEdges): string {
    if (start && end) return 'You can scroll both ways.';
    if (end) return 'You are at the top. You can only scroll down.';
    if (start) return 'You are at the bottom. You can only scroll up.';
    return 'All messages fit in the viewport.';
  }
}
