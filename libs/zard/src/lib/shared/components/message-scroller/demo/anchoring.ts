import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';

import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideArrowUp, lucideMessageCircleDashed, lucideRotateCw } from '@ng-icons/lucide';

import { ZardButtonComponent } from '@/shared/components/button/button.component';
import { ZardCardImports } from '@/shared/components/card/card.imports';
import { ZardEmptyComponent } from '@/shared/components/empty/empty.component';
import { ZardMessageScrollerImports } from '@/shared/components/message-scroller/message-scroller.imports';
import {
  ZardToggleGroupComponent,
  type ZardToggleGroupItem,
} from '@/shared/components/toggle-group/toggle-group.component';
import {
  type ChatMessage,
  type ChatRole,
  messageAnimationClass,
  ZardDemoChatRowComponent,
} from '@/shared/demo-utils/scripted-chat';

const SCRIPT: ChatMessage[] = [
  {
    id: 'anchor-1-user',
    role: 'user',
    text: 'Can you show me how anchoring behaves when a new prompt starts the turn?',
  },
  {
    id: 'anchor-1-assistant',
    role: 'assistant',
    text: 'Append the user prompt first, then append the assistant response. With User selected, the prompt settles near the top and the assistant response fills in below it.',
  },
  { id: 'anchor-2-user', role: 'user', text: 'What changes when assistant messages are the anchor?' },
  {
    id: 'anchor-2-assistant',
    role: 'assistant',
    text: 'Now each assistant response is the row `z-message-scroller` keeps in view. This is useful when the reply is the moment you want readers to land on after each turn.',
  },
  { id: 'anchor-3-user', role: 'user', text: 'Can I switch roles and keep adding turns?' },
  {
    id: 'anchor-3-assistant',
    role: 'assistant',
    text: 'Yes. The next appended message with the selected role becomes the anchor, so you can compare user and assistant anchoring without resetting the demo.',
  },
];

@Component({
  selector: 'z-demo-message-scroller-anchoring',
  imports: [
    NgIcon,
    ZardButtonComponent,
    ZardDemoChatRowComponent,
    ZardEmptyComponent,
    ZardToggleGroupComponent,
    ...ZardCardImports,
    ...ZardMessageScrollerImports,
  ],
  template: `
    <div class="relative flex w-full flex-col gap-4">
      <z-card class="mx-auto h-140 w-full max-w-sm gap-0">
        <z-card-header class="border-b">
          <z-card-title zTitle="Anchoring Turns" />
          <z-card-description zDescription="Choose which role settles near the top edge." />
          <z-card-action>
            <button
              type="button"
              z-button
              zType="outline"
              zSize="icon"
              aria-label="Reset anchored turns"
              [disabled]="messages().length === 0"
              (click)="reset()"
            >
              <ng-icon name="lucideRotateCw" />
            </button>
          </z-card-action>
        </z-card-header>

        <z-card-content class="min-h-0 flex-1 overflow-hidden p-0">
          @if (messages().length === 0) {
            <z-empty
              class="h-full"
              zIcon="lucideMessageCircleDashed"
              zTitle="No anchored messages yet"
              zDescription="Send the first message to see the selected role anchor."
            />
          } @else {
            <z-message-scroller zContentClass="p-(--card-spacing)">
              @for (message of messages(); track message.id) {
                <z-message-scroller-item
                  [zMessageId]="message.id"
                  [zAnchor]="message.role === anchorRole()"
                  [class]="message.role === 'user' ? entrance : ''"
                >
                  <z-demo-chat-row [zMessage]="message" />
                </z-message-scroller-item>
              }
              <button type="button" z-message-scroller-button></button>
            </z-message-scroller>
          }
        </z-card-content>

        <z-card-footer>
          <z-toggle-group
            zMode="single"
            zType="outline"
            aria-label="Select scroll anchor role"
            [zItems]="roles"
            [zValue]="anchorRole()"
            (valueChange)="selectRole($event)"
          />
          <button type="button" z-button zSize="icon" class="ms-auto" [disabled]="!nextMessage()" (click)="send()">
            <ng-icon name="lucideArrowUp" />
            <span class="sr-only">Send Message</span>
          </button>
        </z-card-footer>
      </z-card>
      <p class="text-muted-foreground mx-auto max-w-xs px-0.5 text-center text-xs">
        Toggle the anchor role, then send messages to compare where turns settle.
      </p>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  viewProviders: [provideIcons({ lucideArrowUp, lucideMessageCircleDashed, lucideRotateCw })],
  host: { class: 'contents' },
})
export class ZardDemoMessageScrollerAnchoringComponent {
  protected readonly roles: ZardToggleGroupItem[] = [
    { value: 'user', label: 'User', ariaLabel: 'Anchor user messages' },
    { value: 'assistant', label: 'Assistant', ariaLabel: 'Anchor assistant messages' },
  ];

  protected readonly entrance = messageAnimationClass('slide-up');
  protected readonly anchorRole = signal<ChatRole>('user');
  protected readonly messages = signal<ChatMessage[]>([]);
  protected readonly nextMessage = computed(() => SCRIPT[this.messages().length]);

  protected send(): void {
    const next = this.nextMessage();
    if (next) {
      this.messages.update(messages => [...messages, next]);
    }
  }

  protected selectRole(value: string | string[]): void {
    const role = Array.isArray(value) ? value[0] : value;
    if (role === 'user' || role === 'assistant') {
      this.anchorRole.set(role);
      this.reset();
    }
  }

  protected reset(): void {
    this.messages.set([]);
  }
}
