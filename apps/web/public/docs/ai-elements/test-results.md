---
title: Test Results
description: Displays a test run by the agent, with its suites and failures.
---

# Test Results

Displays a test run by the agent, with its suites and failures.

```
import { NgTemplateOutlet } from '@angular/common';
import { ChangeDetectionStrategy, Component, DestroyRef, inject, signal } from '@angular/core';

import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideCheck, lucideCircleDashed, lucideFileCode, lucideFlaskConical, lucideX } from '@ng-icons/lucide';

import { ZardBubbleImports } from '@/shared/components/bubble/bubble.imports';
import { ZardButtonComponent } from '@/shared/components/button/button.component';
import { ZardCodeBlockImports } from '@/shared/components/code-block/code-block.imports';
import { ZardMessageImports } from '@/shared/components/message/message.imports';
import { ZardTraceImports } from '@/shared/components/trace/trace.imports';

interface Test {
  name: string;
  status: 'passed' | 'failed' | 'skipped';
  error?: string;
}

interface Suite {
  name: string;
  tests: Test[];
}

const QUESTION = 'Run the checkout tests.';
const COMMAND = 'ng test --include=src/app/checkout';
const SUITES: Suite[] = [
  {
    name: 'cart.spec.ts',
    tests: [
      { name: 'adds an item', status: 'passed' },
      { name: 'removes an item', status: 'passed' },
      { name: 'applies a discount code', status: 'passed' },
    ],
  },
  {
    name: 'payment.spec.ts',
    tests: [
      { name: 'charges the saved card', status: 'passed' },
      {
        name: 'retries a declined card',
        status: 'failed',
        error: 'Expected 2 charge attempts, received 1\n  at Object.<anonymous> (src/payment.spec.ts:58:22)',
      },
    ],
  },
];
const ANSWER =
  'One test failed. The payment service does not retry a declined card, so the second charge attempt never happens.';

/** "5 tests, 1 failed". */
function formatCounts(tests: Test[]): string {
  const failed = tests.filter(test => test.status === 'failed').length;
  const skipped = tests.filter(test => test.status === 'skipped').length;
  return [`${tests.length} tests`, failed > 0 && `${failed} failed`, skipped > 0 && `${skipped} skipped`]
    .filter(Boolean)
    .join(', ');
}

const hasFailure = (tests: Test[]) => tests.some(test => test.status === 'failed');

@Component({
  selector: 'z-ai-elements-test-results',
  imports: [
    NgIcon,
    NgTemplateOutlet,
    ZardButtonComponent,
    ...ZardBubbleImports,
    ...ZardCodeBlockImports,
    ...ZardMessageImports,
    ...ZardTraceImports,
  ],
  template: `
    <!-- A failed test opens into its error. A passed or skipped test is a plain line. -->
    <ng-template #testRow let-test>
      @if (test.status === 'failed') {
        <z-trace-collapsible zOpen>
          <z-trace-collapsible-trigger>
            <z-trace-line zStatus="error">
              <z-trace-icon><ng-icon name="lucideX" /></z-trace-icon>
              <z-trace-title>{{ test.name }}</z-trace-title>
            </z-trace-line>
          </z-trace-collapsible-trigger>
          <z-trace-collapsible-content>
            <z-code-block zSize="sm">
              <z-code-block-content zWrap class="max-h-64">{{ test.error }}</z-code-block-content>
            </z-code-block>
          </z-trace-collapsible-content>
        </z-trace-collapsible>
      } @else {
        <z-trace-line>
          <z-trace-icon>
            <ng-icon [name]="test.status === 'skipped' ? 'lucideCircleDashed' : 'lucideCheck'" />
          </z-trace-icon>
          <z-trace-title>{{ test.status === 'skipped' ? 'Skipped ' + test.name : test.name }}</z-trace-title>
        </z-trace-line>
      }
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
          <z-trace>
            @if (suites(); as suites) {
              <z-trace-collapsible [zOpen]="hasFailure(all(suites))">
                <z-trace-collapsible-trigger>
                  <z-trace-line [zStatus]="hasFailure(all(suites)) ? 'error' : undefined">
                    <z-trace-icon><ng-icon name="lucideFlaskConical" /></z-trace-icon>
                    <z-trace-title>Ran {{ formatCounts(all(suites)) }}</z-trace-title>
                  </z-trace-line>
                </z-trace-collapsible-trigger>
                <z-trace-collapsible-content zKeepMounted>
                  <z-trace>
                    @for (suite of suites; track suite.name) {
                      <z-trace-collapsible [zOpen]="hasFailure(suite.tests)">
                        <z-trace-collapsible-trigger>
                          <z-trace-line [zStatus]="hasFailure(suite.tests) ? 'error' : undefined">
                            <z-trace-icon><ng-icon name="lucideFileCode" /></z-trace-icon>
                            <z-trace-title>{{ suite.name }}, {{ formatCounts(suite.tests) }}</z-trace-title>
                          </z-trace-line>
                        </z-trace-collapsible-trigger>
                        <z-trace-collapsible-content zKeepMounted>
                          <z-trace>
                            @for (test of suite.tests; track test.name) {
                              <ng-container *ngTemplateOutlet="testRow; context: { $implicit: test }" />
                            }
                          </z-trace>
                        </z-trace-collapsible-content>
                      </z-trace-collapsible>
                    }
                  </z-trace>
                </z-trace-collapsible-content>
              </z-trace-collapsible>
            } @else {
              <z-trace-line [zStatus]="busy() ? 'running' : 'error'">
                <z-trace-icon><ng-icon name="lucideFlaskConical" /></z-trace-icon>
                <z-trace-title>{{ busy() ? 'Running' : 'Failed to run' }} {{ command }}</z-trace-title>
              </z-trace-line>
            }
          </z-trace>

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
  viewProviders: [provideIcons({ lucideCheck, lucideCircleDashed, lucideFileCode, lucideFlaskConical, lucideX })],
  host: { class: 'contents' },
})
export class ZardAiElementsTestResultsComponent {
  protected readonly question = QUESTION;
  protected readonly command = COMMAND;
  protected readonly formatCounts = formatCounts;
  protected readonly hasFailure = hasFailure;

  /** Starts at the end of the run, so the reply reads in full until it is replayed. */
  protected readonly suites = signal<Suite[] | null>(SUITES);
  protected readonly answer = signal(ANSWER);
  protected readonly busy = signal(false);

  /** Bumped on every run and on destroy, so a stale run stops at its next step. */
  private run = 0;

  constructor() {
    inject(DestroyRef).onDestroy(() => this.run++);
  }

  protected all(suites: Suite[]): Test[] {
    return suites.flatMap(suite => suite.tests);
  }

  /** Simulates the agent. With a real model, set `suites` from the result of the test tool. */
  protected async replay(): Promise<void> {
    const run = ++this.run;
    this.busy.set(true);
    this.suites.set(null);
    this.answer.set('');

    if (!(await this.wait(1500, run))) return;
    this.suites.set(SUITES);

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

Test Results is a test run by the agent. The summary line counts what passed and failed. Open it to see each suite, its tests, and the error for each failure.

Test Results is a `z-trace` with a `z-trace-collapsible` for the run and for each suite.

## Installation

Test Results is built with [Trace](/docs/components/trace) and [Code Block](/docs/components/code-block). Add them with the CLI:

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
  <z-trace-collapsible zOpen>
    <z-trace-collapsible-trigger>
      <z-trace-line zStatus="error">
        <z-trace-icon><ng-icon name="lucideFlaskConical" /></z-trace-icon>
        <z-trace-title>Ran 2 tests, 1 failed</z-trace-title>
      </z-trace-line>
    </z-trace-collapsible-trigger>
    <z-trace-collapsible-content>
      <z-trace>
        <z-trace-line>
          <z-trace-icon><ng-icon name="lucideCheck" /></z-trace-icon>
          <z-trace-title>creates a user</z-trace-title>
        </z-trace-line>
        <z-trace-collapsible>
          <z-trace-collapsible-trigger>
            <z-trace-line zStatus="error">
              <z-trace-icon><ng-icon name="lucideX" /></z-trace-icon>
              <z-trace-title>updates a user profile</z-trace-title>
            </z-trace-line>
          </z-trace-collapsible-trigger>
          <z-trace-collapsible-content>
            <z-code-block zSize="sm">
              <z-code-block-content zWrap>Expected status 200, received 500</z-code-block-content>
            </z-code-block>
          </z-trace-collapsible-content>
        </z-trace-collapsible>
      </z-trace>
    </z-trace-collapsible-content>
  </z-trace-collapsible>
</z-trace>
```

## Suites

Group tests by file. Each suite is a collapsible line with a `z-trace` of its tests. Open the suites that have a failure.

```
import { NgTemplateOutlet } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';

import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideCheck, lucideCircleDashed, lucideFileCode, lucideFlaskConical, lucideX } from '@ng-icons/lucide';

import { ZardCodeBlockImports } from '@/shared/components/code-block/code-block.imports';
import { ZardTraceImports } from '@/shared/components/trace/trace.imports';

interface Test {
  name: string;
  status: 'passed' | 'failed' | 'skipped';
  error?: string;
}

const SUITES: { name: string; tests: Test[] }[] = [
  {
    name: 'auth.spec.ts',
    tests: [
      { name: 'logs in with valid credentials', status: 'passed' },
      { name: 'rejects an invalid password', status: 'passed' },
      { name: 'refreshes an expired token', status: 'passed' },
    ],
  },
  {
    name: 'user-api.spec.ts',
    tests: [
      { name: 'creates a user', status: 'passed' },
      {
        name: 'updates a user profile',
        status: 'failed',
        error: 'Expected status 200, received 500\n  at Object.<anonymous> (src/user-api.spec.ts:45:12)',
      },
      { name: 'deletes a user', status: 'skipped' },
    ],
  },
  {
    name: 'db.spec.ts',
    tests: [
      { name: 'connects to the database', status: 'passed' },
      {
        name: 'times out a slow query',
        status: 'failed',
        error: 'Exceeded timeout of 5000 ms for a test.\n  at Object.<anonymous> (src/db.spec.ts:22:3)',
      },
    ],
  },
];

/** "8 tests, 2 failed, 1 skipped". */
function formatCounts(tests: Test[]): string {
  const failed = tests.filter(test => test.status === 'failed').length;
  const skipped = tests.filter(test => test.status === 'skipped').length;
  return [`${tests.length} tests`, failed > 0 && `${failed} failed`, skipped > 0 && `${skipped} skipped`]
    .filter(Boolean)
    .join(', ');
}

const hasFailure = (tests: Test[]) => tests.some(test => test.status === 'failed');

@Component({
  selector: 'z-ai-elements-test-results-suites',
  imports: [NgIcon, NgTemplateOutlet, ...ZardCodeBlockImports, ...ZardTraceImports],
  template: `
    <ng-template #testRow let-test>
      @if (test.status === 'failed') {
        <z-trace-collapsible>
          <z-trace-collapsible-trigger>
            <z-trace-line zStatus="error">
              <z-trace-icon><ng-icon name="lucideX" /></z-trace-icon>
              <z-trace-title>{{ test.name }}</z-trace-title>
            </z-trace-line>
          </z-trace-collapsible-trigger>
          <z-trace-collapsible-content>
            <z-code-block zSize="sm">
              <z-code-block-content zWrap class="max-h-64">{{ test.error }}</z-code-block-content>
            </z-code-block>
          </z-trace-collapsible-content>
        </z-trace-collapsible>
      } @else {
        <z-trace-line>
          <z-trace-icon>
            <ng-icon [name]="test.status === 'skipped' ? 'lucideCircleDashed' : 'lucideCheck'" />
          </z-trace-icon>
          <z-trace-title>{{ test.status === 'skipped' ? 'Skipped ' + test.name : test.name }}</z-trace-title>
        </z-trace-line>
      }
    </ng-template>

    <z-trace class="max-w-sm">
      <z-trace-collapsible zOpen>
        <z-trace-collapsible-trigger>
          <z-trace-line [zStatus]="hasFailure(all) ? 'error' : undefined">
            <z-trace-icon><ng-icon name="lucideFlaskConical" /></z-trace-icon>
            <z-trace-title>Ran {{ formatCounts(all) }}</z-trace-title>
          </z-trace-line>
        </z-trace-collapsible-trigger>
        <z-trace-collapsible-content zKeepMounted>
          <z-trace>
            <!-- Each suite is a row of its own. Open the ones with a failure. -->
            @for (suite of suites; track suite.name) {
              <z-trace-collapsible [zOpen]="hasFailure(suite.tests)">
                <z-trace-collapsible-trigger>
                  <z-trace-line [zStatus]="hasFailure(suite.tests) ? 'error' : undefined">
                    <z-trace-icon><ng-icon name="lucideFileCode" /></z-trace-icon>
                    <z-trace-title>{{ suite.name }}, {{ formatCounts(suite.tests) }}</z-trace-title>
                  </z-trace-line>
                </z-trace-collapsible-trigger>
                <z-trace-collapsible-content zKeepMounted>
                  <z-trace>
                    @for (test of suite.tests; track test.name) {
                      <ng-container *ngTemplateOutlet="testRow; context: { $implicit: test }" />
                    }
                  </z-trace>
                </z-trace-collapsible-content>
              </z-trace-collapsible>
            }
          </z-trace>
        </z-trace-collapsible-content>
      </z-trace-collapsible>
    </z-trace>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  viewProviders: [provideIcons({ lucideCheck, lucideCircleDashed, lucideFileCode, lucideFlaskConical, lucideX })],
})
export class ZardAiElementsTestResultsSuitesComponent {
  protected readonly suites = SUITES;
  protected readonly all = SUITES.flatMap(suite => suite.tests);
  protected readonly formatCounts = formatCounts;
  protected readonly hasFailure = hasFailure;
}
```

```
<z-trace-collapsible [zOpen]="hasFailure(suite.tests)">
  <z-trace-collapsible-trigger>
    <z-trace-line [zStatus]="hasFailure(suite.tests) ? 'error' : undefined">
      <z-trace-icon><ng-icon name="lucideFileCode" /></z-trace-icon>
      <z-trace-title>{{ suite.name }}, {{ formatCounts(suite.tests) }}</z-trace-title>
    </z-trace-line>
  </z-trace-collapsible-trigger>
  <z-trace-collapsible-content zKeepMounted>
    <z-trace>
      @for (test of suite.tests; track test.name) {
        <!-- a line for each test, as above -->
      }
    </z-trace>
  </z-trace-collapsible-content>
</z-trace-collapsible>
```

## Streaming

Run the tests as a tool and render its result. The tool states map the same way as in [Tool](/docs/ai-elements/tool#states).

```
const tests = result.suites.flatMap(suite => suite.tests);
const failed = tests.filter(test => test.status === 'failed').length;
const title = `Ran ${tests.length} tests${failed > 0 ? `, ${failed} failed` : ''}`;
```

## API Reference

Test Results has no API of its own. See the API of the components it is built with:

- [Trace](/docs/components/trace#api)
- [Code Block](/docs/components/code-block#api)
