import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';

import { ZardButtonComponent } from '@/shared/components/button/button.component';
import { ZardDialogImports } from '@/shared/components/dialog/dialog.imports';
import { ZardSonnerService } from '@/shared/components/sonner/sonner.service';

import { ZardQuestionnaireImports } from '../questionnaire.imports';
import type { ZardQuestionnaireAnswers, ZardQuestionnaireItem } from '../questionnaire.types';

@Component({
  selector: 'z-demo-questionnaire-dialog',
  imports: [ZardButtonComponent, ZardDialogImports, ZardQuestionnaireImports],
  template: `
    <button type="button" z-button zType="outline" (click)="open.set(true)">Open clarification</button>

    <z-dialog [(zVisible)]="open">
      <z-dialog-title class="sr-only">Clarification questionnaire</z-dialog-title>
      <z-dialog-description class="sr-only">
        Answer two questions about the requested scope and verification.
      </z-dialog-description>

      <z-questionnaire [zItems]="items" zActive="scope" (zSubmit)="sendClarification($event)">
        <z-questionnaire-item zName="scope" zRequired>
          <z-dialog-header>
            <z-questionnaire-progress />
            <z-questionnaire-title>Which files are in scope?</z-questionnaire-title>
            <z-questionnaire-description>
              Choose how broadly the agent can update the workspace.
            </z-questionnaire-description>
          </z-dialog-header>
          <z-questionnaire-choices>
            <z-questionnaire-choice zValue="component">Component only</z-questionnaire-choice>
            <z-questionnaire-choice zValue="feature">Complete feature directory</z-questionnaire-choice>
            <z-questionnaire-choice zValue="workspace">Any related workspace file</z-questionnaire-choice>
          </z-questionnaire-choices>
          <z-questionnaire-error />
        </z-questionnaire-item>

        <z-questionnaire-item zName="tests" zRequired>
          <z-dialog-header>
            <z-questionnaire-progress />
            <z-questionnaire-title>How much verification is needed?</z-questionnaire-title>
            <z-questionnaire-description>
              Choose the checks the agent should run before handoff.
            </z-questionnaire-description>
          </z-dialog-header>
          <z-questionnaire-choices>
            <z-questionnaire-choice zValue="targeted">Targeted tests</z-questionnaire-choice>
            <z-questionnaire-choice zValue="package">Package tests</z-questionnaire-choice>
            <z-questionnaire-choice zValue="full">Full workspace verification</z-questionnaire-choice>
          </z-questionnaire-choices>
          <z-questionnaire-error />
        </z-questionnaire-item>

        <z-dialog-footer>
          <button type="button" z-button zType="outline" z-dialog-close>Cancel</button>
          <z-questionnaire-actions>
            <button type="button" z-questionnaire-previous>Previous</button>
            <button type="button" z-questionnaire-next>Next</button>
            <button type="submit" z-questionnaire-submit>Send answer</button>
          </z-questionnaire-actions>
        </z-dialog-footer>
      </z-questionnaire>
    </z-dialog>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ZardDemoQuestionnaireDialogComponent {
  private readonly sonner = inject(ZardSonnerService);

  readonly open = signal(false);
  readonly items = [
    {
      choices: [{ value: 'component' }, { value: 'feature' }, { value: 'workspace' }],
      name: 'scope',
      required: true,
    },
    {
      choices: [{ value: 'targeted' }, { value: 'package' }, { value: 'full' }],
      name: 'tests',
      required: true,
    },
  ] as const satisfies readonly ZardQuestionnaireItem[];

  sendClarification(answers: ZardQuestionnaireAnswers): void {
    this.open.set(false);
    this.sonner.show('Clarification sent', {
      description: `Scope: ${answers['scope'] ?? 'None'} · Verification: ${answers['tests'] ?? 'None'}`,
    });
  }
}
