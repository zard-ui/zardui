import { ChangeDetectionStrategy, Component } from '@angular/core';

import { ZardMessageImports } from '@/shared/components/message/message.imports';
import { ZardMessageScrollerImports } from '@/shared/components/message-scroller/message-scroller.imports';

interface Turn {
  id: string;
  role: 'user' | 'assistant';
  text: string;
}

@Component({
  selector: 'z-demo-message-scroller-preview',
  imports: [...ZardMessageImports, ...ZardMessageScrollerImports],
  template: `
    <z-message-scroller class="h-96 w-full max-w-md rounded-lg border">
      @for (turn of turns; track turn.id) {
        <z-message-scroller-item [zMessageId]="turn.id">
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
export class ZardDemoMessageScrollerPreviewComponent {
  protected readonly turns: Turn[] = [
    { id: 'm1', role: 'user', text: 'Can you help me plan the release?' },
    { id: 'm2', role: 'assistant', text: 'Of course. What is the target date, and which branches are going out?' },
    { id: 'm3', role: 'user', text: 'Friday, and only the checkout and search branches.' },
    {
      id: 'm4',
      role: 'assistant',
      text: 'Then freeze both on Wednesday so QA has a full day on the release candidate.',
    },
    { id: 'm5', role: 'user', text: 'What about the database migration?' },
    {
      id: 'm6',
      role: 'assistant',
      text: 'Ship it a release ahead and keep it backwards compatible, so a rollback never needs a schema change.',
    },
    { id: 'm7', role: 'user', text: 'Makes sense. Who signs off?' },
    {
      id: 'm8',
      role: 'assistant',
      text: 'QA signs off on Thursday and the release manager gives the final go on Friday morning.',
    },
    { id: 'm9', role: 'user', text: 'And if something fails on Friday?' },
    {
      id: 'm10',
      role: 'assistant',
      text: 'Roll back to the previous tag, post in the incident channel, and reschedule for Monday after a short review.',
    },
    { id: 'm11', role: 'user', text: 'Perfect, thanks.' },
    { id: 'm12', role: 'assistant', text: 'Anytime. Want me to draft the announcement as well?' },
  ];
}
