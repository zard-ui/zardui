import { ChangeDetectionStrategy, Component, DestroyRef, inject, signal } from '@angular/core';

import { ZardButtonComponent } from '@/shared/components/button/button.component';
import { ZardMessageImports } from '@/shared/components/message/message.imports';
import { ZardMessageScrollerImports } from '@/shared/components/message-scroller/message-scroller.imports';

interface Turn {
  id: string;
  role: 'user' | 'assistant';
  text: string;
}

const REPLY =
  'Streaming works best when the scroller only follows you while you are at the live edge. Scroll up while this answer is arriving and it stops; the jump button appears, and one click brings you back and resumes following. Nothing moves unless you asked it to.';

@Component({
  selector: 'z-demo-message-scroller-streaming',
  imports: [ZardButtonComponent, ...ZardMessageImports, ...ZardMessageScrollerImports],
  template: `
    <div class="flex w-full max-w-md flex-col gap-3">
      <z-message-scroller zAutoScroll class="h-96 rounded-lg border">
        @for (turn of turns(); track turn.id) {
          <z-message-scroller-item [zMessageId]="turn.id" [zAnchor]="turn.role === 'user'">
            <z-message
              [zAlign]="turn.role === 'user' ? 'end' : 'start'"
              [zVariant]="turn.role === 'user' ? 'default' : 'muted'"
            >
              {{ turn.text || '…' }}
            </z-message>
          </z-message-scroller-item>
        }

        <button z-message-scroller-button zDirection="end" aria-label="Jump to latest"></button>
      </z-message-scroller>

      <button z-button zType="outline" type="button" [disabled]="streaming()" (click)="send()">
        {{ streaming() ? 'Streaming…' : 'Send a message' }}
      </button>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'contents' },
})
export class ZardDemoMessageScrollerStreamingComponent {
  private timer: ReturnType<typeof setInterval> | undefined;
  private count = 1;

  protected readonly streaming = signal(false);
  protected readonly turns = signal<Turn[]>([
    { id: 'u0', role: 'user', text: 'How should a chat scroll while an answer streams in?' },
    { id: 'a0', role: 'assistant', text: 'It should follow the answer only while you are reading the latest line.' },
  ]);

  constructor() {
    inject(DestroyRef).onDestroy(() => clearInterval(this.timer));
  }

  protected send(): void {
    const n = this.count++;
    const assistantId = `a${n}`;
    this.turns.update(turns => [
      ...turns,
      { id: `u${n}`, role: 'user', text: 'Tell me more about following the live edge.' },
      { id: assistantId, role: 'assistant', text: '' },
    ]);
    this.streaming.set(true);

    // Stands in for a model streaming tokens.
    const words = REPLY.split(' ');
    let sent = 0;
    this.timer = setInterval(() => {
      sent++;
      const text = words.slice(0, sent).join(' ');
      this.turns.update(turns => turns.map(turn => (turn.id === assistantId ? { ...turn, text } : turn)));
      if (sent >= words.length) {
        clearInterval(this.timer);
        this.streaming.set(false);
      }
    }, 70);
  }
}
