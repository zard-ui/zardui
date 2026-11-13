import { ChangeDetectionStrategy, Component } from '@angular/core';

import { ZardCardImports } from '@/shared/components/card/card.imports';
import { ZardHoverCardComponent, ZardHoverCardDirective } from '@/shared/components/hover-card/hover-card.component';
import { ZardMessageScrollerImports } from '@/shared/components/message-scroller/message-scroller.imports';
import { type ChatScriptStep, scriptMessages, ZardDemoChatRowComponent } from '@/shared/demo-utils/scripted-chat';

const MESSAGES = scriptMessages([
  { id: 'vis-brief', role: 'user', text: 'Review the incident handoff and tell me what to read first.' },
  {
    role: 'assistant',
    text: 'Start with the summary and the impact section. The regression affected the upload queue, but the recovery path completed for every queued job.',
  },
  { id: 'vis-impact', role: 'user', text: 'What was the customer impact?' },
  {
    role: 'assistant',
    text: 'Impact was limited to delayed processing.\n\nNo records were dropped, and the reconciliation worker confirmed each retry batch. Support saw confusion from two customers, but there were no checkout or billing errors.',
  },
  { id: 'vis-actions', role: 'user', text: 'What actions are open?' },
  {
    role: 'assistant',
    text: 'Keep the retry window enabled until the next deploy, then add a queue-depth alert as the long-term fix.\n\nThe alert should fire on sustained queue growth, not a single short spike.',
  },
  { id: 'vis-checklist', role: 'user', text: 'Give me the follow-up checklist.' },
  {
    role: 'assistant',
    text: 'After that, compare the queue recovery graph with the deploy timeline so the handoff shows exactly when processing returned to baseline. That makes it easier for support and engineering to answer the same customer questions without re-reading the whole incident thread.\n\nI would also add a short owner note beside each follow-up item. The checklist is small, but ownership keeps the retry-window decision, alert tuning, and support macro from drifting into separate follow-up conversations.\n\nKeep the retry window enabled until the next deploy, then add a queue-depth alert as the long-term fix.\n\nThe alert should fire on sustained queue growth, not a single short spike.',
  },
] satisfies ChatScriptStep[]);

@Component({
  selector: 'z-demo-message-scroller-visibility',
  imports: [
    ZardDemoChatRowComponent,
    ZardHoverCardComponent,
    ZardHoverCardDirective,
    ...ZardCardImports,
    ...ZardMessageScrollerImports,
  ],
  template: `
    <div class="relative flex w-full flex-col gap-4">
      <div class="relative mx-auto w-full max-w-sm">
        <z-card class="h-140 w-full gap-0">
          <z-card-header class="gap-1 border-b">
            <z-card-title zTitle="Transcript Outline" />
            <z-card-description zDescription="Track the current anchored turn." />
          </z-card-header>
          <z-card-content class="min-h-0 flex-1 overflow-hidden p-0">
            <z-message-scroller #scroller="zMessageScroller" zContentClass="p-(--card-spacing)" [zScrollMargin]="12">
              @for (message of messages; track message.id) {
                <z-message-scroller-item [zMessageId]="message.id" [zAnchor]="message.role === 'user'">
                  <z-demo-chat-row [zMessage]="message" />
                </z-message-scroller-item>
              }
              <button type="button" z-message-scroller-button aria-label="Scroll to latest message"></button>
            </z-message-scroller>
          </z-card-content>
        </z-card>

        <!-- currentAnchorId follows the turn being read, even after its question scrolled above the viewport. -->
        @let current = scroller.service.currentAnchorId();
        <div class="absolute top-1/2 -right-12 -translate-y-1/2">
          <button
            type="button"
            aria-label="Open transcript outline"
            class="focus-visible:ring-ring/50 flex size-9 flex-col items-center justify-center gap-1 rounded-md outline-none focus-visible:ring-3"
            zPlacement="left"
            [zHoverCard]="outline"
            [zOpenDelay]="100"
          >
            @for (message of questions; track message.id) {
              <span
                class="bg-muted-foreground/40 data-[current=true]:bg-foreground h-0.5 w-4 rounded-full"
                [attr.data-current]="message.id === current"
              ></span>
            }
          </button>
        </div>

        <ng-template #outline>
          <z-hover-card class="flex w-64 flex-col gap-1 rounded-2xl p-1">
            @for (message of questions; track message.id) {
              <button
                type="button"
                class="hover:bg-accent hover:text-accent-foreground focus-visible:bg-accent aria-current:bg-accent aria-current:text-accent-foreground flex min-h-7 items-center rounded-xl px-2 py-1.5 text-start text-sm transition-colors outline-none"
                [attr.aria-current]="message.id === current ? 'location' : null"
                (click)="scroller.service.scrollToMessage(message.id, { align: 'start', behavior: 'smooth' })"
              >
                <span class="line-clamp-1 min-w-0">{{ trim(message.text) }}</span>
              </button>
            }
          </z-hover-card>
        </ng-template>
      </div>
      <p class="text-muted-foreground mx-auto max-w-sm px-0.5 text-center text-xs">
        Open the outline to jump between anchored turns as you read.
      </p>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'contents' },
})
export class ZardDemoMessageScrollerVisibilityComponent {
  protected readonly messages = MESSAGES;
  protected readonly questions = MESSAGES.filter(message => message.role === 'user');

  protected trim(text: string): string {
    return text.length > 42 ? `${text.slice(0, 39)}...` : text;
  }
}
