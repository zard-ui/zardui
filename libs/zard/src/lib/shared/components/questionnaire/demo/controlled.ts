import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';

import { ZardSonnerService } from '@/shared/components/sonner/sonner.service';

import { ZardQuestionnaireImports } from '../questionnaire.imports';
import type { ZardQuestionnaireAnswers, ZardQuestionnaireItem } from '../questionnaire.types';

type QuestionnaireItemName = 'scope' | 'checks' | 'output';

const ITEM_LABELS: Record<QuestionnaireItemName, string> = {
  scope: 'Change scope',
  checks: 'Verification level',
  output: 'Output format',
};

@Component({
  selector: 'z-demo-questionnaire-controlled',
  imports: [ZardQuestionnaireImports],
  template: `
    <div class="relative mx-auto flex size-full max-w-md flex-col">
      <p class="text-muted-foreground absolute inset-e-0 top-0 text-sm" role="status">
        Current checkpoint: {{ activeItemLabel() }}
      </p>

      <z-questionnaire class="mt-auto" [zItems]="items" [(zActive)]="activeItem" (zSubmit)="saveWorkflow($event)">
        <z-questionnaire-progress />

        <z-questionnaire-item zName="scope" zRequired>
          <z-questionnaire-title>What may the agent change?</z-questionnaire-title>
          <z-questionnaire-description>
            The host stores the active checkpoint while Questionnaire navigates.
          </z-questionnaire-description>
          <z-questionnaire-choices>
            <z-questionnaire-choice zValue="component">Only the target component</z-questionnaire-choice>
            <z-questionnaire-choice zValue="tests">Component and related tests</z-questionnaire-choice>
            <z-questionnaire-choice zValue="feature">The complete feature area</z-questionnaire-choice>
          </z-questionnaire-choices>
          <z-questionnaire-error />
        </z-questionnaire-item>

        <z-questionnaire-item zName="checks" zRequired>
          <z-questionnaire-title>Which verification level should it use?</z-questionnaire-title>
          <z-questionnaire-choices>
            <z-questionnaire-choice zValue="targeted">Targeted tests</z-questionnaire-choice>
            <z-questionnaire-choice zValue="package">Package tests and typecheck</z-questionnaire-choice>
            <z-questionnaire-choice zValue="full">Full workspace verification</z-questionnaire-choice>
          </z-questionnaire-choices>
          <z-questionnaire-error />
        </z-questionnaire-item>

        <z-questionnaire-item zName="output" zRequired>
          <z-questionnaire-title>What should the agent return when finished?</z-questionnaire-title>
          <z-questionnaire-choices>
            <z-questionnaire-choice zValue="summary">Concise summary</z-questionnaire-choice>
            <z-questionnaire-choice zValue="diff">Summary with changed files</z-questionnaire-choice>
            <z-questionnaire-choice zValue="handoff">Detailed implementation handoff</z-questionnaire-choice>
          </z-questionnaire-choices>
          <z-questionnaire-error />
        </z-questionnaire-item>

        <z-questionnaire-actions>
          <button type="button" z-questionnaire-previous>Previous</button>
          <button type="button" z-questionnaire-next>Next</button>
          <button type="submit" z-questionnaire-submit>Save workflow</button>
        </z-questionnaire-actions>
      </z-questionnaire>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'block h-full w-full' },
})
export class ZardDemoQuestionnaireControlledComponent {
  private readonly sonner = inject(ZardSonnerService);

  readonly items: ZardQuestionnaireItem[] = [
    { name: 'scope', required: true },
    { name: 'checks', required: true },
    { name: 'output', required: true },
  ];

  readonly activeItem = signal<QuestionnaireItemName>('scope');
  readonly activeItemLabel = computed(() => ITEM_LABELS[this.activeItem()]);

  saveWorkflow(answers: ZardQuestionnaireAnswers): void {
    this.sonner.show('Workflow saved', {
      description: `Scope: ${answers['scope']} · Verification: ${answers['checks']} · Output: ${answers['output']}`,
    });
  }
}
