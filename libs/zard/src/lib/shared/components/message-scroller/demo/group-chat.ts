import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';

import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideRotateCw } from '@ng-icons/lucide';

import { ZardBubbleImports } from '@/shared/components/bubble/bubble.imports';
import { ZardButtonComponent } from '@/shared/components/button/button.component';
import { ZardCardImports } from '@/shared/components/card/card.imports';
import { ZardMarkerImports } from '@/shared/components/marker/marker.imports';
import { ZardMessageImports } from '@/shared/components/message/message.imports';
import { ZardMessageScrollerImports } from '@/shared/components/message-scroller/message-scroller.imports';
import { ZardTooltipImports } from '@/shared/components/tooltip/tooltip.imports';

type GroupChatItem =
  | { id: string; type: 'event'; text: string; anchor?: boolean }
  | { id: string; type: 'message'; sender: string; role: 'assistant' | 'participant'; text: string; anchor?: boolean };

const CURRENT_USER = 'Grace';

const INITIAL_ITEMS: GroupChatItem[] = [
  {
    id: 'group-1',
    type: 'message',
    sender: 'Grace',
    role: 'participant',
    text: '@mary, the astrophage line keeps matching Venus energy output. Can you check my math?',
  },
  {
    id: 'group-2',
    type: 'message',
    sender: 'Mary (Agent)',
    role: 'assistant',
    text: 'Yes. Confirmed. The curve points to a microorganism harvesting stellar energy and breeding near carbon dioxide. If @rocky agrees, this is the clue we need.',
  },
  { id: 'group-3', type: 'message', sender: 'Grace', role: 'participant', text: 'ping @rocky', anchor: true },
];

const ROCKY_MARKER: GroupChatItem = { id: 'group-4', type: 'event', text: 'Rocky has joined the chat', anchor: true };

const ROCKY_MESSAGE: GroupChatItem = {
  id: 'group-5',
  type: 'message',
  sender: 'Rocky',
  role: 'participant',
  text: 'Amaze. Astrophage eats light, makes heat, goes to carbon dioxide. Rocky has fuel model. Grace is smart.',
};

@Component({
  selector: 'z-demo-message-scroller-group-chat',
  imports: [
    NgIcon,
    ZardButtonComponent,
    ...ZardBubbleImports,
    ...ZardCardImports,
    ...ZardMarkerImports,
    ...ZardMessageImports,
    ...ZardMessageScrollerImports,
    ...ZardTooltipImports,
  ],
  template: `
    <div class="relative flex w-full flex-col gap-4">
      <z-card class="mx-auto h-140 w-full max-w-sm gap-0">
        <z-card-header class="gap-1 border-b">
          <z-card-title zTitle="Group Chat" />
          <z-card-description
            zDescription="A group chat with several participants and an assistant. The Marker is marked as a turn."
          />
          <z-card-action>
            <button
              type="button"
              z-button
              zType="outline"
              zSize="icon"
              aria-label="Reset conversation"
              zTooltip="Reset"
              [disabled]="turn() === 'idle'"
              (click)="reset()"
            >
              <ng-icon name="lucideRotateCw" />
            </button>
          </z-card-action>
        </z-card-header>

        <z-card-content class="min-h-0 flex-1 p-0">
          @for (run of runs(); track run) {
            <z-message-scroller zContentClass="p-(--card-spacing)">
              @for (item of items(); track item.id) {
                @if (item.type === 'message') {
                  @let isCurrentUser = item.sender === currentUser;
                  <z-message-scroller-item [zMessageId]="item.id" [zAnchor]="!!item.anchor">
                    <z-message [zAlign]="isCurrentUser ? 'end' : 'start'">
                      <z-message-content>
                        @if (!isCurrentUser) {
                          <z-message-header>{{ item.sender }}</z-message-header>
                        }
                        <z-bubble
                          [zAlign]="isCurrentUser ? 'end' : 'start'"
                          [zVariant]="isCurrentUser ? 'muted' : item.role === 'assistant' ? 'ghost' : 'tinted'"
                        >
                          <z-bubble-content>{{ item.text }}</z-bubble-content>
                        </z-bubble>
                      </z-message-content>
                    </z-message>
                  </z-message-scroller-item>
                } @else {
                  <z-message-scroller-item [zMessageId]="item.id" [zAnchor]="!!item.anchor">
                    <z-marker zVariant="separator">
                      <z-marker-content>{{ item.text }}</z-marker-content>
                    </z-marker>
                  </z-message-scroller-item>
                }
              }
              <button type="button" z-message-scroller-button></button>
            </z-message-scroller>
          }
        </z-card-content>

        <z-card-footer class="flex flex-col items-center gap-2 border-t">
          <button
            type="button"
            z-button
            zType="secondary"
            class="w-full"
            [disabled]="turn() === 'message'"
            (click)="advance()"
          >
            {{ turn() === 'idle' ? 'Add Rocky' : 'Send Message as Rocky' }}
          </button>
          <p class="text-muted-foreground text-xs">
            {{
              turn() === 'idle'
                ? 'This will create a marker and make it the anchor'
                : "Now send Rocky's reply into the conversation"
            }}
          </p>
        </z-card-footer>
      </z-card>
      <p class="text-muted-foreground mx-auto max-w-sm px-0.5 text-center text-xs text-balance">
        When a user joins, a marker is created. zAnchor on the marker marks it as the next turn
      </p>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  viewProviders: [provideIcons({ lucideRotateCw })],
  host: { class: 'contents' },
})
export class ZardDemoMessageScrollerGroupChatComponent {
  protected readonly currentUser = CURRENT_USER;
  protected readonly turn = signal<'idle' | 'marker' | 'message'>('idle');
  /** Bumped on reset so the scroller starts over at its opening position. */
  protected readonly runs = signal([0]);

  protected readonly items = computed(() => {
    switch (this.turn()) {
      case 'message':
        return [...INITIAL_ITEMS, ROCKY_MARKER, ROCKY_MESSAGE];
      case 'marker':
        return [...INITIAL_ITEMS, ROCKY_MARKER];
      default:
        return INITIAL_ITEMS;
    }
  });

  protected advance(): void {
    this.turn.update(turn => (turn === 'idle' ? 'marker' : 'message'));
  }

  protected reset(): void {
    this.turn.set('idle');
    this.runs.update(([run]) => [run + 1]);
  }
}
