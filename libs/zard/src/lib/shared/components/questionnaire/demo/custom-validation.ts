import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';

import { z } from 'zod';

import { ZardCardImports } from '@/shared/components/card/card.imports';
import { ZardSonnerService } from '@/shared/components/sonner/sonner.service';

import { ZardQuestionnaireImports } from '../questionnaire.imports';
import type { ZardQuestionnaireAnswers, ZardQuestionnaireItem } from '../questionnaire.types';

const questionnaireSchema = z
  .object({
    detail: z.enum(['summary', 'complete']),
    audience: z.enum(['team', 'public']),
  })
  .superRefine((answers, context) => {
    if (answers.audience === 'public' && answers.detail === 'summary') {
      context.addIssue({
        code: 'custom',
        message: 'Public answers need enough context. Choose a complete answer.',
        path: ['detail'],
      });
    }
  });

type QuestionnaireItemName = keyof z.infer<typeof questionnaireSchema>;
type QuestionnaireErrors = Partial<Record<QuestionnaireItemName, string>>;

@Component({
  selector: 'z-demo-questionnaire-custom-validation',
  imports: [ZardCardImports, ZardQuestionnaireImports],
  template: `
    <z-questionnaire class="mx-auto max-w-md" [zItems]="items" [(zActive)]="activeItem" (zSubmit)="validate($event)">
      <z-card class="w-full">
        <z-questionnaire-item zName="detail" zRequired [zInvalid]="hasError('detail')">
          <z-card-header>
            <z-questionnaire-title>How much detail should the answer include?</z-questionnaire-title>
            <z-questionnaire-description>Choose the response depth.</z-questionnaire-description>
            <z-card-action>
              <z-questionnaire-progress class="min-w-0" />
            </z-card-action>
          </z-card-header>
          <z-card-content>
            <z-questionnaire-choices>
              <z-questionnaire-choice zValue="summary" (change)="clearError('detail')">
                Concise summary
              </z-questionnaire-choice>
              <z-questionnaire-choice zValue="complete" (change)="clearError('detail')">
                Complete answer
              </z-questionnaire-choice>
            </z-questionnaire-choices>
            <z-questionnaire-error>{{ errorFor('detail') }}</z-questionnaire-error>
          </z-card-content>
        </z-questionnaire-item>

        <z-questionnaire-item zName="audience" zRequired [zInvalid]="hasError('audience')">
          <z-card-header>
            <z-questionnaire-title>Who will read the answer?</z-questionnaire-title>
            <z-questionnaire-description>Public answers require complete context.</z-questionnaire-description>
            <z-card-action>
              <z-questionnaire-progress class="min-w-0" />
            </z-card-action>
          </z-card-header>
          <z-card-content>
            <z-questionnaire-choices>
              <z-questionnaire-choice zValue="team" (change)="clearError('audience')">My team</z-questionnaire-choice>
              <z-questionnaire-choice zValue="public" (change)="clearError('audience')">
                Public audience
              </z-questionnaire-choice>
            </z-questionnaire-choices>
            <z-questionnaire-error>{{ errorFor('audience') }}</z-questionnaire-error>
          </z-card-content>
        </z-questionnaire-item>

        <z-card-footer>
          <z-questionnaire-actions>
            <button type="button" z-questionnaire-previous>Previous</button>
            <button type="button" z-questionnaire-next>Next</button>
            <button type="submit" z-questionnaire-submit>Validate answers</button>
          </z-questionnaire-actions>
        </z-card-footer>
      </z-card>
    </z-questionnaire>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'block w-full' },
})
export class ZardDemoQuestionnaireCustomValidationComponent {
  private readonly sonner = inject(ZardSonnerService);

  readonly items: ZardQuestionnaireItem[] = [
    { name: 'detail', required: true },
    { name: 'audience', required: true },
  ];

  readonly activeItem = signal<QuestionnaireItemName>('detail');
  readonly errors = signal<QuestionnaireErrors>({});

  hasError(name: QuestionnaireItemName): boolean {
    return Boolean(this.errors()[name]);
  }

  errorFor(name: QuestionnaireItemName): string {
    return this.errors()[name] ?? 'Choose an answer to continue.';
  }

  clearError(name: QuestionnaireItemName): void {
    this.errors.update(currentErrors => {
      if (!currentErrors[name]) {
        return currentErrors;
      }

      const nextErrors = { ...currentErrors };
      delete nextErrors[name];
      return nextErrors;
    });
  }

  validate(answers: ZardQuestionnaireAnswers): void {
    const result = questionnaireSchema.safeParse(answers);

    if (result.success) {
      this.errors.set({});
      this.sonner.show('Agent response configured', {
        description: `Detail: ${result.data.detail} · Audience: ${result.data.audience}`,
      });
      return;
    }

    const nextErrors: QuestionnaireErrors = {};

    for (const issue of result.error.issues) {
      const name = issue.path[0];
      if ((name === 'detail' || name === 'audience') && !nextErrors[name]) {
        nextErrors[name] = issue.message;
      }
    }

    this.errors.set(nextErrors);

    const firstInvalidItem = result.error.issues[0]?.path[0];
    if (firstInvalidItem === 'detail' || firstInvalidItem === 'audience') {
      this.activeItem.set(firstInvalidItem);
    }
  }
}
