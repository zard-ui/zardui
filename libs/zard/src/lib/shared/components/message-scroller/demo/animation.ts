import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';

import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideArrowUp, lucideMessageCircleDashed, lucideRotateCw } from '@ng-icons/lucide';

import { ZardButtonComponent } from '@/shared/components/button/button.component';
import { ZardCardImports } from '@/shared/components/card/card.imports';
import { ZardEmptyComponent } from '@/shared/components/empty/empty.component';
import { ZardMessageScrollerImports } from '@/shared/components/message-scroller/message-scroller.imports';
import { ZardSelectImports } from '@/shared/components/select/select.imports';
import {
  type ChatScriptStep,
  injectScriptedChat,
  MESSAGE_ANIMATIONS,
  messageAnimationClass,
  type MessageAnimationId,
  ZardDemoChatRowComponent,
} from '@/shared/demo-utils/scripted-chat';

const SCRIPT: ChatScriptStep[] = [
  { role: 'user', text: 'Can user messages pop in like iMessage without breaking anchoring?' },
  {
    role: 'assistant',
    delay: 1000,
    text: 'Yes. Animate the user row with transform and opacity, and let the assistant response stream normally below it.\n\nThat keeps the row measurement predictable while still giving the newly sent bubble a more tactile entrance.',
  },
  { role: 'user', text: 'What makes the animation feel more like iMessage?' },
  {
    role: 'assistant',
    delay: 1000,
    text: 'Use a quick spring from the trailing edge: a little scale, a small upward move, and no layout animation.\n\nThe bubble feels tactile, but the measured row stays predictable, so anchoring and auto-scroll do not have to fight a changing layout.',
  },
  { role: 'user', text: 'Can I switch between presets while testing the same thread?' },
  {
    role: 'assistant',
    delay: 1000,
    text: 'Yes. Keep the conversation in place while you change the preset, then send the next message to compare the new entrance against the same context.\n\nThat makes it easier to judge the difference between a subtle fade, a snappy pop, and a more dramatic blur without rebuilding the scenario each time.',
  },
];

@Component({
  selector: 'z-demo-message-scroller-animation',
  imports: [
    NgIcon,
    ZardButtonComponent,
    ZardDemoChatRowComponent,
    ZardEmptyComponent,
    ...ZardCardImports,
    ...ZardMessageScrollerImports,
    ...ZardSelectImports,
  ],
  template: `
    <div class="relative flex w-full flex-col gap-4">
      <z-card class="mx-auto h-140 w-full max-w-sm gap-0">
        <z-card-header class="border-b">
          <z-card-title zTitle="Animation" />
          <z-card-description
            zDescription="Choose how user messages are animated when they are added to the conversation."
          />
          <z-card-action>
            <button
              type="button"
              z-button
              zType="outline"
              zSize="icon"
              aria-label="Reset animated messages"
              [disabled]="chat.messages().length === 0 || chat.busy()"
              (click)="chat.reset()"
            >
              <ng-icon name="lucideRotateCw" />
            </button>
          </z-card-action>
        </z-card-header>

        <z-card-content class="min-h-0 flex-1 overflow-hidden p-0">
          @if (chat.messages().length === 0) {
            <z-empty
              class="h-full"
              zIcon="lucideMessageCircleDashed"
              zTitle="No Messages Yet"
              zDescription="Click the button below to send the first message."
            />
          } @else {
            <z-message-scroller zContentClass="p-(--card-spacing)" [zBusy]="chat.busy()">
              @for (message of chat.messages(); track message.id) {
                <!-- Only the sent message animates; the reply streams into a plain row. -->
                <z-message-scroller-item
                  [zMessageId]="message.id"
                  [zAnchor]="message.role === 'user'"
                  [class]="message.role === 'user' ? entrance() : ''"
                >
                  <z-demo-chat-row [zMessage]="message" />
                </z-message-scroller-item>
              }
              <button type="button" z-message-scroller-button></button>
            </z-message-scroller>
          }
        </z-card-content>

        <z-card-footer class="border-t">
          <z-select class="w-40" aria-label="Animation preset" [(zValue)]="preset">
            @for (animation of animations; track animation.id) {
              <z-select-item [zValue]="animation.id">{{ animation.name }}</z-select-item>
            }
          </z-select>
          <button
            type="button"
            z-button
            zSize="icon"
            class="ms-auto"
            [disabled]="!chat.next() || chat.busy()"
            (click)="chat.send()"
          >
            <ng-icon name="lucideArrowUp" />
            <span class="sr-only">Send Message</span>
          </button>
        </z-card-footer>
      </z-card>
      <p class="text-muted-foreground mx-auto max-w-sm px-0.5 text-center text-xs text-balance">
        Select an animation then click send to see it in action.
      </p>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  viewProviders: [provideIcons({ lucideArrowUp, lucideMessageCircleDashed, lucideRotateCw })],
  host: { class: 'contents' },
})
export class ZardDemoMessageScrollerAnimationComponent {
  protected readonly animations = MESSAGE_ANIMATIONS;
  protected readonly chat = injectScriptedChat(SCRIPT, { delayMs: 15 });
  protected readonly preset = signal<string>('fade');
  protected readonly entrance = computed(() => messageAnimationClass(this.preset() as MessageAnimationId));
}
