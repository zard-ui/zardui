import { ChangeDetectionStrategy, Component, inject } from '@angular/core';

import { ZardSonnerService } from '@/shared/components/sonner/sonner.service';

import { ZardQuestionnaireImports } from '../questionnaire.imports';
import type { ZardQuestionnaireAnswers, ZardQuestionnaireItem } from '../questionnaire.types';

const ITEM_CLASS_NAME =
  'data-active:animate-in data-active:fade-in-0 data-active:slide-in-from-bottom-2 data-active:duration-300 motion-reduce:animate-none';

@Component({
  selector: 'z-demo-questionnaire-animated-items',
  imports: [ZardQuestionnaireImports],
  template: `
    <z-questionnaire class="mx-auto max-w-md" [zItems]="items" zActive="task" (zSubmit)="saveWorkflow($event)">
      <z-questionnaire-progress />

      <z-questionnaire-item [class]="itemClassName" zName="task" zRequired>
        <z-questionnaire-title>What should the agent do?</z-questionnaire-title>
        <z-questionnaire-description>Choose the task for this run.</z-questionnaire-description>
        <z-questionnaire-choices>
          <z-questionnaire-choice zValue="implement">Implement the requested change</z-questionnaire-choice>
          <z-questionnaire-choice zValue="debug">Debug the current behavior</z-questionnaire-choice>
          <z-questionnaire-choice zValue="review">Review the implementation</z-questionnaire-choice>
        </z-questionnaire-choices>
        <z-questionnaire-error />
      </z-questionnaire-item>

      <z-questionnaire-item [class]="itemClassName" zName="review" zRequired>
        <z-questionnaire-title>How should the work be reviewed?</z-questionnaire-title>
        <z-questionnaire-description>Select the verification depth.</z-questionnaire-description>
        <z-questionnaire-choices>
          <z-questionnaire-choice zValue="targeted">Targeted checks</z-questionnaire-choice>
          <z-questionnaire-choice zValue="complete">Complete test suite</z-questionnaire-choice>
          <z-questionnaire-choice zValue="manual">Tests and manual QA</z-questionnaire-choice>
        </z-questionnaire-choices>
        <z-questionnaire-error />
      </z-questionnaire-item>

      <z-questionnaire-item [class]="itemClassName" zName="delivery" zRequired>
        <z-questionnaire-title>How should the result be delivered?</z-questionnaire-title>
        <z-questionnaire-description>Choose the final handoff format.</z-questionnaire-description>
        <z-questionnaire-choices>
          <z-questionnaire-choice zValue="summary">Concise summary</z-questionnaire-choice>
          <z-questionnaire-choice zValue="diff">Summary and changed files</z-questionnaire-choice>
          <z-questionnaire-choice zValue="handoff">Detailed review handoff</z-questionnaire-choice>
        </z-questionnaire-choices>
        <z-questionnaire-error />
      </z-questionnaire-item>

      <z-questionnaire-actions>
        <button type="button" z-questionnaire-previous>Previous</button>
        <button type="button" z-questionnaire-next>Next</button>
        <button type="submit" z-questionnaire-submit>Save workflow</button>
      </z-questionnaire-actions>
    </z-questionnaire>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'block w-full' },
})
export class ZardDemoQuestionnaireAnimatedItemsComponent {
  private readonly sonner = inject(ZardSonnerService);

  readonly itemClassName = ITEM_CLASS_NAME;
  readonly items: ZardQuestionnaireItem[] = [
    { name: 'task', required: true },
    { name: 'review', required: true },
    { name: 'delivery', required: true },
  ];

  saveWorkflow(answers: ZardQuestionnaireAnswers): void {
    this.sonner.show('Agent workflow saved', {
      description: `Task: ${answers['task'] ?? 'None'} · Review: ${answers['review'] ?? 'None'} · Delivery: ${answers['delivery'] ?? 'None'}`,
    });
  }
}
