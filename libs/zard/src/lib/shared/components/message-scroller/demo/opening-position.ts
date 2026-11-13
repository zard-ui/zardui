import { ChangeDetectionStrategy, Component, signal } from '@angular/core';

import { ZardCardImports } from '@/shared/components/card/card.imports';
import { ZardMessageScrollerImports } from '@/shared/components/message-scroller/message-scroller.imports';
import type { ZardMessageScrollerPosition } from '@/shared/components/message-scroller/message-scroller.service';
import {
  ZardToggleGroupComponent,
  type ZardToggleGroupItem,
} from '@/shared/components/toggle-group/toggle-group.component';
import { type ChatMessage, ZardDemoChatRowComponent } from '@/shared/demo-utils/scripted-chat';

const MESSAGES: ChatMessage[] = [
  { id: 'open-1', role: 'user', text: 'This is the first message the user sent in the conversation.' },
  {
    id: 'open-2',
    role: 'assistant',
    text: 'Workspace creation rose 8%, but first invite completion only rose 2%.',
  },
  { id: 'open-3', role: 'user', text: 'This is the last message the user sent in the conversation.' },
  {
    id: 'open-4',
    role: 'assistant',
    text: 'Start with the invite step. Teams are creating workspaces but waiting to add collaborators.\n\nRecommended follow-up:\n\n1. Compare invite drop-off by account size.\n2. Check whether users who skip invites still return within 24 hours.\n3. Review the empty-state copy on the first project screen.\n4. Segment activation by template, since template users may not need invites right away.\n\nIf that pattern holds, the next experiment should make collaboration useful earlier instead of prompting for invites harder.',
  },
];

@Component({
  selector: 'z-demo-message-scroller-opening-position',
  imports: [ZardDemoChatRowComponent, ZardToggleGroupComponent, ...ZardCardImports, ...ZardMessageScrollerImports],
  template: `
    <div class="relative flex w-full flex-col gap-4">
      <z-card class="mx-auto h-140 w-full max-w-sm gap-0">
        <z-card-header class="gap-1 border-b">
          <z-card-title zTitle="Opening Position" />
          <z-card-description zDescription="Choose where a saved transcript opens." />
        </z-card-header>

        <z-card-content class="min-h-0 flex-1 overflow-hidden p-0">
          <!-- A new scroller per choice, so each one opens fresh at its default position. -->
          @for (current of [position()]; track current) {
            <z-message-scroller zContentClass="p-(--card-spacing)" [zDefaultPosition]="current" [zScrollMargin]="64">
              @for (message of messages; track message.id) {
                <z-message-scroller-item [zMessageId]="message.id" [zAnchor]="message.role === 'user'">
                  <z-demo-chat-row [zMessage]="message" />
                </z-message-scroller-item>
              }
              <button type="button" z-message-scroller-button></button>
            </z-message-scroller>
          }
        </z-card-content>

        <z-card-footer class="flex items-center justify-center border-t">
          <z-toggle-group
            class="w-full"
            zItemClass="flex-1"
            zMode="single"
            zType="outline"
            aria-label="Opening position"
            [zItems]="positions"
            [zValue]="position()"
            (valueChange)="select($event)"
          />
        </z-card-footer>
      </z-card>
      <p class="text-muted-foreground mx-auto max-w-sm px-0.5 text-center text-xs">
        Toggle zDefaultPosition to see where the transcript starts when you open the thread
      </p>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'contents' },
})
export class ZardDemoMessageScrollerOpeningPositionComponent {
  protected readonly messages = MESSAGES;
  protected readonly positions: ZardToggleGroupItem[] = [
    { value: 'start', label: 'start' },
    { value: 'end', label: 'end' },
    { value: 'last-anchor', label: 'last-anchor' },
  ];

  protected readonly position = signal<ZardMessageScrollerPosition>('last-anchor');

  protected select(value: string | string[]): void {
    const next = Array.isArray(value) ? value[0] : value;
    if (next === 'start' || next === 'end' || next === 'last-anchor') {
      this.position.set(next);
    }
  }
}
