import { ChangeDetectionStrategy, Component } from '@angular/core';

import { ZardMessageImports } from '@/shared/components/message/message.imports';
import { ZardMessageScrollerImports } from '@/shared/components/message-scroller/message-scroller.imports';

interface Turn {
  id: string;
  role: 'user' | 'assistant';
  text: string;
}

@Component({
  selector: 'z-demo-message-scroller-last-anchor',
  imports: [...ZardMessageImports, ...ZardMessageScrollerImports],
  template: `
    <z-message-scroller zDefaultPosition="last-anchor" class="h-96 w-full max-w-md rounded-lg border">
      @for (turn of turns; track turn.id) {
        <z-message-scroller-item [zMessageId]="turn.id" [zAnchor]="turn.role === 'user'">
          <z-message
            [zAlign]="turn.role === 'user' ? 'end' : 'start'"
            [zVariant]="turn.role === 'user' ? 'default' : 'muted'"
          >
            {{ turn.text }}
          </z-message>
        </z-message-scroller-item>
      }

      <button z-message-scroller-button zDirection="end" aria-label="Jump to latest"></button>
    </z-message-scroller>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'contents' },
})
export class ZardDemoMessageScrollerLastAnchorComponent {
  protected readonly turns: Turn[] = [
    { id: 't1', role: 'user', text: 'What does a saved thread need to reopen well?' },
    { id: 't2', role: 'assistant', text: 'The last turn the reader was in, not the very bottom of the transcript.' },
    { id: 't3', role: 'user', text: 'Walk me through how to choose where it opens.' },
    {
      id: 't4',
      role: 'assistant',
      text: 'Start from the last message that begins a turn, usually the one the reader sent. Everything after it is the reply they have not finished reading.',
    },
    {
      id: 't5',
      role: 'assistant',
      text: 'If that whole turn fits on screen, there is nothing to choose: the end of the transcript already shows it, so the scroller opens there.',
    },
    {
      id: 't6',
      role: 'assistant',
      text: 'When the reply is longer than the viewport, opening at the very end drops the reader in the middle of an answer with no sign of the question it belongs to.',
    },
    {
      id: 't7',
      role: 'assistant',
      text: 'Opening at the last anchor puts the question at the top and the answer right below it, so the reader can simply start reading.',
    },
    {
      id: 't8',
      role: 'assistant',
      text: 'The position is applied once, on the first non-empty render. After that the reader is in control, and new content never moves them on its own.',
    },
  ];
}
