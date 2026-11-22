---
title: Tool
description: Displays a tool call the agent makes, from input to output.
---

# Tool

Displays a tool call the agent makes, from input to output.

```
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
```

Tool is a tool call the agent makes, such as running a command or reading a file. The line follows the call from input to output, including errors and calls that wait for approval.

Tool is a `z-trace` with a `z-trace-collapsible` for each call that has output, and a [Code Block](/docs/components/code-block) for the output.

## Installation

Tool is built with [Trace](/docs/components/trace) and [Code Block](/docs/components/code-block). Add them with the CLI:

```
npx zard-cli add trace code-block
```

Then copy the code of the example into your project and adapt it. There is no package to install: the pattern is yours. To install a component by hand, follow the Manual tab on its page.

## Usage

```
import { ZardTraceImports } from '@/shared/components/trace/trace.imports';
import { ZardCodeBlockImports } from '@/shared/components/code-block/code-block.imports';
```

```
<z-trace>
  <z-trace-collapsible>
    <z-trace-collapsible-trigger>
      <z-trace-line>
        <z-trace-icon><ng-icon name="lucideTerminal" /></z-trace-icon>
        <z-trace-title>Ran git status --short</z-trace-title>
      </z-trace-line>
    </z-trace-collapsible-trigger>
    <z-trace-collapsible-content>
      <z-code-block zSize="sm">
        <z-code-block-content zWrap class="max-h-64">{{ output }}</z-code-block-content>
      </z-code-block>
    </z-trace-collapsible-content>
  </z-trace-collapsible>
</z-trace>
```

## States

Trace does not know about tool calls. Map the state of each call to a `zStatus` and a title.

```
import { ChangeDetectionStrategy, Component } from '@angular/core';

import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideTerminal } from '@ng-icons/lucide';

import { ZardCodeBlockImports } from '@/shared/components/code-block/code-block.imports';
import { ZardTraceImports } from '@/shared/components/trace/trace.imports';

@Component({
  selector: 'z-ai-elements-tool-states',
  imports: [NgIcon, ...ZardCodeBlockImports, ...ZardTraceImports],
  template: `
    <z-trace class="max-w-sm">
      <z-trace-collapsible>
        <z-trace-collapsible-trigger>
          <z-trace-line>
            <z-trace-icon><ng-icon name="lucideTerminal" /></z-trace-icon>
            <z-trace-title>Ran git status --short</z-trace-title>
          </z-trace-line>
        </z-trace-collapsible-trigger>
        <z-trace-collapsible-content>
          <z-code-block zSize="sm">
            <z-code-block-content zWrap class="max-h-64">{{ status }}</z-code-block-content>
          </z-code-block>
        </z-trace-collapsible-content>
      </z-trace-collapsible>

      <z-trace-collapsible>
        <z-trace-collapsible-trigger>
          <z-trace-line zStatus="error">
            <z-trace-icon><ng-icon name="lucideTerminal" /></z-trace-icon>
            <z-trace-title>Failed to run ng serve</z-trace-title>
          </z-trace-line>
        </z-trace-collapsible-trigger>
        <z-trace-collapsible-content>
          <z-code-block zSize="sm">
            <z-code-block-content zWrap class="max-h-64">Command timed out after 120 seconds.</z-code-block-content>
          </z-code-block>
        </z-trace-collapsible-content>
      </z-trace-collapsible>

      <z-trace-line>
        <z-trace-icon><ng-icon name="lucideTerminal" /></z-trace-icon>
        <z-trace-title>Denied rm -rf dist</z-trace-title>
      </z-trace-line>

      <z-trace-line zStatus="running">
        <z-trace-icon><ng-icon name="lucideTerminal" /></z-trace-icon>
        <z-trace-title>Running ng test</z-trace-title>
      </z-trace-line>
    </z-trace>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  viewProviders: [provideIcons({ lucideTerminal })],
})
export class ZardAiElementsToolStatesComponent {
  protected readonly status = ' M src/app/app.routes.ts\n M src/app/chat/chat.ts';
}
```

| Tool call | `zStatus` | Title |
| --- | --- | --- |
| Input streaming or available | `running` while the reply streams | Running … |
| Still waiting after the reply stops | `error` | Failed to run … |
| Waiting for approval | - | Not a line. An `Item` outside the trace, with Approve and Deny buttons. |
| Approved or denied | `running` if approved, none if not | Running … if approved, Denied … if not |
| Output available | none | Ran … |
| Output error | `error` | Failed to run … |

A tool is a plain `z-trace-line` while it runs, and a `z-trace-collapsible` once its output arrives.

```
@if (call.state === 'running') {
  <z-trace-line [zStatus]="streaming() ? 'running' : 'error'">
    <z-trace-icon><ng-icon name="lucideTerminal" /></z-trace-icon>
    <z-trace-title>{{ streaming() ? 'Running' : 'Failed to run' }} {{ call.command }}</z-trace-title>
  </z-trace-line>
} @else if (call.state === 'denied') {
  <z-trace-line>
    <z-trace-icon><ng-icon name="lucideTerminal" /></z-trace-icon>
    <z-trace-title>Denied {{ call.command }}</z-trace-title>
  </z-trace-line>
} @else {
  <z-trace-collapsible>
    <z-trace-collapsible-trigger>
      <z-trace-line [zStatus]="call.state === 'error' ? 'error' : undefined">
        <z-trace-icon><ng-icon name="lucideTerminal" /></z-trace-icon>
        <z-trace-title>{{ call.state === 'error' ? 'Failed to run' : 'Ran' }} {{ call.command }}</z-trace-title>
      </z-trace-line>
    </z-trace-collapsible-trigger>
    <z-trace-collapsible-content>
      <z-code-block zSize="sm">
        <z-code-block-content zWrap class="max-h-64">{{ call.output }}</z-code-block-content>
      </z-code-block>
    </z-trace-collapsible-content>
  </z-trace-collapsible>
}
```

A tool that runs in the browser stays waiting after the reply stops, until you send its result. Treat it as waiting, not failed.

## Output in a Sheet

For long output, wrap the `z-trace-line` in the button that opens a [Sheet](/docs/components/sheet) and show the output in the sheet. See [Trace](/docs/components/trace#sheet).

```
import { ChangeDetectionStrategy, Component, DestroyRef, inject, signal } from '@angular/core';

import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideChevronRight, lucideFileText } from '@ng-icons/lucide';

import { ZardBubbleImports } from '@/shared/components/bubble/bubble.imports';
import { ZardButtonComponent } from '@/shared/components/button/button.component';
import { ZardCodeBlockImports } from '@/shared/components/code-block/code-block.imports';
import { ZardMessageImports } from '@/shared/components/message/message.imports';
import { ZardSheetImports } from '@/shared/components/sheet/sheet.imports';
import { ZardTraceImports } from '@/shared/components/trace/trace.imports';

const QUESTION = 'Which Angular version does this app use?';
const PATH = 'package.json';
const PACKAGE_JSON = `{
  "name": "acme-chat",
  "private": true,
  "dependencies": {
    "@angular/core": "^22.1.0",
    "@angular/router": "^22.1.0",
    "rxjs": "^7.8.0"
  }
}`;
const ANSWER = 'It uses Angular 22.1 with RxJS 7.8.';

@Component({
  selector: 'z-ai-elements-tool-sheet',
  imports: [
    NgIcon,
    ZardButtonComponent,
    ...ZardBubbleImports,
    ...ZardCodeBlockImports,
    ...ZardMessageImports,
    ...ZardSheetImports,
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

        <z-message>
          <z-message-content class="gap-4">
            <z-trace>
              @if (read()) {
                <!-- Long output goes in a sheet: the line is the button that opens it. -->
                <button type="button" (click)="open.set(true)">
                  <z-trace-line>
                    <z-trace-icon><ng-icon name="lucideFileText" /></z-trace-icon>
                    <z-trace-title>Read {{ path }}</z-trace-title>
                    <z-trace-icon><ng-icon name="lucideChevronRight" class="rtl:-scale-x-100" /></z-trace-icon>
                  </z-trace-line>
                </button>
              } @else {
                <z-trace-line zStatus="running">
                  <z-trace-icon><ng-icon name="lucideFileText" /></z-trace-icon>
                  <z-trace-title>Reading {{ path }}</z-trace-title>
                </z-trace-line>
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

    <z-sheet [(zVisible)]="open">
      <z-sheet-header>
        <z-sheet-title class="font-mono">{{ path }}</z-sheet-title>
        <z-sheet-description>{{ lineCount }} lines</z-sheet-description>
      </z-sheet-header>
      <z-code-block class="mx-6 mb-6 w-auto">
        <z-code-block-content zLineNumbers>{{ content }}</z-code-block-content>
      </z-code-block>
    </z-sheet>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  viewProviders: [provideIcons({ lucideChevronRight, lucideFileText })],
  host: { class: 'contents' },
})
export class ZardAiElementsToolSheetComponent {
  protected readonly question = QUESTION;
  protected readonly path = PATH;
  protected readonly content = PACKAGE_JSON;
  protected readonly lineCount = PACKAGE_JSON.split('\n').length;

  protected readonly sent = signal(false);
  protected readonly read = signal(false);
  protected readonly answer = signal('');
  protected readonly busy = signal(false);
  protected readonly open = signal(false);

  /** Bumped on every run and on destroy, so a stale run stops at its next step. */
  private run = 0;

  constructor() {
    inject(DestroyRef).onDestroy(() => this.run++);
  }

  protected next(): void {
    if (this.sent()) {
      this.run++;
      this.sent.set(false);
      this.read.set(false);
      this.answer.set('');
    } else {
      void this.send();
    }
  }

  private async send(): Promise<void> {
    const run = ++this.run;
    this.sent.set(true);
    this.busy.set(true);

    if (!(await this.wait(900, run))) return;
    this.read.set(true);

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
```

## Approval

A pending approval is a question for the person, not a step the agent took, so it sits outside `z-trace` as an [Item](/docs/components/item). Once the person answers, the tool goes back to being a line. See [Confirmation](/docs/ai-elements/confirmation).

```
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
```

## API Reference

Tool has no API of its own. See the API of the components it is built with:

- [Trace](/docs/components/trace#api)
- [Code Block](/docs/components/code-block#api)
