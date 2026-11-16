---
title: Plan
description: Displays the steps the agent plans to take, and how far it has got.
---

# Plan

Displays the steps the agent plans to take, and how far it has got.

```
import { ChangeDetectionStrategy, Component, computed, DestroyRef, inject, signal } from '@angular/core';

import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideCircle, lucideCircleCheck, lucideCircleDot, lucideRoute } from '@ng-icons/lucide';

import { ZardBubbleImports } from '@/shared/components/bubble/bubble.imports';
import { ZardButtonComponent } from '@/shared/components/button/button.component';
import { ZardMessageImports } from '@/shared/components/message/message.imports';
import { ZardTraceImports } from '@/shared/components/trace/trace.imports';

type StepStatus = 'done' | 'running' | 'pending';

const QUESTION = 'Migrate the dialogs to the new overlay API.';
const TITLE = 'Plan: migrate the dialogs';
const STEPS = [
  'Move the dialog state into a service',
  'Replace the ViewContainerRef calls',
  'Rename zOnOk to zOk',
  'Run the type checker',
];
const ANSWER = 'Migrated Dialog and Alert Dialog. The type checker passes.';

@Component({
  selector: 'z-ai-elements-plan',
  imports: [NgIcon, ZardButtonComponent, ...ZardBubbleImports, ...ZardMessageImports, ...ZardTraceImports],
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
          <z-trace>
            <z-trace-collapsible zOpen>
              <z-trace-collapsible-trigger>
                <z-trace-line [zStatus]="busy() ? 'running' : undefined">
                  <z-trace-icon><ng-icon name="lucideRoute" /></z-trace-icon>
                  <z-trace-title>{{ title }}</z-trace-title>
                  <z-trace-description>{{ done() }} of {{ steps().length }} done</z-trace-description>
                </z-trace-line>
              </z-trace-collapsible-trigger>
              <z-trace-collapsible-content>
                <z-trace>
                  @for (step of steps(); track step.title) {
                    <z-trace-line [zStatus]="step.status === 'done' ? undefined : step.status">
                      <z-trace-icon><ng-icon [name]="icons[step.status]" /></z-trace-icon>
                      <z-trace-title>{{ step.title }}</z-trace-title>
                    </z-trace-line>
                  }
                </z-trace>
              </z-trace-collapsible-content>
            </z-trace-collapsible>
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
  viewProviders: [provideIcons({ lucideCircle, lucideCircleCheck, lucideCircleDot, lucideRoute })],
  host: { class: 'contents' },
})
export class ZardAiElementsPlanComponent {
  protected readonly question = QUESTION;
  protected readonly title = TITLE;
  protected readonly icons: Record<StepStatus, string> = {
    done: 'lucideCircleCheck',
    running: 'lucideCircleDot',
    pending: 'lucideCircle',
  };

  /** How many steps have finished. Starts at the end, so the plan reads as done until it is replayed. */
  protected readonly current = signal(STEPS.length);
  protected readonly answer = signal(ANSWER);
  protected readonly busy = signal(false);

  protected readonly steps = computed(() =>
    STEPS.map((title, index) => ({
      title,
      status: (index < this.current() ? 'done' : index === this.current() ? 'running' : 'pending') as StepStatus,
    })),
  );

  protected readonly done = computed(() => this.steps().filter(step => step.status === 'done').length);

  /** Bumped on every run and on destroy, so a stale run stops at its next step. */
  private run = 0;

  constructor() {
    inject(DestroyRef).onDestroy(() => this.run++);
  }

  /**
   * Simulates the agent. With a real model, write each update of the plan your stream sends into
   * `current` instead — the template only reads the signals.
   */
  protected async replay(): Promise<void> {
    const run = ++this.run;
    this.busy.set(true);
    this.answer.set('');
    this.current.set(0);

    for (let step = 1; step <= STEPS.length; step++) {
      if (!(await this.wait(1200, run))) return;
      this.current.set(step);
    }

    if (!(await this.wait(400, run))) return;
    this.answer.set(ANSWER);
    this.busy.set(false);
  }

  private wait(ms: number, run: number): Promise<boolean> {
    return new Promise(resolve => setTimeout(() => resolve(run === this.run), ms));
  }
}
```

Plan is the list of steps the agent decides on before it starts, such as the steps of a migration. Each step is done, running or pending, and the title counts how many are done.

Plan is a `z-trace` with a `z-trace-collapsible` for the plan and a nested `z-trace` for its steps.

When the steps are not known up front, use [Task](/docs/ai-elements/task) instead.

## Installation

Plan is built with [Trace](/docs/components/trace). Add it with the CLI:

```
npx zard-cli add trace
```

Then copy the code of the example into your project and adapt it. There is no package to install: the pattern is yours. To install a component by hand, follow the Manual tab on its page.

## Usage

```
import { ZardTraceImports } from '@/shared/components/trace/trace.imports';
```

```
<z-trace>
  <z-trace-collapsible zOpen>
    <z-trace-collapsible-trigger>
      <z-trace-line zStatus="running">
        <z-trace-icon><ng-icon name="lucideRoute" /></z-trace-icon>
        <z-trace-title>Plan: migrate the dialogs</z-trace-title>
        <z-trace-description>1 of 3 done</z-trace-description>
      </z-trace-line>
    </z-trace-collapsible-trigger>
    <z-trace-collapsible-content>
      <z-trace>
        <z-trace-line>
          <z-trace-icon><ng-icon name="lucideCircleCheck" /></z-trace-icon>
          <z-trace-title>Move the dialog state into a service</z-trace-title>
        </z-trace-line>
        <z-trace-line zStatus="running">
          <z-trace-icon><ng-icon name="lucideCircleDot" /></z-trace-icon>
          <z-trace-title>Replace the ViewContainerRef calls</z-trace-title>
        </z-trace-line>
        <z-trace-line zStatus="pending">
          <z-trace-icon><ng-icon name="lucideCircle" /></z-trace-icon>
          <z-trace-title>Run the type checker</z-trace-title>
        </z-trace-line>
      </z-trace>
    </z-trace-collapsible-content>
  </z-trace-collapsible>
</z-trace>
```

## Details

Put a description above the steps, inside `z-trace-collapsible-content`.

```
import { ChangeDetectionStrategy, Component } from '@angular/core';

import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideCircle, lucideCircleCheck, lucideRoute } from '@ng-icons/lucide';

import { ZardTraceImports } from '@/shared/components/trace/trace.imports';

const STEPS = [
  { title: 'Add a dark variant to the theme tokens', done: true },
  { title: 'Read the theme from a cookie on the server', done: false },
  { title: 'Add a toggle to the settings page', done: false },
  { title: 'Check contrast on the charts', done: false },
];

@Component({
  selector: 'z-ai-elements-plan-description',
  imports: [NgIcon, ...ZardTraceImports],
  template: `
    <div class="w-full max-w-sm text-sm">
      <z-trace>
        <z-trace-collapsible zOpen>
          <z-trace-collapsible-trigger>
            <z-trace-line>
              <z-trace-icon><ng-icon name="lucideRoute" /></z-trace-icon>
              <z-trace-title>Plan: add dark mode</z-trace-title>
              <z-trace-description>1 of {{ steps.length }} done</z-trace-description>
            </z-trace-line>
          </z-trace-collapsible-trigger>
          <z-trace-collapsible-content class="flex flex-col gap-3">
            <p>Store the theme in a cookie so the server renders the right one and the page does not flash on load.</p>
            <z-trace>
              @for (step of steps; track step.title) {
                <z-trace-line [zStatus]="step.done ? undefined : 'pending'">
                  <z-trace-icon>
                    <ng-icon [name]="step.done ? 'lucideCircleCheck' : 'lucideCircle'" />
                  </z-trace-icon>
                  <z-trace-title>{{ step.title }}</z-trace-title>
                </z-trace-line>
              }
            </z-trace>
          </z-trace-collapsible-content>
        </z-trace-collapsible>
      </z-trace>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  viewProviders: [provideIcons({ lucideCircle, lucideCircleCheck, lucideRoute })],
  host: { class: 'contents' },
})
export class ZardAiElementsPlanDescriptionComponent {
  protected readonly steps = STEPS;
}
```

## Streaming

The example simulates the agent with a timer. With a real model, have it send the whole plan each time a step changes, and set it on a signal. Setting, not appending, is what makes the plan update in place.

```
interface PlanUpdate {
  title: string;
  steps: { title: string; status: 'done' | 'running' | 'pending' }[];
}

// Each update is the whole plan, so it replaces the last one instead of adding to it.
protected readonly plan = signal<PlanUpdate | null>(null);

constructor() {
  this.agent.updates$
    .pipe(
      filter(update => update.type === 'plan'),
      takeUntilDestroyed(),
    )
    .subscribe(update => this.plan.set(update.data));
}
```

## API Reference

Plan has no API of its own. See the API of the components it is built with:

- [Trace](/docs/components/trace#api)
