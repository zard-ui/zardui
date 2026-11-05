import { ChangeDetectionStrategy, Component, inject } from '@angular/core';

import { ZardSonnerService } from '@/shared/components/sonner/sonner.service';

import { ZardQuestionnaireImports } from '../questionnaire.imports';
import type { ZardQuestionnaireAnswers, ZardQuestionnaireItem } from '../questionnaire.types';

@Component({
  selector: 'z-demo-questionnaire-custom-progress',
  imports: [ZardQuestionnaireImports],
  template: `
    <z-questionnaire class="mx-auto max-w-md" [zItems]="items" zActive="scope" (zSubmit)="savePlan($event)">
      <z-questionnaire-progress #progress="zQuestionnaireProgress" class="w-full">
        <div class="mb-2 flex gap-1.5" aria-hidden="true">
          @for (item of items; track item.name; let index = $index) {
            <span
              class="h-1.5 flex-1 rounded-full"
              [class.bg-primary]="index < progress.current()"
              [class.bg-muted]="index >= progress.current()"
            ></span>
          }
        </div>
        <span>Checkpoint {{ progress.current() }} of {{ progress.total() }}</span>
      </z-questionnaire-progress>

      <z-questionnaire-item zName="scope" zRequired>
        <z-questionnaire-title>How large is the change?</z-questionnaire-title>
        <z-questionnaire-choices>
          <z-questionnaire-choice zValue="small">Small patch</z-questionnaire-choice>
          <z-questionnaire-choice zValue="medium">Feature-sized change</z-questionnaire-choice>
          <z-questionnaire-choice zValue="large">Cross-package change</z-questionnaire-choice>
        </z-questionnaire-choices>
        <z-questionnaire-error />
      </z-questionnaire-item>

      <z-questionnaire-item zName="strategy" zRequired>
        <z-questionnaire-title>How should commits be organized?</z-questionnaire-title>
        <z-questionnaire-choices>
          <z-questionnaire-choice zValue="single">Single commit</z-questionnaire-choice>
          <z-questionnaire-choice zValue="logical">Logical commits</z-questionnaire-choice>
          <z-questionnaire-choice zValue="squash">Squash before review</z-questionnaire-choice>
        </z-questionnaire-choices>
        <z-questionnaire-error />
      </z-questionnaire-item>

      <z-questionnaire-item zName="tests" zRequired>
        <z-questionnaire-title>Which tests should run?</z-questionnaire-title>
        <z-questionnaire-choices>
          <z-questionnaire-choice zValue="targeted">Targeted tests</z-questionnaire-choice>
          <z-questionnaire-choice zValue="package">Package suite</z-questionnaire-choice>
          <z-questionnaire-choice zValue="workspace">Full workspace</z-questionnaire-choice>
        </z-questionnaire-choices>
        <z-questionnaire-error />
      </z-questionnaire-item>

      <z-questionnaire-item zName="delivery" zRequired>
        <z-questionnaire-title>How should the work be delivered?</z-questionnaire-title>
        <z-questionnaire-choices>
          <z-questionnaire-choice zValue="patch">Patch only</z-questionnaire-choice>
          <z-questionnaire-choice zValue="commit">Committed locally</z-questionnaire-choice>
          <z-questionnaire-choice zValue="branch">Push a review branch</z-questionnaire-choice>
        </z-questionnaire-choices>
        <z-questionnaire-error />
      </z-questionnaire-item>

      <z-questionnaire-actions>
        <button type="button" z-questionnaire-previous>Previous</button>
        <button type="button" z-questionnaire-next>Next</button>
        <button type="submit" z-questionnaire-submit>Finish plan</button>
      </z-questionnaire-actions>
    </z-questionnaire>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'block w-full' },
})
export class ZardDemoQuestionnaireCustomProgressComponent {
  private readonly sonner = inject(ZardSonnerService);

  readonly items: ZardQuestionnaireItem[] = [
    { name: 'scope', required: true },
    { name: 'strategy', required: true },
    { name: 'tests', required: true },
    { name: 'delivery', required: true },
  ];

  savePlan(answers: ZardQuestionnaireAnswers): void {
    this.sonner.show('Pull request plan ready', {
      description: `Scope: ${answers['scope'] ?? 'None'} · Commits: ${answers['strategy'] ?? 'None'} · Tests: ${answers['tests'] ?? 'None'} · Delivery: ${answers['delivery'] ?? 'None'}`,
    });
  }
}
