import { ChangeDetectionStrategy, Component, inject } from '@angular/core';

import { ZardSonnerService } from '@/shared/components/sonner/sonner.service';

import { ZardQuestionnaireImports } from '../questionnaire.imports';
import type { ZardQuestionnaireAnswers, ZardQuestionnaireItem } from '../questionnaire.types';

@Component({
  selector: 'z-demo-questionnaire-freeform-answer',
  imports: [ZardQuestionnaireImports],
  template: `
    <z-questionnaire [zItems]="items" (zSubmit)="save($event)">
      <z-questionnaire-item zName="approach" [zRequired]="true">
        <z-questionnaire-title>How should the agent approach this refactor?</z-questionnaire-title>
        <z-questionnaire-description>
          Choose a strategy or write a more specific instruction.
        </z-questionnaire-description>

        <z-questionnaire-choices>
          <z-questionnaire-choice zValue="incremental">Make smallest safe change</z-questionnaire-choice>
          <z-questionnaire-choice zValue="module">Refactor one module at a time</z-questionnaire-choice>
          <z-questionnaire-choice zValue="rewrite">Replace the implementation completely</z-questionnaire-choice>
          <z-questionnaire-input placeholder="Describe another approach..." aria-label="Describe another approach" />
        </z-questionnaire-choices>

        <z-questionnaire-error />
      </z-questionnaire-item>

      <z-questionnaire-actions>
        <button type="submit" z-questionnaire-submit>Use this approach</button>
      </z-questionnaire-actions>
    </z-questionnaire>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ZardDemoQuestionnaireFreeformAnswerComponent {
  private readonly sonner = inject(ZardSonnerService);
  readonly items: ZardQuestionnaireItem[] = [{ name: 'approach', required: true }];

  save(answers: ZardQuestionnaireAnswers): void {
    const context = answers['approach'];

    this.sonner.show('Approach selected', {
      description: `Context: ${Array.isArray(context) ? context.join(', ') : context}`,
    });
  }
}
