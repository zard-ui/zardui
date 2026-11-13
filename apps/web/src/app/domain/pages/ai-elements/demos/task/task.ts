import { ChangeDetectionStrategy, Component, computed, DestroyRef, inject, input, signal } from '@angular/core';

import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideCircleAlert, lucideCircleCheck, lucideLoaderCircle } from '@ng-icons/lucide';

import { ZardBubbleImports } from '@/shared/components/bubble/bubble.imports';
import { ZardButtonComponent } from '@/shared/components/button/button.component';
import { ZardMessageImports } from '@/shared/components/message/message.imports';
import { ZardTraceImports } from '@/shared/components/trace/trace.imports';

type Status = 'running' | 'error' | undefined;

interface Task {
  id: string;
  title: string;
  steps: { title: string; status: 'done' | 'running' | 'error' }[];
}

const QUESTION = 'Add Open Graph metadata to the home page.';
/** Each title and step, as it reads while running and once it is done. */
const TASKS = [
  {
    id: 'find',
    title: ['Finding the project files', 'Found the project files'],
    steps: [
      ['Searching for the Meta service', 'Searched for the Meta service'],
      ['Reading src/app/app.routes.ts', 'Read src/app/app.routes.ts'],
      ['Reading src/app/home/home.ts', 'Read src/app/home/home.ts'],
    ],
  },
  {
    id: 'update',
    title: ['Updating the page metadata', 'Updated the page metadata'],
    steps: [
      ['Editing src/app/app.routes.ts', 'Edited src/app/app.routes.ts'],
      ['Editing src/app/home/home.ts', 'Edited src/app/home/home.ts'],
    ],
  },
];
const ANSWER =
  'Added a title to the home route in src/app/app.routes.ts and an Open Graph description and image in src/app/home/home.ts.';

/** The task as the agent reports it after `done` of its steps have finished. */
function taskAt(task: (typeof TASKS)[number], done: number): Task {
  return {
    id: task.id,
    title: task.title[done < task.steps.length ? 0 : 1],
    steps: task.steps.slice(0, done + 1).map(([running, finished], index) => ({
      title: index < done ? finished : running,
      status: index < done ? 'done' : 'running',
    })),
  };
}

@Component({
  selector: 'z-ai-elements-task-row',
  imports: [NgIcon, ...ZardTraceImports],
  template: `
    <z-trace-collapsible [zOpen]="open() ?? status() === 'running'" (zOpenChange)="open.set($event)">
      <z-trace-collapsible-trigger>
        <z-trace-line [zStatus]="status()">
          <z-trace-icon>
            <ng-icon [name]="icon(status())" [class.animate-spin]="status() === 'running'" />
          </z-trace-icon>
          <z-trace-title>{{ task().title }}</z-trace-title>
        </z-trace-line>
      </z-trace-collapsible-trigger>
      <z-trace-collapsible-content zKeepMounted>
        <z-trace>
          @for (step of steps(); track step.title) {
            <z-trace-line [zStatus]="step.status">
              <z-trace-title>{{ step.title }}</z-trace-title>
            </z-trace-line>
          }
        </z-trace>
      </z-trace-collapsible-content>
    </z-trace-collapsible>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  viewProviders: [provideIcons({ lucideCircleAlert, lucideCircleCheck, lucideLoaderCircle })],
  host: { class: 'contents' },
})
export class ZardAiElementsTaskRowComponent {
  readonly task = input.required<Task>();
  /** Whether the reply is still streaming. A step left running when it stops has failed. */
  readonly streaming = input(false);

  /** The reader's choice. `undefined` until they toggle the row, so it follows the task until then. */
  protected readonly open = signal<boolean | undefined>(undefined);

  protected readonly steps = computed(() =>
    this.task().steps.map(step => ({
      title: step.title,
      status: (step.status === 'done' ? undefined : step.status === 'running' && this.streaming() ? 'running' : 'error') as Status,
    })),
  );

  /** The task's status comes from its steps. */
  protected readonly status = computed<Status>(() => {
    const steps = this.steps();
    if (steps.some(step => step.status === 'error')) return 'error';
    return steps.some(step => step.status === 'running') ? 'running' : undefined;
  });

  protected icon(status: Status): string {
    if (status === 'running') return 'lucideLoaderCircle';
    return status === 'error' ? 'lucideCircleAlert' : 'lucideCircleCheck';
  }
}

@Component({
  selector: 'z-ai-elements-task',
  imports: [
    ZardAiElementsTaskRowComponent,
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
          @if (tasks().length) {
            <z-trace>
              @for (task of tasks(); track task.id) {
                <z-ai-elements-task-row [task]="task" [streaming]="busy()" />
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
export class ZardAiElementsTaskComponent {
  protected readonly question = QUESTION;

  /** Starts at the end of the run, so the reply reads in full until it is replayed. */
  protected readonly tasks = signal<Task[]>(TASKS.map(task => taskAt(task, task.steps.length)));
  protected readonly answer = signal(ANSWER);
  protected readonly busy = signal(false);

  /** Bumped on every run and on destroy, so a stale run stops at its next step. */
  private run = 0;

  constructor() {
    inject(DestroyRef).onDestroy(() => this.run++);
  }

  /**
   * Simulates the agent. With a real model, have it send the whole task each time a step changes,
   * and replace the task with the same `id` — the template only reads the signals.
   */
  protected async replay(): Promise<void> {
    const run = ++this.run;
    this.busy.set(true);
    this.tasks.set([]);
    this.answer.set('');

    for (const task of TASKS) {
      for (let done = 0; done <= task.steps.length; done++) {
        this.upsert(taskAt(task, done));
        if (!(await this.wait(900, run))) return;
      }
    }

    let shown = '';
    for (const word of ANSWER.split(/(?<=\s)/)) {
      if (!(await this.wait(20, run))) return;
      shown += word;
      this.answer.set(shown);
    }
    this.busy.set(false);
  }

  /** A task the agent sends again replaces the one with the same `id`, so it updates in place. */
  private upsert(task: Task): void {
    this.tasks.update(tasks =>
      tasks.some(other => other.id === task.id)
        ? tasks.map(other => (other.id === task.id ? task : other))
        : [...tasks, task],
    );
  }

  private wait(ms: number, run: number): Promise<boolean> {
    return new Promise(resolve => setTimeout(() => resolve(run === this.run), ms));
  }
}
