import { ChangeDetectionStrategy, Component, computed, DestroyRef, inject, signal } from '@angular/core';

import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideCircleCheck, lucideLoaderCircle, lucideTerminal } from '@ng-icons/lucide';

import { ZardBubbleImports } from '@/shared/components/bubble/bubble.imports';
import { ZardButtonComponent } from '@/shared/components/button/button.component';
import { ZardItemImports } from '@/shared/components/item/item.imports';
import { ZardMessageImports } from '@/shared/components/message/message.imports';
import { ZardTraceImports } from '@/shared/components/trace/trace.imports';

/** Where the tool call is: waiting for the person, running, done, or turned down. */
type ToolState = 'approval-requested' | 'running' | 'done' | 'denied';

const QUESTION = 'Clean up the build folder.';
const REASONING =
  'The build output lives in dist. Deleting it cannot be undone, so I should ask before I run the command.';
const COMMAND = 'rm -rf dist';
const APPROVED = 'Removed the dist folder.';
const DENIED = 'Okay, I left the dist folder in place.';

@Component({
  selector: 'z-ai-elements-confirmation',
  imports: [
    NgIcon,
    ZardButtonComponent,
    ...ZardBubbleImports,
    ...ZardItemImports,
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

      @if (reasoning()) {
        <z-message>
          <z-message-content class="gap-4">
            <z-trace>
              <z-trace-collapsible [zOpen]="open() ?? thinking()" (zOpenChange)="open.set($event)">
                <z-trace-collapsible-trigger>
                  <z-trace-line [zStatus]="thinking() ? 'running' : undefined">
                    <z-trace-icon>
                      <ng-icon
                        [name]="thinking() ? 'lucideLoaderCircle' : 'lucideCircleCheck'"
                        [class.animate-spin]="thinking()"
                      />
                    </z-trace-icon>
                    <z-trace-title>{{ thinking() ? 'Thinking' : 'Thought' }}</z-trace-title>
                  </z-trace-line>
                </z-trace-collapsible-trigger>
                <z-trace-collapsible-content class="whitespace-pre-wrap">{{ reasoning() }}</z-trace-collapsible-content>
              </z-trace-collapsible>
            </z-trace>

            <!-- A pending approval is a prompt, not activity, so it sits outside the trace. -->
            @if (tool() === 'approval-requested') {
              <div z-item zVariant="outline" zSize="sm">
                <div z-item-media zVariant="icon"><ng-icon name="lucideTerminal" /></div>
                <div z-item-content>
                  <div z-item-title>Run {{ command }}?</div>
                  <p z-item-description>The command runs in this project.</p>
                </div>
                <div z-item-actions>
                  <button type="button" z-button zType="outline" zSize="sm" (click)="answer(false)">Deny</button>
                  <button type="button" z-button zSize="sm" (click)="answer(true)">Approve</button>
                </div>
              </div>
            } @else if (tool()) {
              <z-trace>
                <z-trace-line [zStatus]="tool() === 'running' ? 'running' : undefined">
                  <z-trace-icon><ng-icon name="lucideTerminal" /></z-trace-icon>
                  <z-trace-title>{{ toolTitle() }} {{ command }}</z-trace-title>
                </z-trace-line>
              </z-trace>
            }
          </z-message-content>
        </z-message>
      }

      @if (reply()) {
        <z-message>
          <z-message-content>
            <p>{{ reply() }}</p>
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
  viewProviders: [provideIcons({ lucideCircleCheck, lucideLoaderCircle, lucideTerminal })],
  host: { class: 'contents' },
})
export class ZardAiElementsConfirmationComponent {
  protected readonly question = QUESTION;
  protected readonly command = COMMAND;

  protected readonly sent = signal(false);
  protected readonly thinking = signal(false);
  protected readonly reasoning = signal('');
  protected readonly open = signal<boolean | undefined>(undefined);
  protected readonly tool = signal<ToolState | null>(null);
  protected readonly reply = signal('');
  protected readonly busy = signal(false);

  protected readonly toolTitle = computed(() => {
    const state = this.tool();
    return state === 'denied' ? 'Denied' : state === 'done' ? 'Ran' : 'Running';
  });

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

  /**
   * The person's answer. With a real model, send it back with the id of the tool call, and the agent
   * runs the tool or skips it.
   */
  protected async answer(approved: boolean): Promise<void> {
    const run = ++this.run;
    this.busy.set(true);
    this.tool.set(approved ? 'running' : 'denied');

    if (approved) {
      if (!(await this.wait(1200, run))) return;
      this.tool.set('done');
    }

    if (!(await this.wait(600, run))) return;
    if (!(await this.stream(approved ? APPROVED : DENIED, text => this.reply.set(text), 20, run))) return;
    this.busy.set(false);
  }

  private reset(): void {
    this.run++;
    this.sent.set(false);
    this.thinking.set(false);
    this.reasoning.set('');
    this.open.set(undefined);
    this.tool.set(null);
    this.reply.set('');
    this.busy.set(false);
  }

  /** Simulates the agent up to the point where it asks for approval. */
  private async send(): Promise<void> {
    const run = ++this.run;
    this.sent.set(true);
    this.busy.set(true);

    if (!(await this.wait(600, run))) return;
    this.thinking.set(true);
    if (!(await this.stream(REASONING, text => this.reasoning.set(text), 40, run))) return;
    this.thinking.set(false);

    if (!(await this.wait(400, run))) return;
    this.tool.set('approval-requested');
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
