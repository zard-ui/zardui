import { NgTemplateOutlet } from '@angular/common';
import { ChangeDetectionStrategy, Component, DestroyRef, inject, signal } from '@angular/core';

import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideBrain } from '@ng-icons/lucide';

import { ZardBubbleImports } from '@/shared/components/bubble/bubble.imports';
import { ZardButtonComponent } from '@/shared/components/button/button.component';
import { ZardMessageImports } from '@/shared/components/message/message.imports';
import { ZardTraceImports } from '@/shared/components/trace/trace.imports';

const QUESTION = 'Why is the checkout deploy so slow?';
const REASONING =
  'The build log shows install and compile finish in under a minute. Image optimization takes almost four, and it reruns on every deploy because the cache key includes the commit hash.';
const ANSWER =
  'Image optimization is the bottleneck. Key its cache on the lockfile and the image directory instead of the commit hash.';

@Component({
  selector: 'z-demo-trace-reasoning',
  imports: [
    NgIcon,
    NgTemplateOutlet,
    ZardButtonComponent,
    ...ZardBubbleImports,
    ...ZardMessageImports,
    ...ZardTraceImports,
  ],
  template: `
    <div class="flex min-h-72 w-full max-w-sm flex-col gap-4 py-6 text-sm">
      @if (sent()) {
        <z-message zAlign="end">
          <z-message-content>
            <z-bubble zAlign="end" zVariant="muted">
              <z-bubble-content>{{ question }}</z-bubble-content>
            </z-bubble>
          </z-message-content>
        </z-message>
      }

      @if (thinking() || reasoning()) {
        <z-message>
          <z-message-content class="gap-4">
            <z-trace>
              <ng-template #line>
                <z-trace-line [zStatus]="thinking() ? 'running' : undefined">
                  <z-trace-icon><ng-icon name="lucideBrain" /></z-trace-icon>
                  <z-trace-title>{{ thinking() ? 'Thinking' : 'Thought' }}</z-trace-title>
                </z-trace-line>
              </ng-template>

              <!-- A plain line until the first text arrives, then a row that follows the stream until it is toggled. -->
              @if (reasoning()) {
                <z-trace-collapsible [zOpen]="open() ?? thinking()" (zOpenChange)="open.set($event)">
                  <z-trace-collapsible-trigger>
                    <ng-container *ngTemplateOutlet="line" />
                  </z-trace-collapsible-trigger>
                  <z-trace-collapsible-content class="whitespace-pre-wrap">
                    {{ reasoning() }}
                  </z-trace-collapsible-content>
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
      }

      @if (!busy()) {
        <button type="button" z-button zType="outline" zSize="sm" class="mt-auto self-start" (click)="next()">
          {{ sent() ? 'Reset' : 'Send message' }}
        </button>
      }
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  viewProviders: [provideIcons({ lucideBrain })],
  host: { class: 'contents' },
})
export class ZardDemoTraceReasoningComponent {
  protected readonly question = QUESTION;

  protected readonly sent = signal(false);
  protected readonly thinking = signal(false);
  protected readonly reasoning = signal('');
  protected readonly open = signal<boolean | undefined>(undefined);
  protected readonly answer = signal('');
  protected readonly busy = signal(false);

  /** Bumped on every run and on destroy, so a stale run stops at its next step. */
  private run = 0;

  constructor() {
    inject(DestroyRef).onDestroy(() => this.run++);
  }

  protected next(): void {
    if (this.sent()) {
      this.reset();
    } else {
      void this.send();
    }
  }

  private reset(): void {
    this.run++;
    this.sent.set(false);
    this.thinking.set(false);
    this.reasoning.set('');
    this.open.set(undefined);
    this.answer.set('');
  }

  private async send(): Promise<void> {
    const run = ++this.run;
    this.sent.set(true);
    this.busy.set(true);
    this.thinking.set(true);

    if (!(await this.wait(400, run))) return;
    if (!(await this.stream(REASONING, text => this.reasoning.set(text), 60, run))) return;
    this.thinking.set(false);

    if (!(await this.wait(400, run))) return;
    if (!(await this.stream(ANSWER, text => this.answer.set(text), 20, run))) return;
    this.busy.set(false);
  }

  /** Reveals `text` a word at a time, like a streamed response. Resolves `false` if the run was replaced. */
  private async stream(text: string, set: (value: string) => void, delay: number, run: number): Promise<boolean> {
    let shown = '';
    for (const word of text.split(/(?<= )/)) {
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
