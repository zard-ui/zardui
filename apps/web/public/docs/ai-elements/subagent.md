---
title: Subagent
description: Displays a subagent run, with its tool calls and result.
---

# Subagent

Displays a subagent run, with its tool calls and result.

```
import { ChangeDetectionStrategy, Component, computed, DestroyRef, inject, signal } from '@angular/core';

import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideCircleAlert, lucideCircleCheck, lucideLoaderCircle } from '@ng-icons/lucide';

import { ZardBubbleImports } from '@/shared/components/bubble/bubble.imports';
import { ZardButtonComponent } from '@/shared/components/button/button.component';
import { ZardCodeBlockImports } from '@/shared/components/code-block/code-block.imports';
import { ZardMessageImports } from '@/shared/components/message/message.imports';
import { ZardTraceImports } from '@/shared/components/trace/trace.imports';

const QUESTION = 'Why does image optimization rerun on every deploy?';
/** The tool calls the subagent makes, in order. */
const STEPS = [
  {
    command: 'grep -rn cacheKey scripts',
    stdout: 'scripts/optimize-images.ts:14:  const cacheKey = process.env.COMMIT_SHA',
  },
  {
    command: 'sed -n 13,15p scripts/optimize-images.ts',
    stdout:
      "const cacheDir = '.angular/cache/images'\nconst cacheKey = process.env.COMMIT_SHA\nconst cached = await restoreCache(cacheDir, cacheKey)",
  },
  { command: 'ls public/images | wc -l', stdout: '1240' },
];
const REPORT = 'The cache is keyed on the commit SHA, so every deploy misses it and optimizes all 1,240 images again.';
const ANSWER =
  'Image optimization reruns because its cache is keyed on the commit SHA, which changes on every deploy. Key the cache on a hash of public/images instead, and unchanged images will be skipped.';

@Component({
  selector: 'z-ai-elements-subagent',
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
          @if (started()) {
            <z-trace>
              <!-- The run is the line. It opens into the subagent's own tool calls, and what it found. -->
              <z-trace-collapsible zOpen>
                <z-trace-collapsible-trigger>
                  <z-trace-line [zStatus]="done() ? undefined : 'running'">
                    <z-trace-icon>
                      <ng-icon
                        [name]="done() ? 'lucideCircleCheck' : 'lucideLoaderCircle'"
                        [class.animate-spin]="!done()"
                      />
                    </z-trace-icon>
                    <z-trace-title>{{ done() ? 'Ran' : 'Running' }} the research subagent</z-trace-title>
                  </z-trace-line>
                </z-trace-collapsible-trigger>
                <z-trace-collapsible-content zKeepMounted class="flex flex-col gap-3">
                  <z-trace>
                    @for (step of shownSteps(); track step.command; let index = $index) {
                      @if (index < finishedSteps()) {
                        <z-trace-collapsible>
                          <z-trace-collapsible-trigger>
                            <z-trace-line>
                              <z-trace-icon><ng-icon name="lucideCircleCheck" /></z-trace-icon>
                              <z-trace-title>Ran {{ step.command }}</z-trace-title>
                            </z-trace-line>
                          </z-trace-collapsible-trigger>
                          <z-trace-collapsible-content>
                            <z-code-block zSize="sm">
                              <z-code-block-content zWrap class="max-h-64">{{ step.stdout }}</z-code-block-content>
                            </z-code-block>
                          </z-trace-collapsible-content>
                        </z-trace-collapsible>
                      } @else {
                        <z-trace-line [zStatus]="busy() ? 'running' : 'error'">
                          <z-trace-icon>
                            <ng-icon
                              [name]="busy() ? 'lucideLoaderCircle' : 'lucideCircleAlert'"
                              [class.animate-spin]="busy()"
                            />
                          </z-trace-icon>
                          <z-trace-title>{{ busy() ? 'Running' : 'Failed to run' }} {{ step.command }}</z-trace-title>
                        </z-trace-line>
                      }
                    }
                  </z-trace>
                  @if (report()) {
                    <p>{{ report() }}</p>
                  }
                </z-trace-collapsible-content>
              </z-trace-collapsible>
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
  viewProviders: [provideIcons({ lucideCircleAlert, lucideCircleCheck, lucideLoaderCircle })],
  host: { class: 'contents' },
})
export class ZardAiElementsSubagentComponent {
  protected readonly question = QUESTION;

  /** Starts at the end of the run, so the reply reads in full until it is replayed. */
  protected readonly started = signal(true);
  protected readonly finishedSteps = signal(STEPS.length);
  protected readonly report = signal(REPORT);
  protected readonly answer = signal(ANSWER);
  protected readonly busy = signal(false);

  /** The finished steps, and the one running after them. */
  protected readonly shownSteps = computed(() => STEPS.slice(0, this.finishedSteps() + 1));
  /** The subagent is done once its report is in. */
  protected readonly done = computed(() => !!this.report());

  /** Bumped on every run and on destroy, so a stale run stops at its next step. */
  private run = 0;

  constructor() {
    inject(DestroyRef).onDestroy(() => this.run++);
  }

  /**
   * Simulates the agent. With a real model, the subagent is a tool that streams its own messages: render
   * each of them as it arrives, and only show "Ran" once the final output replaces the preliminary ones.
   */
  protected async replay(): Promise<void> {
    const run = ++this.run;
    this.busy.set(true);
    this.started.set(false);
    this.finishedSteps.set(0);
    this.report.set('');
    this.answer.set('');

    if (!(await this.wait(600, run))) return;
    this.started.set(true);
    for (let step = 1; step <= STEPS.length; step++) {
      if (!(await this.wait(1000, run))) return;
      this.finishedSteps.set(step);
    }
    this.report.set(REPORT);

    if (!(await this.wait(400, run))) return;
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

Subagent is a line for work the agent hands to a subagent. The run is the title, like "Ran the research agent". Open it for the tool calls the subagent made and what it found.

Subagent is a `z-trace` with a `z-trace-collapsible` for the run and a nested `z-trace` for its tool calls.

## Installation

Subagent is built with [Trace](/docs/components/trace), [Code Block](/docs/components/code-block) and [Badge](/docs/components/badge). Add them with the CLI:

```
npx zard-cli add trace code-block badge
```

Then copy the code of the example into your project and adapt it. There is no package to install: the pattern is yours. To install a component by hand, follow the Manual tab on its page.

## Usage

```
import { ZardTraceImports } from '@/shared/components/trace/trace.imports';
```

```
<z-trace>
  <z-trace-collapsible>
    <z-trace-collapsible-trigger>
      <z-trace-line>
        <z-trace-icon><ng-icon name="lucideCircleCheck" /></z-trace-icon>
        <z-trace-title>Ran the research agent</z-trace-title>
      </z-trace-line>
    </z-trace-collapsible-trigger>
    <z-trace-collapsible-content class="flex flex-col gap-3">
      <z-trace>
        <z-trace-line>
          <z-trace-icon><ng-icon name="lucideCircleCheck" /></z-trace-icon>
          <z-trace-title>Ran grep -rn cacheKey scripts</z-trace-title>
        </z-trace-line>
      </z-trace>
      <p>The cache is keyed on the commit SHA.</p>
    </z-trace-collapsible-content>
  </z-trace-collapsible>
</z-trace>
```

## Running

While the subagent runs, the line has `zStatus="running"` and its content shows the tool calls so far. Add the result when the subagent finishes. Press Replay on the example at the top to watch it.

## Details

Put the task the subagent was given at the top of the content, with its model and tools as [Badge](/docs/components/badge) items. Show how long it ran in a `z-trace-description` after the title.

```
import { ChangeDetectionStrategy, Component } from '@angular/core';

import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideCircleCheck } from '@ng-icons/lucide';

import { ZardBadgeComponent } from '@/shared/components/badge/badge.component';
import { ZardTraceImports } from '@/shared/components/trace/trace.imports';

@Component({
  selector: 'z-ai-elements-subagent-details',
  imports: [NgIcon, ZardBadgeComponent, ...ZardTraceImports],
  template: `
    <z-trace class="max-w-sm">
      <z-trace-collapsible zOpen>
        <z-trace-collapsible-trigger>
          <z-trace-line>
            <z-trace-icon><ng-icon name="lucideCircleCheck" /></z-trace-icon>
            <z-trace-title>Ran the research agent</z-trace-title>
            <z-trace-description>48s</z-trace-description>
          </z-trace-line>
        </z-trace-collapsible-trigger>
        <z-trace-collapsible-content zKeepMounted class="flex flex-col gap-3">
          <div class="flex flex-wrap gap-1.5">
            <z-badge zType="secondary">anthropic/claude-sonnet-4.5</z-badge>
            <z-badge zType="outline" class="font-mono">runCommand</z-badge>
          </div>
          <p>Find out why image optimization reruns on every deploy.</p>
          <z-trace>
            <z-trace-line>
              <z-trace-icon><ng-icon name="lucideCircleCheck" /></z-trace-icon>
              <z-trace-title>Ran grep -rn cacheKey scripts</z-trace-title>
            </z-trace-line>
            <z-trace-line>
              <z-trace-icon><ng-icon name="lucideCircleCheck" /></z-trace-icon>
              <z-trace-title>Ran sed -n 13,15p scripts/optimize-images.ts</z-trace-title>
            </z-trace-line>
          </z-trace>
          <p>The cache is keyed on the commit SHA.</p>
        </z-trace-collapsible-content>
      </z-trace-collapsible>
    </z-trace>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  viewProviders: [provideIcons({ lucideCircleCheck })],
})
export class ZardAiElementsSubagentDetailsComponent {}
```

## Streaming

A subagent is a tool that streams the subagent’s own messages as preliminary results. Render the tool call as the line and those messages as the nested trace. The final result replaces the preliminary ones, so only show "Ran" once it arrives.

| Subagent call | `zStatus` | Title |
| --- | --- | --- |
| Input streaming or available | `running` while the reply streams | Running … |
| Preliminary result | `running` while the reply streams | Running … |
| Final result | none | Ran … |
| Error, or still running after the reply stops | `error` | Failed to run … |

## API Reference

Subagent has no API of its own. See the API of the components it is built with:

- [Trace](/docs/components/trace#api)
- [Code Block](/docs/components/code-block#api)
- [Badge](/docs/components/badge#api)
