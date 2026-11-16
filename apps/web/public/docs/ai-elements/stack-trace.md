---
title: Stack Trace
description: Displays a failed tool call and its stack frames.
---

# Stack Trace

Displays a failed tool call and its stack frames.

```
import { ChangeDetectionStrategy, Component, computed, DestroyRef, inject, input, signal } from '@angular/core';

import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideFileCode, lucideLayers, lucideTerminal } from '@ng-icons/lucide';

import { ZardBubbleImports } from '@/shared/components/bubble/bubble.imports';
import { ZardButtonComponent } from '@/shared/components/button/button.component';
import { ZardCodeBlockImports } from '@/shared/components/code-block/code-block.imports';
import { ZardMessageImports } from '@/shared/components/message/message.imports';
import { ZardTraceImports } from '@/shared/components/trace/trace.imports';

interface Frame {
  line: string;
  name?: string;
  file?: string;
  lineNumber?: string;
  internal: boolean;
}

interface ToolCall {
  id: string;
  command: string;
  state: 'running' | 'output' | 'error';
  output?: string;
}

const QUESTION = 'Reset the database and seed it.';
const STACK = `TypeError: Cannot read properties of undefined (reading 'email')
    at seedUsers (server/db/seed.ts:27:34)
    at main (server/db/seed.ts:51:9)
    at Module._compile (node:internal/modules/cjs/loader:1554:14)
    at Object.transformer (node_modules/tsx/dist/register.cjs:3:1104)
    at Module.load (node:internal/modules/cjs/loader:1289:32)
    at process.processTicksAndRejections (node:internal/process/task_queues:105:5)`;
const CALLS = [
  {
    command: 'npm run db:reset',
    output: `Database reset successful
The following migrations have been applied:
migrations/
  └─ 20260912_init/
  └─ 20260920_add_profiles/`,
  },
  { command: 'npm run db:seed', error: STACK },
];
const ANSWER =
  'The migrations ran, but the seed failed in seedUsers. One fixture has no profile, so profile.email is undefined.';

function finished(): ToolCall[] {
  return CALLS.map((call, index) => ({
    id: `call-${index}`,
    command: call.command,
    state: call.error ? 'error' : 'output',
    output: call.error ?? call.output,
  }));
}

/** Splits a frame like `at main (server/db/seed.ts:51:9)` into its parts. */
function parseFrame(line: string): Frame {
  const match = line.match(/^at (.+) \((.+):(\d+):(\d+)\)$/);
  return {
    line,
    name: match?.[1],
    file: match?.[2],
    lineNumber: match?.[3],
    internal: line.includes('node_modules') || line.includes('node:'),
  };
}

/** A failed call: the error is the title, and the frames sit inside, your own ones first. */
@Component({
  selector: 'z-ai-elements-stack-trace-row',
  imports: [NgIcon, ...ZardTraceImports],
  template: `
    <z-trace-collapsible zOpen>
      <z-trace-collapsible-trigger>
        <z-trace-line zStatus="error">
          <z-trace-icon><ng-icon name="lucideTerminal" /></z-trace-icon>
          <z-trace-title>Failed: {{ parsed().error }}</z-trace-title>
        </z-trace-line>
      </z-trace-collapsible-trigger>
      <z-trace-collapsible-content class="flex flex-col gap-2">
        <!-- The title truncates, so the full error comes first. -->
        <p class="text-destructive font-mono text-xs">{{ parsed().error }}</p>
        <z-trace>
          @for (frame of parsed().app; track frame.line) {
            <a [href]="'#' + frame.file + ':' + frame.lineNumber">
              <z-trace-line>
                <z-trace-icon><ng-icon name="lucideFileCode" /></z-trace-icon>
                <z-trace-title>{{ frame.name }} in {{ frame.file }}:{{ frame.lineNumber }}</z-trace-title>
              </z-trace-line>
            </a>
          }
          <z-trace-collapsible>
            <z-trace-collapsible-trigger>
              <z-trace-line>
                <z-trace-icon><ng-icon name="lucideLayers" /></z-trace-icon>
                <z-trace-title>{{ parsed().internal.length }} framework frames</z-trace-title>
              </z-trace-line>
            </z-trace-collapsible-trigger>
            <z-trace-collapsible-content>
              <ol class="bg-muted flex flex-col gap-1 overflow-x-auto rounded-md p-3 font-mono text-xs">
                @for (frame of parsed().internal; track frame.line) {
                  <li class="whitespace-nowrap">{{ frame.line }}</li>
                }
              </ol>
            </z-trace-collapsible-content>
          </z-trace-collapsible>
        </z-trace>
      </z-trace-collapsible-content>
    </z-trace-collapsible>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  viewProviders: [provideIcons({ lucideFileCode, lucideLayers, lucideTerminal })],
  host: { class: 'contents' },
})
export class ZardAiElementsStackTraceRowComponent {
  readonly stack = input.required<string>();

  protected readonly parsed = computed(() => {
    const [error, ...lines] = this.stack()
      .split('\n')
      .map(line => line.trim());
    const frames = lines.map(parseFrame);
    return { error, app: frames.filter(frame => !frame.internal), internal: frames.filter(frame => frame.internal) };
  });
}

@Component({
  selector: 'z-ai-elements-stack-trace',
  imports: [
    NgIcon,
    ZardAiElementsStackTraceRowComponent,
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
                @if (call.state === 'error') {
                  <z-ai-elements-stack-trace-row [stack]="call.output ?? ''" />
                } @else if (call.state === 'output') {
                  <z-trace-collapsible>
                    <z-trace-collapsible-trigger>
                      <z-trace-line>
                        <z-trace-icon><ng-icon name="lucideTerminal" /></z-trace-icon>
                        <z-trace-title>Ran {{ call.command }}</z-trace-title>
                      </z-trace-line>
                    </z-trace-collapsible-trigger>
                    <z-trace-collapsible-content>
                      <z-code-block zSize="sm">
                        <z-code-block-content zWrap class="max-h-64">{{ call.output }}</z-code-block-content>
                      </z-code-block>
                    </z-trace-collapsible-content>
                  </z-trace-collapsible>
                } @else {
                  <z-trace-line [zStatus]="busy() ? 'running' : 'error'">
                    <z-trace-icon><ng-icon name="lucideTerminal" /></z-trace-icon>
                    <z-trace-title>{{ busy() ? 'Running' : 'Failed to run' }} {{ call.command }}</z-trace-title>
                  </z-trace-line>
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
export class ZardAiElementsStackTraceComponent {
  protected readonly question = QUESTION;

  /** Starts at the end of the run, so the reply reads in full until it is replayed. */
  protected readonly calls = signal<ToolCall[]>(finished());
  protected readonly answer = signal(ANSWER);
  protected readonly busy = signal(false);

  /** Bumped on every run and on destroy, so a stale run stops at its next step. */
  private run = 0;

  constructor() {
    inject(DestroyRef).onDestroy(() => this.run++);
  }

  /** Simulates the agent. With a real model, the failed call's error text is the stack. */
  protected async replay(): Promise<void> {
    const run = ++this.run;
    this.busy.set(true);
    this.calls.set([]);
    this.answer.set('');

    for (const [index, call] of CALLS.entries()) {
      const id = `call-${index}`;
      this.calls.update(calls => [...calls, { id, command: call.command, state: 'running' }]);
      if (!(await this.wait(index === 0 ? 900 : 1200, run))) return;
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

Stack Trace is a line for a tool call that failed. The error is the title, like "Failed: TypeError". Open it for the stack frames, which can link to the file and line.

Stack Trace is a `z-trace` with a `z-trace-collapsible` for the frames.

## Installation

Stack Trace is built with [Trace](/docs/components/trace) and [Code Block](/docs/components/code-block). Add them with the CLI:

```
npx zard-cli add trace code-block
```

Then copy the code of the example into your project and adapt it. There is no package to install: the pattern is yours. To install a component by hand, follow the Manual tab on its page.

## Usage

```
import { ZardTraceImports } from '@/shared/components/trace/trace.imports';
```

```
const [error, ...frames] = stack.split('\n').map(line => line.trim());
```

```
<z-trace>
  <z-trace-collapsible>
    <z-trace-collapsible-trigger>
      <z-trace-line zStatus="error">
        <z-trace-icon><ng-icon name="lucideCircleX" /></z-trace-icon>
        <z-trace-title>Failed: {{ error }}</z-trace-title>
      </z-trace-line>
    </z-trace-collapsible-trigger>
    <z-trace-collapsible-content>
      <div class="bg-muted flex flex-col gap-2 rounded-md p-3 font-mono text-xs">
        <p class="text-destructive">{{ error }}</p>
        <ol>
          @for (frame of frames; track $index) {
            <li [class.text-foreground]="!frame.includes('node_modules')">{{ frame }}</li>
          }
        </ol>
      </div>
    </z-trace-collapsible-content>
  </z-trace-collapsible>
</z-trace>
```

The title truncates, so repeat the full error at the top of the content. Frames from `node_modules` stay muted, so your own frames stand out.

## Frame Links

Turn your own frames into links that open the file at the line. Fold the framework frames into a collapsible line of their own, so the frames you can fix come first.

```
import { ChangeDetectionStrategy, Component } from '@angular/core';

import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideCircleX, lucideFileCode, lucideLayers } from '@ng-icons/lucide';

import { ZardTraceImports } from '@/shared/components/trace/trace.imports';

const STACK = `TypeError: Cannot read properties of undefined (reading 'total')
    at formatInvoice (src/app/billing/billing.ts:42:31)
    at InvoiceRow_Template (src/app/billing/invoice-row.ts:18:12)
    at executeTemplate (node_modules/@angular/core/fesm2022/core.mjs:12164:5)
    at refreshView (node_modules/@angular/core/fesm2022/core.mjs:13785:7)
    at detectChangesInView (node_modules/@angular/core/fesm2022/core.mjs:14019:5)
    at detectChangesInViewIfAttached (node_modules/@angular/core/fesm2022/core.mjs:13982:3)`;

/** Splits a frame like `at formatInvoice (src/app/billing/billing.ts:42:31)` into its parts. */
function parseFrame(line: string) {
  const match = line.match(/^at (.+) \((.+):(\d+):(\d+)\)$/);
  return { line, name: match?.[1], file: match?.[2], lineNumber: match?.[3], internal: line.includes('node_modules') };
}

const [ERROR, ...LINES] = STACK.split('\n').map(line => line.trim());
const FRAMES = LINES.map(parseFrame);

@Component({
  selector: 'z-ai-elements-stack-trace-frames',
  imports: [NgIcon, ...ZardTraceImports],
  template: `
    <z-trace class="max-w-sm">
      <z-trace-collapsible zOpen>
        <z-trace-collapsible-trigger>
          <z-trace-line zStatus="error">
            <z-trace-icon><ng-icon name="lucideCircleX" /></z-trace-icon>
            <z-trace-title>Failed: {{ error }}</z-trace-title>
          </z-trace-line>
        </z-trace-collapsible-trigger>
        <z-trace-collapsible-content zKeepMounted class="flex flex-col gap-2">
          <p class="text-destructive font-mono text-xs">{{ error }}</p>
          <z-trace>
            <!-- Your own frames link to the file and line. The framework frames fold away. -->
            @for (frame of appFrames; track frame.line) {
              <a [href]="'#' + frame.file + ':' + frame.lineNumber">
                <z-trace-line>
                  <z-trace-icon><ng-icon name="lucideFileCode" /></z-trace-icon>
                  <z-trace-title>{{ frame.name }} in {{ frame.file }}:{{ frame.lineNumber }}</z-trace-title>
                </z-trace-line>
              </a>
            }
            <z-trace-collapsible>
              <z-trace-collapsible-trigger>
                <z-trace-line>
                  <z-trace-icon><ng-icon name="lucideLayers" /></z-trace-icon>
                  <z-trace-title>{{ internalFrames.length }} framework frames</z-trace-title>
                </z-trace-line>
              </z-trace-collapsible-trigger>
              <z-trace-collapsible-content>
                <ol class="bg-muted flex flex-col gap-1 overflow-x-auto rounded-md p-3 font-mono text-xs">
                  @for (frame of internalFrames; track frame.line) {
                    <li class="whitespace-nowrap">{{ frame.line }}</li>
                  }
                </ol>
              </z-trace-collapsible-content>
            </z-trace-collapsible>
          </z-trace>
        </z-trace-collapsible-content>
      </z-trace-collapsible>
    </z-trace>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  viewProviders: [provideIcons({ lucideCircleX, lucideFileCode, lucideLayers })],
})
export class ZardAiElementsStackTraceFramesComponent {
  protected readonly error = ERROR;
  protected readonly appFrames = FRAMES.filter(frame => !frame.internal);
  protected readonly internalFrames = FRAMES.filter(frame => frame.internal);
}
```

## Streaming

When a tool throws, send the stack as its error text, not only the message. Split it into the error and the frames when you render it.

```
// A stack shows file paths from your server, so only send it in development.
const errorText = isDevMode() && error instanceof Error ? (error.stack ?? error.message) : String(error);
```

Map the other tool states as in [Tool](/docs/ai-elements/tool#states).

## API Reference

Stack Trace has no API of its own. See the API of the components it is built with:

- [Trace](/docs/components/trace#api)
- [Code Block](/docs/components/code-block#api)
