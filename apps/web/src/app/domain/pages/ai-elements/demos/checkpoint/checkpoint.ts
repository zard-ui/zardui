import { ChangeDetectionStrategy, Component, computed, DestroyRef, inject, signal } from '@angular/core';

import { ZardBubbleImports } from '@/shared/components/bubble/bubble.imports';
import { ZardButtonComponent } from '@/shared/components/button/button.component';
import { ZardMarkerImports } from '@/shared/components/marker/marker.imports';
import { ZardMessageImports } from '@/shared/components/message/message.imports';

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  text: string;
  /** A point in the conversation the person can return to, set after the agent's turn. */
  checkpoint?: { label: string };
}

/** The whole conversation. The demo starts at its end, and Continue replays what Restore dropped. */
const TRANSCRIPT: ChatMessage[] = [
  { id: 'rename-ask', role: 'user', text: 'Rename the button component to action.' },
  {
    id: 'rename',
    role: 'assistant',
    text: 'Renamed Button to Action in src/app/shared/components/button.',
    checkpoint: { label: 'Button renamed' },
  },
  { id: 'docs-ask', role: 'user', text: 'Update the docs to match.' },
  { id: 'docs', role: 'assistant', text: 'Updated the Button page to say Action.' },
];

@Component({
  selector: 'z-ai-elements-checkpoint',
  imports: [ZardButtonComponent, ...ZardBubbleImports, ...ZardMarkerImports, ...ZardMessageImports],
  template: `
    <div class="flex min-h-72 w-full max-w-sm flex-col gap-4 py-6 text-sm">
      @for (message of messages(); track message.id; let index = $index) {
        @if (message.role === 'user') {
          <z-message zAlign="end">
            <z-message-content>
              <z-bubble zAlign="end" zVariant="muted">
                <z-bubble-content>{{ message.text }}</z-bubble-content>
              </z-bubble>
            </z-message-content>
          </z-message>
        } @else {
          <z-message>
            <z-message-content>
              <p>{{ message.text }}</p>
            </z-message-content>
          </z-message>
        }

        @if (message.checkpoint; as checkpoint) {
          <z-marker zVariant="separator">
            <z-marker-content class="inline-flex items-center gap-2">
              {{ checkpoint.label }}
              <!-- There is nothing to restore when the checkpoint is the last turn. -->
              @if (index < messages().length - 1) {
                <button
                  type="button"
                  z-button
                  zType="outline"
                  zSize="xs"
                  [attr.aria-label]="'Restore to ' + checkpoint.label"
                  (click)="restore(message.id)"
                >
                  Restore
                </button>
              }
            </z-marker-content>
          </z-marker>
        }
      }

      @if (!busy() && next()) {
        <button type="button" z-button zType="outline" zSize="sm" class="mt-auto self-start" (click)="continue()">
          Continue
        </button>
      }
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'contents' },
})
export class ZardAiElementsCheckpointComponent {
  protected readonly messages = signal<ChatMessage[]>(TRANSCRIPT);
  protected readonly busy = signal(false);

  /** The person's next message in the script, once Restore has dropped it. */
  protected readonly next = computed(() => {
    const next = TRANSCRIPT[this.messages().length];
    return next?.role === 'user' ? next : undefined;
  });

  /** Bumped on every run and on destroy, so a stale run stops at its next step. */
  private run = 0;

  constructor() {
    inject(DestroyRef).onDestroy(() => this.run++);
  }

  /** Keeps the turn with the checkpoint and drops every message after it. */
  protected restore(messageId: string): void {
    const index = this.messages().findIndex(message => message.id === messageId);
    if (index === -1) return;

    this.run++;
    this.busy.set(false);
    this.messages.update(messages => messages.slice(0, index + 1));
  }

  /** Sends the next message and simulates the reply. With a real model, append the chunks your stream sends. */
  protected async continue(): Promise<void> {
    const question = this.next();
    const reply = TRANSCRIPT[this.messages().length + 1];
    if (!question || !reply) return;

    const run = ++this.run;
    this.busy.set(true);
    this.messages.update(messages => [...messages, question, { ...reply, text: '' }]);

    let shown = '';
    for (const word of reply.text.split(/(?<=\s)/)) {
      if (!(await this.wait(20, run))) return;
      shown += word;
      this.messages.update(messages => messages.map(message => (message.id === reply.id ? { ...reply, text: shown } : message)));
    }
    this.busy.set(false);
  }

  private wait(ms: number, run: number): Promise<boolean> {
    return new Promise(resolve => setTimeout(() => resolve(run === this.run), ms));
  }
}
