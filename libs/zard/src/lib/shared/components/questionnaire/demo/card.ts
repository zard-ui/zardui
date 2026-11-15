import { ChangeDetectionStrategy, Component, inject } from '@angular/core';

import { ZardCardImports } from '@/shared/components/card/card.imports';
import { ZardSonnerService } from '@/shared/components/sonner/sonner.service';

import { ZardQuestionnaireImports } from '../questionnaire.imports';
import type { ZardQuestionnaireAnswers, ZardQuestionnaireItem } from '../questionnaire.types';

@Component({
  selector: 'z-demo-questionnaire-card',
  imports: [ZardCardImports, ZardQuestionnaireImports],
  template: `
    <z-questionnaire class="mx-auto max-w-md" [zItems]="items" zShortcuts="numbers" (zSubmit)="createTask($event)">
      <z-card>
        <z-questionnaire-item zName="task" zRequired>
          <z-card-header>
            <z-questionnaire-title id="task-title">
              <z-card-title zTitle="What should the agent work on?" />
            </z-questionnaire-title>
            <z-questionnaire-description>
              <z-card-description zDescription="Choose the task that should be handled next." />
            </z-questionnaire-description>
            <z-card-action>
              <z-questionnaire-progress />
            </z-card-action>
          </z-card-header>
          <z-card-content>
            <z-questionnaire-choices>
              <z-questionnaire-choice zValue="fix">Fix the failing tests</z-questionnaire-choice>
              <z-questionnaire-choice zValue="refactor">Refactor the data layer</z-questionnaire-choice>
              <z-questionnaire-choice zValue="docs">Update the integration guide</z-questionnaire-choice>
            </z-questionnaire-choices>
            <z-questionnaire-error />
          </z-card-content>
        </z-questionnaire-item>

        <z-questionnaire-item zName="output" zRequired>
          <z-card-header>
            <z-questionnaire-title id="output-title">
              <z-card-title zTitle="What should the final handoff include?" />
            </z-questionnaire-title>
            <z-questionnaire-description>
              <z-card-description zDescription="Pick the level of detail needed for review." />
            </z-questionnaire-description>
            <z-card-action>
              <z-questionnaire-progress />
            </z-card-action>
          </z-card-header>
          <z-card-content>
            <z-questionnaire-choices>
              <z-questionnaire-choice zValue="summary">Summary only</z-questionnaire-choice>
              <z-questionnaire-choice zValue="files">Summary and changed files</z-questionnaire-choice>
              <z-questionnaire-choice zValue="review">Full review handoff</z-questionnaire-choice>
            </z-questionnaire-choices>
            <z-questionnaire-error />
          </z-card-content>
        </z-questionnaire-item>

        <z-card-footer>
          <z-questionnaire-actions class="w-full">
            <button type="button" z-questionnaire-previous>Previous</button>
            <button type="button" z-questionnaire-next>Next</button>
            <button type="submit" z-questionnaire-submit>Create task</button>
          </z-questionnaire-actions>
        </z-card-footer>
      </z-card>
    </z-questionnaire>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'block w-full' },
})
export class ZardDemoQuestionnaireCardComponent {
  private readonly sonner = inject(ZardSonnerService);

  readonly items = [
    {
      choices: [{ value: 'fix' }, { value: 'refactor' }, { value: 'docs' }],
      name: 'task',
      required: true,
    },
    {
      choices: [{ value: 'summary' }, { value: 'files' }, { value: 'review' }],
      name: 'output',
      required: true,
    },
  ] as const satisfies readonly ZardQuestionnaireItem[];

  createTask(answers: ZardQuestionnaireAnswers): void {
    this.sonner.show('Agent task created', {
      description: `Task: ${answers['task'] ?? 'None'} · Handoff: ${answers['output'] ?? 'None'}`,
    });
  }
}
