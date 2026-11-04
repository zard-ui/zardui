import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';

import { ZardButtonComponent } from '@/shared/components/button/button.component';
import { ZardSonnerService } from '@/shared/components/sonner/sonner.service';

import { ZardQuestionnaireImports } from '../questionnaire.imports';
import type { ZardQuestionnaireAnswer, ZardQuestionnaireAnswers, ZardQuestionnaireItem } from '../questionnaire.types';

@Component({
  selector: 'z-demo-questionnaire-resume',
  imports: [ZardQuestionnaireImports, ZardButtonComponent],
  template: `
    <z-questionnaire [zItems]="items" [(zActive)]="activeItem" (reset)="restoreDraft()" (zSubmit)="updateDraft($event)">
      <z-questionnaire-progress />

      <z-questionnaire-item zName="change" zRequired>
        <z-questionnaire-title>What kind of migration is this?</z-questionnaire-title>
        <z-questionnaire-description>This answer was saved during the previous session.</z-questionnaire-description>
        <z-questionnaire-choices>
          <z-questionnaire-choice zValue="incremental" checked>Incremental migration</z-questionnaire-choice>
          <z-questionnaire-choice zValue="cutover">Single cutover</z-questionnaire-choice>
        </z-questionnaire-choices>
        <z-questionnaire-error />
      </z-questionnaire-item>

      <z-questionnaire-item zName="verification" zMultiple zRequired>
        <z-questionnaire-title>How should the migration be verified?</z-questionnaire-title>
        <z-questionnaire-description>
          These checks were selected during the previous session.
        </z-questionnaire-description>
        <z-questionnaire-choices>
          <z-questionnaire-choice zValue="tests" checked>Run migration tests</z-questionnaire-choice>
          <z-questionnaire-choice zValue="typecheck" checked>Run the typecheck</z-questionnaire-choice>
          <z-questionnaire-choice zValue="manual">Perform a manual smoke test</z-questionnaire-choice>
        </z-questionnaire-choices>
        <z-questionnaire-error />
      </z-questionnaire-item>

      <z-questionnaire-item zName="notes">
        <z-questionnaire-title>Anything else the agent should remember?</z-questionnaire-title>
        <z-questionnaire-description>This note was saved with the draft.</z-questionnaire-description>
        <z-questionnaire-input aria-label="Saved migration note" value="Keep the existing public API stable." />
      </z-questionnaire-item>

      <z-questionnaire-actions class="grid-cols-[auto_minmax(0,1fr)_auto]">
        <button type="button" z-questionnaire-previous>Previous</button>
        <button type="reset" z-button zType="outline" class="justify-self-start">Reset changes</button>
        <button type="button" z-questionnaire-next>Next</button>
        <button type="submit" z-questionnaire-submit>Update draft</button>
      </z-questionnaire-actions>
    </z-questionnaire>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'block w-full' },
})
export class ZardDemoQuestionnaireResumeComponent {
  private readonly sonner = inject(ZardSonnerService);

  readonly items: ZardQuestionnaireItem[] = [
    { name: 'change', required: true },
    { name: 'verification', multiple: true, required: true },
    { name: 'notes' },
  ];

  readonly activeItem = signal('verification');

  restoreDraft(): void {
    this.activeItem.set('verification');
    this.sonner.show('Saved answers restored');
  }

  updateDraft(answers: ZardQuestionnaireAnswers): void {
    this.sonner.show('Draft updated', {
      description: [
        `Migration: ${this.singleValue(answers['change']) ?? 'None'}`,
        `Verification: ${this.values(answers['verification']).join(', ') || 'None'}`,
        `Notes: ${this.singleValue(answers['notes']) || 'None'}`,
      ].join(' · '),
    });
  }

  private values(answer: ZardQuestionnaireAnswer | undefined): string[] {
    return Array.isArray(answer) ? answer : answer ? [answer] : [];
  }

  private singleValue(answer: ZardQuestionnaireAnswer | undefined): string | undefined {
    return this.values(answer)[0];
  }
}
