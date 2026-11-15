import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';

import { ZardSonnerService } from '@/shared/components/sonner/sonner.service';

import { ZardQuestionnaireImports } from '../questionnaire.imports';
import type { ZardQuestionnaireAnswer, ZardQuestionnaireAnswers, ZardQuestionnaireItem } from '../questionnaire.types';

type Runtime = 'local' | 'cloud';

@Component({
  selector: 'z-demo-questionnaire-conditional-items',
  imports: [ZardQuestionnaireImports],
  template: `
    <z-questionnaire [zItems]="items()" (zSubmit)="saveExecutionPlan($event)">
      <z-questionnaire-progress />

      <z-questionnaire-item zName="runtime" zRequired>
        <z-questionnaire-title>Where should the agent run?</z-questionnaire-title>
        <z-questionnaire-description>Cloud runs add an environment question to this flow.</z-questionnaire-description>
        <z-questionnaire-choices>
          <z-questionnaire-choice zValue="local" [checked]="runtime() === 'local'" (change)="runtime.set('local')">
            Local workspace
          </z-questionnaire-choice>
          <z-questionnaire-choice zValue="cloud" [checked]="runtime() === 'cloud'" (change)="runtime.set('cloud')">
            Cloud workspace
          </z-questionnaire-choice>
        </z-questionnaire-choices>
        <z-questionnaire-error />
      </z-questionnaire-item>

      <z-questionnaire-item zName="environment" [zDisabled]="runtime() !== 'cloud'" zRequired>
        <z-questionnaire-title>Which cloud environment should it use?</z-questionnaire-title>
        <z-questionnaire-choices>
          <z-questionnaire-choice zValue="preview">Preview</z-questionnaire-choice>
          <z-questionnaire-choice zValue="staging">Staging</z-questionnaire-choice>
          <z-questionnaire-choice zValue="isolated">Isolated sandbox</z-questionnaire-choice>
        </z-questionnaire-choices>
        <z-questionnaire-error />
      </z-questionnaire-item>

      <z-questionnaire-item zName="approval" zRequired>
        <z-questionnaire-title>When should the agent request approval?</z-questionnaire-title>
        <z-questionnaire-choices>
          <z-questionnaire-choice zValue="writes">Before writing files</z-questionnaire-choice>
          <z-questionnaire-choice zValue="commands">Before running commands</z-questionnaire-choice>
          <z-questionnaire-choice zValue="sensitive">Only for sensitive actions</z-questionnaire-choice>
        </z-questionnaire-choices>
        <z-questionnaire-error />
      </z-questionnaire-item>

      <z-questionnaire-actions>
        <button type="button" z-questionnaire-previous>Previous</button>
        <button type="button" z-questionnaire-next>Next</button>
        <button type="submit" z-questionnaire-submit>Save execution plan</button>
      </z-questionnaire-actions>
    </z-questionnaire>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'block w-full' },
})
export class ZardDemoQuestionnaireConditionalItemsComponent {
  private readonly sonner = inject(ZardSonnerService);

  readonly runtime = signal<Runtime>('local');
  readonly items = computed<readonly ZardQuestionnaireItem[]>(() => [
    { name: 'runtime', required: true },
    { name: 'environment', required: true, disabled: this.runtime() !== 'cloud' },
    { name: 'approval', required: true },
  ]);

  saveExecutionPlan(answers: ZardQuestionnaireAnswers): void {
    this.sonner.show('Execution plan saved', {
      description: [
        `Runtime: ${this.singleValue(answers['runtime']) ?? 'None'}`,
        `Environment: ${this.singleValue(answers['environment']) ?? 'Not applicable'}`,
        `Approval: ${this.singleValue(answers['approval']) ?? 'None'}`,
      ].join(' · '),
    });
  }

  private singleValue(answer: ZardQuestionnaireAnswer | undefined): string | undefined {
    return Array.isArray(answer) ? answer[0] : answer;
  }
}
