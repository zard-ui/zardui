---
title: Chain of Thought
description: Displays a summary that expands into the steps an agent took.
---

# Chain of Thought

Displays a summary that expands into the steps an agent took.

```
import { NgTemplateOutlet } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, DestroyRef, inject, signal } from '@angular/core';

import { NgIcon, provideIcons } from '@ng-icons/core';
import {
  lucideArrowUpRight,
  lucideCircleAlert,
  lucideCircleCheck,
  lucideGlobe,
  lucideLoaderCircle,
} from '@ng-icons/lucide';

import { ZardBadgeComponent } from '@/shared/components/badge/badge.component';
import { ZardBubbleImports } from '@/shared/components/bubble/bubble.imports';
import { ZardButtonComponent } from '@/shared/components/button/button.component';
import { ZardCodeBlockImports } from '@/shared/components/code-block/code-block.imports';
import { ZardMessageImports } from '@/shared/components/message/message.imports';
import { ZardTraceImports } from '@/shared/components/trace/trace.imports';

type Status = 'running' | 'error' | undefined;

/** A step the agent takes: one of its tool calls, and the result once it arrives. */
type Step =
  | { kind: 'log'; deployment: string; done: boolean; log?: string }
  | { kind: 'web'; query: string; done: boolean; results?: { title: string; url: string }[] }
  | { kind: 'code'; query: string; done: boolean; files?: string[] };

const QUESTION = 'Why is the checkout deploy so slow?';
const STEPS: Step[] = [
  { kind: 'log', deployment: 'dpl_8Kx2', done: true, log: 'install    41s\ncompile    38s\nimages   3m 52s' },
  {
    kind: 'web',
    query: 'angular image cache key',
    done: true,
    results: [
      { title: 'Image optimization | angular.dev', url: 'https://angular.dev/guide/image-optimization' },
      { title: 'Build cache | vercel.com', url: 'https://vercel.com/docs/deployments/troubleshoot-a-build' },
    ],
  },
  { kind: 'code', query: 'cacheKey', done: true, files: ['angular.json', 'scripts/optimize-images.ts'] },
];
const ANSWER =
  'Image optimization takes almost four minutes because its cache key includes the commit hash. Key it on the image directory instead.';

@Component({
  selector: 'z-ai-elements-chain-of-thought',
  imports: [
    NgIcon,
    NgTemplateOutlet,
    ZardBadgeComponent,
    ZardButtonComponent,
    ...ZardBubbleImports,
    ...ZardCodeBlockImports,
    ...ZardMessageImports,
    ...ZardTraceImports,
  ],
  template: `
    <ng-template #icon let-status>
      <ng-icon
        [name]="
          status === 'running' ? 'lucideLoaderCircle' : status === 'error' ? 'lucideCircleAlert' : 'lucideCircleCheck'
        "
        [class.animate-spin]="status === 'running'"
      />
    </ng-template>

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
          @if (steps().length) {
            <z-trace>
              <!-- The summary opens while the steps run, and the reader's click wins over that. -->
              <z-trace-collapsible [zOpen]="open() ?? running()" (zOpenChange)="open.set($event)">
                <z-trace-collapsible-trigger>
                  <z-trace-line [zStatus]="running() ? 'running' : undefined">
                    <z-trace-icon>
                      <ng-container
                        *ngTemplateOutlet="icon; context: { $implicit: running() ? 'running' : undefined }"
                      />
                    </z-trace-icon>
                    <z-trace-title>
                      {{ running() ? 'Researching' : 'Researched in ' + steps().length + ' steps' }}
                    </z-trace-title>
                  </z-trace-line>
                </z-trace-collapsible-trigger>
                <z-trace-collapsible-content zKeepMounted>
                  <z-trace>
                    @for (step of steps(); track step.kind) {
                      @let status = stepStatus(step);
                      @switch (step.kind) {
                        @case ('log') {
                          <z-trace-collapsible zOpen>
                            <z-trace-collapsible-trigger>
                              <z-trace-line [zStatus]="status">
                                <z-trace-icon>
                                  <ng-container *ngTemplateOutlet="icon; context: { $implicit: status }" />
                                </z-trace-icon>
                                <z-trace-title>
                                  {{ verb(status, 'Reading', 'Read', 'Failed to read') }} the build log for
                                  {{ step.deployment }}
                                </z-trace-title>
                              </z-trace-line>
                            </z-trace-collapsible-trigger>
                            <z-trace-collapsible-content>
                              @if (step.log) {
                                <z-code-block zSize="sm">
                                  <z-code-block-content zWrap class="max-h-64">{{ step.log }}</z-code-block-content>
                                </z-code-block>
                              }
                            </z-trace-collapsible-content>
                          </z-trace-collapsible>
                        }
                        @case ('web') {
                          <z-trace-collapsible>
                            <z-trace-collapsible-trigger>
                              <z-trace-line [zStatus]="status">
                                <z-trace-icon>
                                  <ng-container *ngTemplateOutlet="icon; context: { $implicit: status }" />
                                </z-trace-icon>
                                <z-trace-title>
                                  {{ verb(status, 'Searching', 'Searched', 'Failed to search') }} the web for
                                  {{ step.query }}
                                </z-trace-title>
                              </z-trace-line>
                            </z-trace-collapsible-trigger>
                            <z-trace-collapsible-content>
                              <z-trace>
                                @for (result of step.results ?? []; track result.url) {
                                  <a [href]="result.url" target="_blank" rel="noreferrer">
                                    <z-trace-line>
                                      <z-trace-icon><ng-icon name="lucideGlobe" /></z-trace-icon>
                                      <z-trace-title>
                                        {{ result.title }}
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
                        @case ('code') {
                          <z-trace-collapsible>
                            <z-trace-collapsible-trigger>
                              <z-trace-line [zStatus]="status">
                                <z-trace-icon>
                                  <ng-container *ngTemplateOutlet="icon; context: { $implicit: status }" />
                                </z-trace-icon>
                                <z-trace-title>
                                  {{ verb(status, 'Searching', 'Searched', 'Failed to search') }} the code for
                                  {{ step.query }}
                                </z-trace-title>
                              </z-trace-line>
                            </z-trace-collapsible-trigger>
                            <z-trace-collapsible-content>
                              <div class="flex flex-wrap gap-1.5">
                                @for (file of step.files ?? []; track file) {
                                  <z-badge zType="secondary" class="font-mono">{{ file }}</z-badge>
                                }
                              </div>
                            </z-trace-collapsible-content>
                          </z-trace-collapsible>
                        }
                      }
                    }
                  </z-trace>
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
  viewProviders: [
    provideIcons({ lucideArrowUpRight, lucideCircleAlert, lucideCircleCheck, lucideGlobe, lucideLoaderCircle }),
  ],
  host: { class: 'contents' },
})
export class ZardAiElementsChainOfThoughtComponent {
  protected readonly question = QUESTION;

  /** Starts at the end of the run, so the reply reads in full until it is replayed. */
  protected readonly steps = signal<Step[]>(STEPS);
  protected readonly answer = signal(ANSWER);
  protected readonly busy = signal(false);
  /** The reader's choice. `undefined` until they toggle the summary, so it follows the steps until then. */
  protected readonly open = signal<boolean | undefined>(undefined);

  /** The steps are running until the reply starts. */
  protected readonly running = computed(() => this.busy() && !this.answer());

  /** Bumped on every run and on destroy, so a stale run stops at its next step. */
  private run = 0;

  constructor() {
    inject(DestroyRef).onDestroy(() => this.run++);
  }

  /** A step still waiting for its result when the reply stops has failed. */
  protected stepStatus(step: Step): Status {
    if (step.done) return undefined;
    return this.busy() ? 'running' : 'error';
  }

  /** The title's verb, in the tense that matches the status. */
  protected verb(status: Status, running: string, done: string, failed: string): string {
    return status === 'running' ? running : status === 'error' ? failed : done;
  }

  /** Simulates the agent. With a real model, add a step for each tool call and fill in its result when it arrives. */
  protected async replay(): Promise<void> {
    const run = ++this.run;
    this.busy.set(true);
    this.steps.set([]);
    this.answer.set('');
    this.open.set(undefined);

    for (const step of STEPS) {
      this.steps.update(steps => [...steps, { ...step, done: false }]);
      if (!(await this.wait(900, run))) return;
      this.steps.update(steps => steps.map(item => (item.kind === step.kind ? step : item)));
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

Chain of Thought is a summary line that expands into the steps an agent took. The summary says what happened, like "Researched in 3 steps". The steps sit inside it, each one a line of its own.

Chain of Thought is a `z-trace` with a `z-trace-collapsible` for the summary.

## Installation

Chain of Thought is built with [Trace](/docs/components/trace), [Code Block](/docs/components/code-block) and [Badge](/docs/components/badge). Add them with the CLI:

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
        <z-trace-title>Researched in 3 steps</z-trace-title>
      </z-trace-line>
    </z-trace-collapsible-trigger>
    <z-trace-collapsible-content zKeepMounted>
      <z-trace>
        <z-trace-line>
          <z-trace-icon><ng-icon name="lucideCircleCheck" /></z-trace-icon>
          <z-trace-title>Read the build log for dpl_8Kx2</z-trace-title>
        </z-trace-line>
        <z-trace-line>
          <z-trace-icon><ng-icon name="lucideCircleCheck" /></z-trace-icon>
          <z-trace-title>Searched the web for angular image cache key</z-trace-title>
        </z-trace-line>
        <z-trace-line>
          <z-trace-icon><ng-icon name="lucideCircleCheck" /></z-trace-icon>
          <z-trace-title>Searched the code for cacheKey</z-trace-title>
        </z-trace-line>
      </z-trace>
    </z-trace-collapsible-content>
  </z-trace-collapsible>
</z-trace>
```

## Steps

Each step is a `z-trace-line`. Set its `zStatus` and write the title in the matching tense.

| Step | `zStatus` | Title |
| --- | --- | --- |
| Running | `running` | Searching for … |
| Done, with detail | none | Searched for … |
| Done, links out | none | Read the image optimization guide |
| Failed | `error` | Failed to search for … |

Add `zKeepMounted` to the summary’s `z-trace-collapsible-content`. Steps keep their open state when the summary closes.

## Search Results

When a step runs a web search, show the results as a [Badge](/docs/components/badge) for each hostname in the step’s content.

```
<z-trace-collapsible-content class="flex flex-wrap gap-1.5">
  @for (result of results; track result.url) {
    <z-badge zType="secondary">{{ hostname(result.url) }}</z-badge>
  }
</z-trace-collapsible-content>
```

## Streaming

Render each tool call as a step. The steps are running while tool calls stream and before the reply starts. Set the summary’s status and title from the steps. The summary opens while the steps run, as in [Trace](/docs/components/trace#open).

```
<z-trace-collapsible [zOpen]="open() ?? running()" (zOpenChange)="open.set($event)">
  <z-trace-collapsible-trigger>
    <z-trace-line [zStatus]="running() ? 'running' : failed() > 0 ? 'error' : undefined">
      <z-trace-title>{{ running() ? 'Researching' : 'Researched in ' + steps().length + ' steps' }}</z-trace-title>
    </z-trace-line>
  </z-trace-collapsible-trigger>
  <z-trace-collapsible-content zKeepMounted>
    <z-trace>
      @for (step of steps(); track step.id) {
        <!-- a line for each tool call, as in Tool -->
      }
    </z-trace>
  </z-trace-collapsible-content>
</z-trace-collapsible>
```

## API Reference

Chain of Thought has no API of its own. See the API of the components it is built with:

- [Trace](/docs/components/trace#api)
- [Code Block](/docs/components/code-block#api)
- [Badge](/docs/components/badge#api)
