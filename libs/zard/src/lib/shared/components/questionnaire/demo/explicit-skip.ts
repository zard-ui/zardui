import { ChangeDetectionStrategy, Component, inject } from '@angular/core';

import { ZardSonnerService } from '@/shared/components/sonner/sonner.service';

import { ZardQuestionnaireImports } from '../questionnaire.imports';
import type { ZardQuestionnaireAnswer, ZardQuestionnaireAnswers, ZardQuestionnaireItem } from '../questionnaire.types';

const TASK_LABELS: Record<string, string> = {
  feature: 'new feature',
  bug: 'bug fix',
  refactor: 'refactor',
};

const CONSTRAINTS_LABELS: Record<string, string> = {
  'no-dependencies': 'do not add dependencies',
  'no-migrations': 'do not change the database',
  'preserve-api': 'preserve the public API',
};

const REVIEW_LABELS: Record<string, string> = {
  tests: 'run the test suite',
  diff: 'review the final diff',
  both: 'tests and diff review',
};

@Component({
  selector: 'z-demo-questionnaire-explicit-skip',
  imports: [ZardQuestionnaireImports],
  template: `
    <z-questionnaire [zItems]="items" zShortcuts="letters" (zSubmit)="save($event)">
      <z-questionnaire-progress />

      <z-questionnaire-item zName="task" zRequired>
        <z-questionnaire-title>What kind of change is this?</z-questionnaire-title>
        <z-questionnaire-description>Choose the category that best describes the work.</z-questionnaire-description>
        <z-questionnaire-choices>
          <z-questionnaire-choice zValue="feature">New feature</z-questionnaire-choice>
          <z-questionnaire-choice zValue="bug">Bug fix</z-questionnaire-choice>
          <z-questionnaire-choice zValue="refactor">Refactor</z-questionnaire-choice>
        </z-questionnaire-choices>
        <z-questionnaire-error />
      </z-questionnaire-item>

      <z-questionnaire-item zName="constraints">
        <z-questionnaire-title>Are there any implementation constraints?</z-questionnaire-title>
        <z-questionnaire-description>
          Answer if needed, or intentionally skip this question.
        </z-questionnaire-description>
        <z-questionnaire-choices>
          <z-questionnaire-choice zValue="no-dependencies">Do not add dependencies</z-questionnaire-choice>
          <z-questionnaire-choice zValue="no-migrations">Do not change the database</z-questionnaire-choice>
          <z-questionnaire-choice zValue="preserve-api">Preserve the public API</z-questionnaire-choice>
          <z-questionnaire-input
            placeholder="Describe another constraint..."
            aria-label="Another implementation constraint"
          />
        </z-questionnaire-choices>
        <z-questionnaire-error />
      </z-questionnaire-item>

      <z-questionnaire-item zName="review" zRequired>
        <z-questionnaire-title>How should the work be reviewed?</z-questionnaire-title>
        <z-questionnaire-description>
          Choose the checks the agent should complete before handoff.
        </z-questionnaire-description>
        <z-questionnaire-choices>
          <z-questionnaire-choice zValue="tests">Run the test suite</z-questionnaire-choice>
          <z-questionnaire-choice zValue="diff">Review the final diff</z-questionnaire-choice>
          <z-questionnaire-choice zValue="both">Tests and diff review</z-questionnaire-choice>
        </z-questionnaire-choices>
        <z-questionnaire-error />
      </z-questionnaire-item>

      <z-questionnaire-actions>
        <button type="button" z-questionnaire-previous>Back</button>
        <button type="button" z-questionnaire-skip>Skip</button>
        <button type="button" z-questionnaire-next>Next</button>
        <button type="submit" z-questionnaire-submit>Submit brief</button>
      </z-questionnaire-actions>
    </z-questionnaire>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'block w-full' },
})
export class ZardDemoQuestionnaireExplicitSkipComponent {
  private readonly sonner = inject(ZardSonnerService);

  readonly items: ZardQuestionnaireItem[] = [
    { name: 'task', required: true },
    { name: 'constraints', required: false },
    { name: 'review', required: true },
  ];

  save(answers: ZardQuestionnaireAnswers): void {
    this.sonner.show('Agent brief submitted', {
      description: [
        `Task: ${this.formatTask(answers['task'])}`,
        `Constraints: ${this.formatConstraints(answers['constraints'])}`,
        `Review: ${this.formatReview(answers['review'])}`,
      ].join(' · '),
    });
  }

  private formatTask(answer: ZardQuestionnaireAnswer | undefined): string {
    const value = this.singleValue(answer);
    return value ? (TASK_LABELS[value] ?? value) : 'None';
  }

  private formatConstraints(answer: ZardQuestionnaireAnswer | undefined): string {
    const values = Array.isArray(answer) ? answer : answer ? [answer] : [];
    return values.length ? values.map(value => CONSTRAINTS_LABELS[value] ?? value).join(', ') : 'Skipped';
  }

  private formatReview(answer: ZardQuestionnaireAnswer | undefined): string {
    const value = this.singleValue(answer);
    return value ? (REVIEW_LABELS[value] ?? value) : 'None';
  }

  private singleValue(answer: ZardQuestionnaireAnswer | undefined): string | undefined {
    return Array.isArray(answer) ? answer[0] : answer;
  }
}
