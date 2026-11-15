import {
  ChangeDetectionStrategy,
  Component,
  computed,
  DestroyRef,
  inject,
  input,
  type OnInit,
  signal,
} from '@angular/core';

import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideTerminal } from '@ng-icons/lucide';

import { ZardBubbleImports } from '@/shared/components/bubble/bubble.imports';
import { ZardButtonComponent } from '@/shared/components/button/button.component';
import { ZardCodeBlockImports } from '@/shared/components/code-block/code-block.imports';
import { ZardMessageImports } from '@/shared/components/message/message.imports';
import { ZardTraceImports } from '@/shared/components/trace/trace.imports';

/** A command the agent runs. `exitCode` is set once it exits. */
interface Command {
  id: string;
  command: string;
  output: string;
  exitCode?: number;
}

const QUESTION = 'Run the checks, then build the app.';
const COMMANDS = [
  { id: 'lint', command: 'ng lint', output: ['> acme-chat@0.1.0 lint', '> ng lint', '', 'All files pass linting.'] },
  {
    id: 'test',
    command: 'ng test',
    output: [
      '> acme-chat@0.1.0 test',
      '> ng test --watch=false',
      '',
      ' ✓ src/app/chat/chat.service.spec.ts (6 tests) 41ms',
      ' ✓ src/app/chat/chat.spec.ts (9 tests) 212ms',
      '',
      ' Test Files  2 passed (2)',
      '      Tests  15 passed (15)',
    ],
  },
  {
    id: 'build',
    command: 'ng build',
    output: [
      '> acme-chat@0.1.0 build',
      '> ng build',
      '',
      'Initial chunk files   | Names    |  Raw size',
      'main-4XQ2LNJB.js      | main     | 212.40 kB',
      'styles-5INURTSO.css   | styles   |  18.12 kB',
      '',
      'Application bundle generation complete. [4.218 seconds]',
    ],
  },
];
const ANSWER = 'Lint and tests pass, and the build finished in four seconds.';

function finished(): Command[] {
  return COMMANDS.map(({ id, command, output }) => ({ id, command, output: output.join('\n'), exitCode: 0 }));
}

@Component({
  selector: 'z-ai-elements-terminal-row',
  imports: [NgIcon, ...ZardCodeBlockImports, ...ZardTraceImports],
  template: `
    <z-trace-collapsible [zOpen]="open() ?? (running() && !!command().output)" (zOpenChange)="open.set($event)">
      <z-trace-collapsible-trigger>
        <z-trace-line [zStatus]="running() ? 'running' : failed() ? 'error' : undefined">
          <z-trace-icon><ng-icon name="lucideTerminal" /></z-trace-icon>
          <z-trace-title>{{ title() }}</z-trace-title>
        </z-trace-line>
      </z-trace-collapsible-trigger>
      <z-trace-collapsible-content>
        <z-code-block zSize="sm">
          <z-code-block-content zWrap class="max-h-64">{{ command().output }}</z-code-block-content>
        </z-code-block>
      </z-trace-collapsible-content>
    </z-trace-collapsible>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  viewProviders: [provideIcons({ lucideTerminal })],
  host: { class: 'contents' },
})
export class ZardAiElementsTerminalRowComponent implements OnInit {
  readonly command = input.required<Command>();
  /** Whether the reply is still streaming. A command that has not exited when it stops has failed. */
  readonly streaming = input(false);
  /** Whether the row starts open. Leave it unset to open the row while its output streams. */
  readonly defaultOpen = input<boolean | undefined>(undefined);

  /** The reader's choice, which wins over the stream once they toggle the row. */
  protected readonly open = signal<boolean | undefined>(undefined);

  protected readonly running = computed(() => this.streaming() && this.command().exitCode === undefined);
  protected readonly failed = computed(() => !this.running() && this.command().exitCode !== 0);

  protected readonly title = computed(() => {
    const { command, exitCode } = this.command();
    if (exitCode !== undefined) return exitCode === 0 ? `Ran ${command}` : `${command} exited with code ${exitCode}`;
    return this.running() ? `Running ${command}` : `Failed to run ${command}`;
  });

  /** Seeded once: after that, the row is the reader's to open and close. */
  ngOnInit(): void {
    this.open.set(this.defaultOpen());
  }
}

@Component({
  selector: 'z-ai-elements-terminal',
  imports: [
    ZardAiElementsTerminalRowComponent,
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
          @if (commands().length) {
            <z-trace>
              @for (command of commands(); track command.id; let last = $last) {
                <z-ai-elements-terminal-row
                  [command]="command"
                  [streaming]="busy()"
                  [defaultOpen]="busy() ? undefined : last"
                />
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
  host: { class: 'contents' },
})
export class ZardAiElementsTerminalComponent {
  protected readonly question = QUESTION;

  /** Starts at the end of the run, so the reply reads in full until it is replayed. */
  protected readonly commands = signal<Command[]>(finished());
  protected readonly answer = signal(ANSWER);
  protected readonly busy = signal(false);

  /** Bumped on every run and on destroy, so a stale run stops at its next step. */
  private run = 0;

  constructor() {
    inject(DestroyRef).onDestroy(() => this.run++);
  }

  /**
   * Simulates the agent. A tool result arrives only once the command exits, so with a real model, have the
   * tool stream its output under the call's id and replace the command's `output` as it grows.
   */
  protected async replay(): Promise<void> {
    const run = ++this.run;
    this.busy.set(true);
    this.commands.set([]);
    this.answer.set('');

    for (const { id, command, output } of COMMANDS) {
      this.commands.update(commands => [...commands, { id, command, output: '' }]);
      for (let line = 1; line <= output.length; line++) {
        if (!(await this.wait(200, run))) return;
        this.update(id, { output: output.slice(0, line).join('\n') });
      }
      this.update(id, { exitCode: 0 });
    }

    let shown = '';
    for (const word of ANSWER.split(/(?<=\s)/)) {
      if (!(await this.wait(20, run))) return;
      shown += word;
      this.answer.set(shown);
    }
    this.busy.set(false);
  }

  private update(id: string, patch: Partial<Command>): void {
    this.commands.update(commands => commands.map(command => (command.id === id ? { ...command, ...patch } : command)));
  }

  private wait(ms: number, run: number): Promise<boolean> {
    return new Promise(resolve => setTimeout(() => resolve(run === this.run), ms));
  }
}
