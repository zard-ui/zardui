import { ChangeDetectionStrategy, Component, DestroyRef, inject, signal } from '@angular/core';

import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideTerminal } from '@ng-icons/lucide';

import { ZardBubbleImports } from '@/shared/components/bubble/bubble.imports';
import { ZardButtonComponent } from '@/shared/components/button/button.component';
import { ZardMessageImports } from '@/shared/components/message/message.imports';
import { ZardTraceImports } from '@/shared/components/trace/trace.imports';

interface ToolCall {
  readonly command: string;
  readonly state: 'running' | 'done' | 'error';
  readonly output: string;
}

const QUESTION = 'Which package managers are installed?';
const COMMANDS = [
  { command: 'node --version', output: 'v24.18.0', failed: false },
  { command: 'npm --version', output: '11.6.2', failed: false },
  { command: 'pnpm --version', output: 'command not found: pnpm', failed: true },
];
const ANSWER = 'Node 24 and npm 11 are installed. pnpm is not.';

@Component({
  selector: 'z-demo-trace-tool',
  imports: [NgIcon, ZardButtonComponent, ...ZardBubbleImports, ...ZardMessageImports, ...ZardTraceImports],
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

      @if (tools().length) {
        <z-message>
          <z-message-content class="gap-4">
            <z-trace>
              @for (tool of tools(); track tool.command) {
                @if (tool.state === 'running') {
                  <z-trace-line zStatus="running">
                    <z-trace-icon><ng-icon name="lucideTerminal" /></z-trace-icon>
                    <z-trace-title>Running {{ tool.command }}</z-trace-title>
                  </z-trace-line>
                } @else {
                  <z-trace-collapsible>
                    <z-trace-collapsible-trigger>
                      <z-trace-line [zStatus]="tool.state === 'error' ? 'error' : undefined">
                        <z-trace-icon><ng-icon name="lucideTerminal" /></z-trace-icon>
                        <z-trace-title>
                          {{ tool.state === 'error' ? 'Failed to run' : 'Ran' }} {{ tool.command }}
                        </z-trace-title>
                      </z-trace-line>
                    </z-trace-collapsible-trigger>
                    <z-trace-collapsible-content>
                      <pre
                        class="bg-muted/50 text-foreground max-h-64 overflow-auto rounded-lg border px-3 py-2.5 font-mono text-xs leading-relaxed whitespace-pre-wrap"
                        >{{ tool.output }}</pre>
                    </z-trace-collapsible-content>
                  </z-trace-collapsible>
                }
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
  viewProviders: [provideIcons({ lucideTerminal })],
  host: { class: 'contents' },
})
export class ZardDemoTraceToolComponent {
  protected readonly question = QUESTION;

  protected readonly sent = signal(false);
  protected readonly tools = signal<ToolCall[]>([]);
  protected readonly answer = signal('');
  protected readonly busy = signal(false);

  /** Bumped on every run and on destroy, so a stale run stops at its next step. */
  private run = 0;

  constructor() {
    inject(DestroyRef).onDestroy(() => this.run++);
  }

  protected next(): void {
    if (this.sent()) {
      this.run++;
      this.sent.set(false);
      this.tools.set([]);
      this.answer.set('');
    } else {
      void this.send();
    }
  }

  private async send(): Promise<void> {
    const run = ++this.run;
    this.sent.set(true);
    this.busy.set(true);

    for (const { failed, ...tool } of COMMANDS) {
      this.tools.update(tools => [...tools, { ...tool, state: 'running' }]);
      if (!(await this.wait(900, run))) return;
      this.tools.update(tools =>
        tools.map(item => (item.command === tool.command ? { ...item, state: failed ? 'error' : 'done' } : item)),
      );
    }

    let shown = '';
    for (const word of ANSWER.split(/(?<= )/)) {
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
