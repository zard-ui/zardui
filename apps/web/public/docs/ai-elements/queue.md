---
title: Queue
description: Displays the agent's todo list, split into what is left and what is done.
---

# Queue

Displays the agent's todo list, split into what is left and what is done.

```
import { NgTemplateOutlet } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, DestroyRef, inject, signal } from '@angular/core';

import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideCircle, lucideCircleCheck, lucideCircleDot, lucideListChecks, lucideListTodo } from '@ng-icons/lucide';

import { ZardBubbleImports } from '@/shared/components/bubble/bubble.imports';
import { ZardButtonComponent } from '@/shared/components/button/button.component';
import { ZardMessageImports } from '@/shared/components/message/message.imports';
import { ZardTraceImports } from '@/shared/components/trace/trace.imports';

interface Todo {
  content: string;
  status: 'pending' | 'in_progress' | 'completed';
}

const QUESTION = 'Add dark mode to the settings page.';
const TODOS = [
  'Add a dark variant to the theme tokens',
  'Read the theme from a cookie',
  'Add a toggle to the settings page',
  'Check contrast on the charts',
];
const ANSWER = 'Dark mode is in. The toggle is under Settings, Appearance.';

const ICONS: Record<Todo['status'], string> = {
  pending: 'lucideCircle',
  in_progress: 'lucideCircleDot',
  completed: 'lucideCircleCheck',
};

/** The whole list, as the agent writes it after `current` todos are completed. */
function todosAt(current: number): Todo[] {
  return TODOS.map((content, index) => ({
    content,
    status: index < current ? 'completed' : index === current ? 'in_progress' : 'pending',
  }));
}

@Component({
  selector: 'z-ai-elements-queue',
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

      <z-message>
        <z-message-content class="gap-4">
          <ng-template #todoLine let-todo>
            <z-trace-line [zStatus]="busy() && todo.status === 'in_progress' ? 'running' : undefined">
              <z-trace-icon><ng-icon [name]="icon(todo)" /></z-trace-icon>
              <z-trace-title>{{ todo.content }}</z-trace-title>
            </z-trace-line>
          </ng-template>

          @if (todos().length) {
            <z-trace>
              @if (pending().length) {
                <z-trace-collapsible zOpen>
                  <z-trace-collapsible-trigger>
                    <z-trace-line>
                      <z-trace-icon><ng-icon name="lucideListTodo" /></z-trace-icon>
                      <z-trace-title>{{ pending().length }} to do</z-trace-title>
                    </z-trace-line>
                  </z-trace-collapsible-trigger>
                  <z-trace-collapsible-content>
                    <z-trace>
                      @for (todo of pending(); track todo.content) {
                        <ng-container *ngTemplateOutlet="todoLine; context: { $implicit: todo }" />
                      }
                    </z-trace>
                  </z-trace-collapsible-content>
                </z-trace-collapsible>
              }
              @if (completed().length) {
                <z-trace-collapsible zOpen>
                  <z-trace-collapsible-trigger>
                    <z-trace-line>
                      <z-trace-icon><ng-icon name="lucideListChecks" /></z-trace-icon>
                      <z-trace-title>{{ completed().length }} completed</z-trace-title>
                    </z-trace-line>
                  </z-trace-collapsible-trigger>
                  <z-trace-collapsible-content>
                    <z-trace>
                      @for (todo of completed(); track todo.content) {
                        <ng-container *ngTemplateOutlet="todoLine; context: { $implicit: todo }" />
                      }
                    </z-trace>
                  </z-trace-collapsible-content>
                </z-trace-collapsible>
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
  viewProviders: [provideIcons({ lucideCircle, lucideCircleCheck, lucideCircleDot, lucideListChecks, lucideListTodo })],
  host: { class: 'contents' },
})
export class ZardAiElementsQueueComponent {
  protected readonly question = QUESTION;

  /** Starts at the end of the run, so the reply reads in full until it is replayed. */
  protected readonly todos = signal<Todo[]>(todosAt(TODOS.length));
  protected readonly answer = signal(ANSWER);
  protected readonly busy = signal(false);

  protected readonly pending = computed(() => this.todos().filter(todo => todo.status !== 'completed'));
  protected readonly completed = computed(() => this.todos().filter(todo => todo.status === 'completed'));

  protected icon(todo: Todo): string {
    return ICONS[todo.status];
  }

  /** Bumped on every run and on destroy, so a stale run stops at its next step. */
  private run = 0;

  constructor() {
    inject(DestroyRef).onDestroy(() => this.run++);
  }

  /**
   * Simulates the agent. With a real model, the agent writes its todos with a tool, and every call sends
   * the whole list: set `todos` to the last call's list — the template only reads the signals.
   */
  protected async replay(): Promise<void> {
    const run = ++this.run;
    this.busy.set(true);
    this.todos.set([]);
    this.answer.set('');

    for (let current = 0; current < TODOS.length; current++) {
      this.todos.set(todosAt(current));
      if (!(await this.wait(1400, run))) return;
    }
    this.todos.set(todosAt(TODOS.length));

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

Queue is the agent’s todo list. Todos sit in two sections, To do and Completed, and the icon on each todo shows its status. The agent updates the list as it works, so a todo moves from one section to the other when it is done.

Queue is a `z-trace` with a `z-trace-collapsible` for each section.

## Installation

Queue is built with [Trace](/docs/components/trace). Add it with the CLI:

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
      <z-trace-line>
        <z-trace-icon><ng-icon name="lucideListTodo" /></z-trace-icon>
        <z-trace-title>2 to do</z-trace-title>
      </z-trace-line>
    </z-trace-collapsible-trigger>
    <z-trace-collapsible-content>
      <z-trace>
        <z-trace-line>
          <z-trace-icon><ng-icon name="lucideCircle" /></z-trace-icon>
          <z-trace-title>Update the registry snapshots</z-trace-title>
        </z-trace-line>
        <z-trace-line>
          <z-trace-icon><ng-icon name="lucideCircle" /></z-trace-icon>
          <z-trace-title>Add tests for the combobox</z-trace-title>
        </z-trace-line>
      </z-trace>
    </z-trace-collapsible-content>
  </z-trace-collapsible>
  <z-trace-collapsible>
    <z-trace-collapsible-trigger>
      <z-trace-line>
        <z-trace-icon><ng-icon name="lucideListChecks" /></z-trace-icon>
        <z-trace-title>1 completed</z-trace-title>
      </z-trace-line>
    </z-trace-collapsible-trigger>
    <z-trace-collapsible-content>
      <z-trace>
        <z-trace-line>
          <z-trace-icon><ng-icon name="lucideCircleCheck" /></z-trace-icon>
          <z-trace-title>Add a changeset</z-trace-title>
        </z-trace-line>
      </z-trace>
    </z-trace-collapsible-content>
  </z-trace-collapsible>
</z-trace>
```

## Descriptions

A todo with a description is a `z-trace-collapsible` that opens to show it. A todo without one stays a `z-trace-line`.

```
import { NgTemplateOutlet } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';

import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideCircle, lucideCircleCheck, lucideListChecks, lucideListTodo } from '@ng-icons/lucide';

import { ZardTraceImports } from '@/shared/components/trace/trace.imports';

interface Todo {
  title: string;
  description?: string;
  done: boolean;
}

const TODOS: Todo[] = [
  {
    title: 'Write the migration guide',
    description: 'Cover the renamed inputs and the new data attributes.',
    done: true,
  },
  { title: 'Add a changeset', done: true },
  {
    title: 'Fix the focus ring on the select trigger',
    description: 'It is clipped by overflow-hidden on the field.',
    done: false,
  },
  { title: 'Update the registry snapshots', done: false },
  { title: 'Add tests for the combobox', description: 'Typing, clearing and keyboard selection.', done: false },
];

@Component({
  selector: 'z-ai-elements-queue-descriptions',
  imports: [NgIcon, NgTemplateOutlet, ...ZardTraceImports],
  template: `
    <!-- A todo with a description opens to show it. A todo without one stays a line. -->
    <ng-template #todoRow let-todo>
      <ng-template #line>
        <z-trace-line>
          <z-trace-icon><ng-icon [name]="todo.done ? 'lucideCircleCheck' : 'lucideCircle'" /></z-trace-icon>
          <z-trace-title>{{ todo.title }}</z-trace-title>
        </z-trace-line>
      </ng-template>

      @if (todo.description) {
        <z-trace-collapsible>
          <z-trace-collapsible-trigger>
            <ng-container *ngTemplateOutlet="line" />
          </z-trace-collapsible-trigger>
          <z-trace-collapsible-content>{{ todo.description }}</z-trace-collapsible-content>
        </z-trace-collapsible>
      } @else {
        <ng-container *ngTemplateOutlet="line" />
      }
    </ng-template>

    <z-trace class="max-w-sm">
      <z-trace-collapsible zOpen>
        <z-trace-collapsible-trigger>
          <z-trace-line>
            <z-trace-icon><ng-icon name="lucideListTodo" /></z-trace-icon>
            <z-trace-title>{{ pending.length }} to do</z-trace-title>
          </z-trace-line>
        </z-trace-collapsible-trigger>
        <z-trace-collapsible-content zKeepMounted>
          <z-trace>
            @for (todo of pending; track todo.title) {
              <ng-container *ngTemplateOutlet="todoRow; context: { $implicit: todo }" />
            }
          </z-trace>
        </z-trace-collapsible-content>
      </z-trace-collapsible>

      <z-trace-collapsible>
        <z-trace-collapsible-trigger>
          <z-trace-line>
            <z-trace-icon><ng-icon name="lucideListChecks" /></z-trace-icon>
            <z-trace-title>{{ completed.length }} completed</z-trace-title>
          </z-trace-line>
        </z-trace-collapsible-trigger>
        <z-trace-collapsible-content zKeepMounted>
          <z-trace>
            @for (todo of completed; track todo.title) {
              <ng-container *ngTemplateOutlet="todoRow; context: { $implicit: todo }" />
            }
          </z-trace>
        </z-trace-collapsible-content>
      </z-trace-collapsible>
    </z-trace>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  viewProviders: [provideIcons({ lucideCircle, lucideCircleCheck, lucideListChecks, lucideListTodo })],
})
export class ZardAiElementsQueueDescriptionsComponent {
  protected readonly pending = TODOS.filter(todo => !todo.done);
  protected readonly completed = TODOS.filter(todo => todo.done);
}
```

```
<z-trace-collapsible>
  <z-trace-collapsible-trigger>
    <z-trace-line>
      <z-trace-icon><ng-icon name="lucideCircle" /></z-trace-icon>
      <z-trace-title>Fix the focus ring on the select trigger</z-trace-title>
    </z-trace-line>
  </z-trace-collapsible-trigger>
  <z-trace-collapsible-content>It is clipped by overflow-hidden on the field.</z-trace-collapsible-content>
</z-trace-collapsible>
```

## Streaming

The agent writes its todos with a tool. Each call sends the whole list, so set the list from the last call, and skip a call whose input is still streaming.

```
interface Todo {
  content: string;
  status: 'pending' | 'in_progress' | 'completed';
}

// Each call of the agent's todo tool sends the whole list, so set it, don't append.
protected readonly todos = signal<Todo[]>([]);

protected readonly pending = computed(() => this.todos().filter(todo => todo.status !== 'completed'));
protected readonly completed = computed(() => this.todos().filter(todo => todo.status === 'completed'));
```

Map each todo status to a section, an icon and a `zStatus`. Set `running` on the todo in progress only while the reply streams, so its title stops shimmering when the agent stops.

| Todo status | Section | Icon | `zStatus` |
| --- | --- | --- | --- |
| `pending` | To do | `lucideCircle` | none |
| `in_progress` | To do | `lucideCircleDot` | `running` while the reply streams |
| `completed` | Completed | `lucideCircleCheck` | none |

## API Reference

Queue has no API of its own. See the API of the components it is built with:

- [Trace](/docs/components/trace#api)
