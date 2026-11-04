import { ChangeDetectionStrategy, Component, inject } from '@angular/core';

import { ZardSonnerService } from '@/shared/components/sonner/sonner.service';

import { ZardQuestionnaireImports } from '../questionnaire.imports';
import type { ZardQuestionnaireAnswers, ZardQuestionnaireItem } from '../questionnaire.types';

@Component({
  selector: 'z-demo-questionnaire-multiple-selection',
  imports: [ZardQuestionnaireImports],
  template: `
    <z-questionnaire [zItems]="items" zShortcuts="letters" (zSubmit)="save($event)">
      <z-questionnaire-item zName="stack" zRequired zMultiple>
        <z-questionnaire-title>What context should the agent inspect?</z-questionnaire-title>
        <z-questionnaire-choices>
          <z-questionnaire-choice zValue="source">Relevant source files</z-questionnaire-choice>
          <z-questionnaire-choice zValue="tests">Existing tests</z-questionnaire-choice>
          <z-questionnaire-choice zValue="docs">Architecture documentation</z-questionnaire-choice>
          <z-questionnaire-choice zValue="history">Recent commit history</z-questionnaire-choice>
        </z-questionnaire-choices>
        <z-questionnaire-error />
      </z-questionnaire-item>

      <z-questionnaire-actions>
        <button type="submit" z-questionnaire-submit>Share context</button>
      </z-questionnaire-actions>
    </z-questionnaire>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'block w-full' },
})
export class ZardDemoQuestionnaireMultipleSelectionComponent {
  private readonly sonner = inject(ZardSonnerService);

  readonly items: ZardQuestionnaireItem[] = [{ name: 'stack', required: true, multiple: true }];

  save(answers: ZardQuestionnaireAnswers): void {
    const context = answers['stack'];

    this.sonner.show('Context selected', {
      description: `Context: ${Array.isArray(context) ? context.join(', ') : context}`,
    });
  }
}
