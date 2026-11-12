import { NgTemplateOutlet } from '@angular/common';
import { ChangeDetectionStrategy, Component, DestroyRef, inject, signal } from '@angular/core';

import { NgIcon, provideIcons } from '@ng-icons/core';
import {
  lucideArrowUpRight,
  lucideCircleAlert,
  lucideCircleCheck,
  lucideGlobe,
  lucideLoaderCircle,
} from '@ng-icons/lucide';

import { ZardBubbleImports } from '@/shared/components/bubble/bubble.imports';
import { ZardButtonComponent } from '@/shared/components/button/button.component';
import { ZardMessageImports } from '@/shared/components/message/message.imports';
import { ZardTraceImports } from '@/shared/components/trace/trace.imports';

interface ToolCall {
  readonly command: string;
  readonly state: 'running' | 'done' | 'error';
  readonly output: string;
  readonly defaultOpen?: boolean;
}

const QUESTION = 'Why does pnpm install fail in CI?';
const REASONING =
  'CI installs with a frozen lockfile, so the install stops when package.json and pnpm-lock.yaml disagree. I should check what the last commit changed, then reproduce the install.';
const TOOLS: (Omit<ToolCall, 'state'> & { failed?: boolean; duration: number })[] = [
  { command: 'pnpm --version', output: '10.18.0', duration: 700 },
  {
    command: 'git diff --stat HEAD~1 -- package.json pnpm-lock.yaml',
    output: ' package.json | 2 +-\n 1 file changed, 1 insertion(+), 1 deletion(-)',
    duration: 900,
    defaultOpen: true,
  },
  {
    command: 'pnpm install --frozen-lockfile',
    output:
      'ERR_PNPM_OUTDATED_LOCKFILE  Cannot install with "frozen-lockfile" because pnpm-lock.yaml is not up to date with package.json',
    duration: 1200,
    failed: true,
  },
];
const SOURCES = [
  { title: 'pnpm install | pnpm.io', url: 'https://pnpm.io/cli/install#--frozen-lockfile' },
  { title: 'Continuous Integration | pnpm.io', url: 'https://pnpm.io/continuous-integration' },
];
const ANSWER =
  'The last commit bumped a version in package.json without updating pnpm-lock.yaml, so the frozen install fails. Run pnpm install locally and commit the lockfile.';

@Component({
  selector: 'z-demo-trace-preview',
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
      <z-message zAlign="end">
        <z-message-content>
          <z-bubble zAlign="end" zVariant="muted">
            <z-bubble-content>{{ question }}</z-bubble-content>
          </z-bubble>
        </z-message-content>
      </z-message>

      @if (thinking() || reasoning()) {
        <z-message>
          <z-message-content class="gap-4">
            <z-trace>
              <ng-template #thinkingLine>
                <z-trace-line [zStatus]="thinking() ? 'running' : undefined">
                  <z-trace-icon>
                    <ng-icon
                      [name]="thinking() ? 'lucideLoaderCircle' : 'lucideCircleCheck'"
                      [class.animate-spin]="thinking()"
                    />
                  </z-trace-icon>
                  <z-trace-title>{{ thinking() ? 'Thinking' : 'Thought for 5s' }}</z-trace-title>
                </z-trace-line>
              </ng-template>

              @if (reasoning()) {
                <z-trace-collapsible [zOpen]="reasoningOpen() ?? thinking()" (zOpenChange)="reasoningOpen.set($event)">
                  <z-trace-collapsible-trigger>
                    <ng-container *ngTemplateOutlet="thinkingLine" />
                  </z-trace-collapsible-trigger>
                  <z-trace-collapsible-content class="whitespace-pre-wrap">
                    {{ reasoning() }}
                  </z-trace-collapsible-content>
                </z-trace-collapsible>
              } @else {
                <ng-container *ngTemplateOutlet="thinkingLine" />
              }

              @for (tool of tools(); track tool.command) {
                @if (tool.state === 'running') {
                  <z-trace-line zStatus="running">
                    <z-trace-icon><ng-icon name="lucideLoaderCircle" class="animate-spin" /></z-trace-icon>
                    <z-trace-title>Running {{ tool.command }}</z-trace-title>
                  </z-trace-line>
                } @else {
                  <z-trace-collapsible [zOpen]="tool.defaultOpen ?? false">
                    <z-trace-collapsible-trigger>
                      <z-trace-line [zStatus]="tool.state === 'error' ? 'error' : undefined">
                        <z-trace-icon>
                          <ng-icon [name]="tool.state === 'error' ? 'lucideCircleAlert' : 'lucideCircleCheck'" />
                        </z-trace-icon>
                        <z-trace-title>
                          {{ tool.state === 'error' ? 'Failed to run' : 'Ran' }} {{ tool.command }}
                        </z-trace-title>
                      </z-trace-line>
                    </z-trace-collapsible-trigger>
                    <z-trace-collapsible-content>
                      <pre
                        class="max-h-64 overflow-auto rounded-lg border px-3 py-2.5 font-mono text-xs leading-relaxed whitespace-pre-wrap"
                        [class]="
                          tool.state === 'error'
                            ? 'border-destructive/30 bg-destructive/5 text-destructive'
                            : 'bg-muted/50 text-foreground'
                        "
                        >{{ tool.output }}</pre>
                    </z-trace-collapsible-content>
                  </z-trace-collapsible>
                }
              }

              @if (sources().length) {
                <z-trace-collapsible>
                  <z-trace-collapsible-trigger>
                    <z-trace-line [zStatus]="sourcesRunning() ? 'running' : undefined">
                      <z-trace-icon>
                        <ng-icon
                          [name]="sourcesRunning() ? 'lucideLoaderCircle' : 'lucideGlobe'"
                          [class.animate-spin]="sourcesRunning()"
                        />
                      </z-trace-icon>
                      <z-trace-title>
                        {{ sourcesRunning() ? 'Using' : 'Used' }} {{ sources().length }} sources
                      </z-trace-title>
                    </z-trace-line>
                  </z-trace-collapsible-trigger>
                  <z-trace-collapsible-content>
                    <z-trace>
                      @for (source of sources(); track source.url) {
                        <a [href]="source.url" target="_blank" rel="noreferrer">
                          <z-trace-line>
                            <z-trace-icon><ng-icon name="lucideGlobe" /></z-trace-icon>
                            <z-trace-title>
                              {{ source.title }}
                              <span class="sr-only">(opens in a new tab)</span>
                            </z-trace-title>
                            <z-trace-icon><ng-icon name="lucideArrowUpRight" /></z-trace-icon>
                          </z-trace-line>
                        </a>
                      }
                    </z-trace>
                  </z-trace-collapsible-content>
                </z-trace-collapsible>
              }
            </z-trace>

            @if (answer()) {
              <p>{{ answer() }}</p>
            }
          </z-message-content>
        </z-message>
      }

      @if (!busy()) {
        <button type="button" z-button zType="outline" zSize="sm" class="mt-auto self-start" (click)="replay()">
          Replay
        </button>
      }
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  viewProviders: [
    provideIcons({ lucideArrowUpRight, lucideCircleAlert, lucideCircleCheck, lucideGlobe, lucideLoaderCircle }),
  ],
  host: { class: 'contents' },
})
export class ZardDemoTracePreviewComponent {
  protected readonly question = QUESTION;

  // The page opens on the finished turn; Replay streams it again.
  protected readonly reasoning = signal(REASONING);
  protected readonly thinking = signal(false);
  /** Undefined until the reader toggles the row, so the reasoning stays open while it streams. */
  protected readonly reasoningOpen = signal<boolean | undefined>(undefined);
  protected readonly tools = signal<ToolCall[]>(
    TOOLS.map(tool => ({ ...tool, state: tool.failed ? 'error' : 'done' })),
  );

  protected readonly sources = signal(SOURCES);
  protected readonly sourcesRunning = signal(false);
  protected readonly answer = signal(ANSWER);
  protected readonly busy = signal(false);

  /** Bumped on every replay and on destroy, so a stale run stops at its next step. */
  private run = 0;

  constructor() {
    inject(DestroyRef).onDestroy(() => this.run++);
  }

  protected async replay(): Promise<void> {
    const run = ++this.run;
    this.busy.set(true);
    this.reasoning.set('');
    this.reasoningOpen.set(undefined);
    this.tools.set([]);
    this.sources.set([]);
    this.answer.set('');

    this.thinking.set(true);
    if (!(await this.stream(REASONING, text => this.reasoning.set(text), 40, run))) return;
    this.thinking.set(false);

    for (const { failed, duration, ...tool } of TOOLS) {
      this.tools.update(tools => [...tools, { ...tool, state: 'running' }]);
      if (!(await this.wait(duration, run))) return;
      this.tools.update(tools =>
        tools.map(item => (item.command === tool.command ? { ...item, state: failed ? 'error' : 'done' } : item)),
      );
    }

    this.sources.set(SOURCES);
    this.sourcesRunning.set(true);
    if (!(await this.wait(1000, run))) return;
    this.sourcesRunning.set(false);

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
