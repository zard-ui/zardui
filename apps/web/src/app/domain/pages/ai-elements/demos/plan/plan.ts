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
