import { NgTemplateOutlet } from '@angular/common';
import { ChangeDetectionStrategy, Component, DestroyRef, inject, signal } from '@angular/core';

import { ZardBubbleImports } from '@/shared/components/bubble/bubble.imports';
import { ZardButtonComponent } from '@/shared/components/button/button.component';
import { ZardMessageImports } from '@/shared/components/message/message.imports';
import { ZardTraceImports } from '@/shared/components/trace/trace.imports';

const QUESTION = 'Why is the checkout deploy so slow?';
const REASONING =
  'The deploy log has three phases. Install takes 38s and ng build takes 52s, both normal for this repo.\n\nImage optimization takes 3m 50s. It reruns on every deploy because its cache key includes the commit hash, so the cache never hits.';
const ANSWER =
  'Image optimization is the bottleneck. Key its cache on the lockfile and the image directory instead of the commit hash, and the deploy should take under two minutes.';

@Component({
  selector: 'z-ai-elements-reasoning',
  imports: [
    NgTemplateOutlet,
    ZardButtonComponent,
    ...ZardBubbleImports,
    ...ZardMessageImports,
    ...ZardTraceImports,
  ],
  template: `
    <div class="flex min-h-72 w-full max-w-sm flex-col gap-4 py-6 text-sm">
      <z-message zAlign="end">
        <z-message-content>
          <z-bubble zAlign="end" zVariant="muted">
            <z-bubble-content>{{ question }}</z-bubble-content>
          </z-bubble>
        </z-message-content>
      </z-message>

      <z-message>
        <z-message-content class="gap-4">
          <z-trace>
            <ng-template #line>
              <z-trace-line [zStatus]="thinking() ? 'running' : undefined">
                <z-trace-title>{{ thinking() ? 'Thinking' : 'Thought for 5s' }}</z-trace-title>
              </z-trace-line>
            </ng-template>

            <!-- A plain line until the first text arrives, so there is nothing to open before the model has written anything. -->
            @if (reasoning()) {
              <z-trace-collapsible [zOpen]="open() ?? thinking()" (zOpenChange)="open.set($event)">
                <z-trace-collapsible-trigger>
                  <ng-container *ngTemplateOutlet="line" />
                </z-trace-collapsible-trigger>
                <z-trace-collapsible-content class="whitespace-pre-wrap">{{ reasoning() }}</z-trace-collapsible-content>
              </z-trace-collapsible>
            } @else {
              <ng-container *ngTemplateOutlet="line" />
            }
          </z-trace>

          @if (answer()) {
            <p>{{ answer() }}</p>
          }
        </z-message-content>
      </z-message>

      @if (!busy()) {
        <button type="button" z-button zType="outline" zSize="sm" class="mt-auto self-start" (click)="replay()">
          Replay
        </button>
      }
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'contents' },
})
export class ZardAiElementsReasoningComponent {
  protected readonly question = QUESTION;

  /** Starts at the end of the run, open, so the reply reads in full until it is replayed. */
  protected readonly thinking = signal(false);
  protected readonly reasoning = signal(REASONING);
  /** The reader's choice. `undefined` until they toggle the row, so it follows the stream until then. */
  protected readonly open = signal<boolean | undefined>(true);
  protected readonly answer = signal(ANSWER);
  protected readonly busy = signal(false);

  /** Bumped on every run and on destroy, so a stale run stops at its next step. */
  private run = 0;

  constructor() {
    inject(DestroyRef).onDestroy(() => this.run++);
  }

  /**
   * Simulates the agent. With a real model, write each reasoning and text chunk your stream sends into
   * `reasoning` and `answer` instead — the template only reads the signals.
   */
  protected async replay(): Promise<void> {
    const run = ++this.run;
    this.busy.set(true);
    this.thinking.set(true);
    this.reasoning.set('');
    this.open.set(undefined);
    this.answer.set('');

    if (!(await this.wait(400, run))) return;
    if (!(await this.stream(REASONING, text => this.reasoning.set(text), 40, run))) return;
    this.thinking.set(false);

    if (!(await this.wait(400, run))) return;
    if (!(await this.stream(ANSWER, text => this.answer.set(text), 20, run))) return;
    this.busy.set(false);
  }

  /** Reveals `text` a word at a time, like a streamed response. Resolves `false` if the run was replaced. */
  private async stream(text: string, set: (value: string) => void, delay: number, run: number): Promise<boolean> {
    let shown = '';
    for (const word of text.split(/(?<=\s)/)) {
      if (!(await this.wait(delay, run))) return false;
      shown += word;
      set(shown);
    }
    return true;
  }

  private wait(ms: number, run: number): Promise<boolean> {
    return new Promise(resolve => setTimeout(() => resolve(run === this.run), ms));
  }
}
