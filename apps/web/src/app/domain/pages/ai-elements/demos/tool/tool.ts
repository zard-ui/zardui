import { ChangeDetectionStrategy, Component, DestroyRef, inject, signal } from '@angular/core';

import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideTerminal } from '@ng-icons/lucide';

import { ZardBubbleImports } from '@/shared/components/bubble/bubble.imports';
import { ZardButtonComponent } from '@/shared/components/button/button.component';
import { ZardCodeBlockImports } from '@/shared/components/code-block/code-block.imports';
import { ZardMessageImports } from '@/shared/components/message/message.imports';
import { ZardTraceImports } from '@/shared/components/trace/trace.imports';

/** A call to the agent's `runCommand` tool, from the moment it starts to its result. */
interface ToolCall {
  id: string;
  command: string;
  state: 'running' | 'output' | 'error';
  output?: string;
}

const QUESTION = 'Which package managers are installed?';
/** What each call returns: its output, or the error it fails with. */
const CALLS: { command: string; output?: string; error?: string }[] = [
  { command: 'node --version', output: 'v24.18.0' },
  { command: 'npm --version', output: '11.6.2' },
  { command: 'pnpm --version', error: 'command not found: pnpm' },
];
const ANSWER = 'Node 24 and npm 11 are installed. pnpm is not.';

function finished(): ToolCall[] {
  return CALLS.map((call, index) => ({
    id: `call-${index}`,
    command: call.command,
    state: call.error ? 'error' : 'output',
    output: call.error ?? call.output,
  }));
}

@Component({
  selector: 'z-ai-elements-tool',
  imports: [
    NgIcon,
    ZardButtonComponent,
    ...ZardBubbleImports,
    ...ZardCodeBlockImports,
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
          @if (calls().length) {
            <z-trace>
              @for (call of calls(); track call.id) {
                <!-- A plain line while the call runs, and a row that opens into its output once it arrives. -->
                @if (call.state === 'running') {
                  <z-trace-line [zStatus]="busy() ? 'running' : 'error'">
                    <z-trace-icon><ng-icon name="lucideTerminal" /></z-trace-icon>
                    <z-trace-title>{{ busy() ? 'Running' : 'Failed to run' }} {{ call.command }}</z-trace-title>
                  </z-trace-line>
                } @else {
                  <!-- In the saved transcript, a call that failed opens on its error. -->
                  <z-trace-collapsible [zOpen]="!replayed() && call.state === 'error'">
                    <z-trace-collapsible-trigger>
                      <z-trace-line [zStatus]="call.state === 'error' ? 'error' : undefined">
                        <z-trace-icon><ng-icon name="lucideTerminal" /></z-trace-icon>
                        <z-trace-title>
                          {{ call.state === 'error' ? 'Failed to run' : 'Ran' }} {{ call.command }}
                        </z-trace-title>
                      </z-trace-line>
                    </z-trace-collapsible-trigger>
                    <z-trace-collapsible-content>
                      <z-code-block zSize="sm">
                        <z-code-block-content zWrap class="max-h-64">{{ call.output }}</z-code-block-content>
                      </z-code-block>
                    </z-trace-collapsible-content>
                  </z-trace-collapsible>
                }
              }
            </z-trace>
          }

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
  viewProviders: [provideIcons({ lucideTerminal })],
  host: { class: 'contents' },
})
export class ZardAiElementsToolComponent {
  protected readonly question = QUESTION;

  /** Starts at the end of the run, so the reply reads in full until it is replayed. */
  protected readonly calls = signal<ToolCall[]>(finished());
  protected readonly answer = signal(ANSWER);
  protected readonly busy = signal(false);
  protected readonly replayed = signal(false);

  /** Bumped on every run and on destroy, so a stale run stops at its next step. */
  private run = 0;

  constructor() {
    inject(DestroyRef).onDestroy(() => this.run++);
  }

  /**
   * Simulates the agent. With a real model, add a call when the tool starts and replace it, by its id,
   * when its result arrives — the template only reads the signals.
   */
  protected async replay(): Promise<void> {
    const run = ++this.run;
    this.busy.set(true);
    this.replayed.set(true);
    this.calls.set([]);
    this.answer.set('');

    for (const [index, call] of CALLS.entries()) {
      const id = `call-${index}`;
      this.calls.update(calls => [...calls, { id, command: call.command, state: 'running' }]);
      if (!(await this.wait(900, run))) return;
      this.calls.update(calls =>
        calls.map(item =>
          item.id === id
            ? { ...item, state: call.error ? 'error' : 'output', output: call.error ?? call.output }
            : item,
        ),
      );
    }

    let shown = '';
    for (const word of ANSWER.split(/(?<=\s)/)) {
      if (!(await this.wait(20, run))) return;
      shown += word;
      this.answer.set(shown);
    }
    this.busy.set(false);
  }

  private wait(ms: number, run: number): Promise<boolean> {
    return new Promise(resolve => setTimeout(() => resolve(run === this.run), ms));
  }
}
