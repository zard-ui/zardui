import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';

import { ZardSonnerService } from '@/shared/components/sonner/sonner.service';

import { ZardQuestionnaireImports } from '../questionnaire.imports';
import type { ZardQuestionnaireAnswers, ZardQuestionnaireItem } from '../questionnaire.types';

type QuestionnaireItemName = 'permission' | 'verification';
type QuestionnaireItemStatus = 'answered' | 'unanswered';

@Component({
  selector: 'z-demo-questionnaire-navigation-state',
  imports: [ZardQuestionnaireImports],
  template: `
    <z-questionnaire
      class="mx-auto max-w-md"
      [zItems]="items"
      [(zActive)]="activeItem"
      (zSubmit)="savePermissions($event)"
    >
      <z-questionnaire-progress />

      <z-questionnaire-item zName="permission" zRequired>
        <z-questionnaire-title>What may the agent modify?</z-questionnaire-title>
        <z-questionnaire-description>
          Next is intentionally disabled until an answer is selected.
        </z-questionnaire-description>
        <z-questionnaire-choices>
          <z-questionnaire-choice zValue="files" (change)="setStatus('permission', 'answered')">
            Project files
          </z-questionnaire-choice>
          <z-questionnaire-choice zValue="tests" (change)="setStatus('permission', 'answered')">
            Project files and tests
          </z-questionnaire-choice>
          <z-questionnaire-choice zValue="config" (change)="setStatus('permission', 'answered')">
            Files, tests, and configuration
          </z-questionnaire-choice>
        </z-questionnaire-choices>
        <z-questionnaire-error />
      </z-questionnaire-item>

      <z-questionnaire-item zName="verification" zRequired>
        <z-questionnaire-title>What must pass before completion?</z-questionnaire-title>
        <z-questionnaire-choices>
          <z-questionnaire-choice zValue="tests" (change)="setStatus('verification', 'answered')">
            Tests
          </z-questionnaire-choice>
          <z-questionnaire-choice zValue="types" (change)="setStatus('verification', 'answered')">
            Tests and types
          </z-questionnaire-choice>
          <z-questionnaire-choice zValue="all" (change)="setStatus('verification', 'answered')">
            Tests, types, and visual QA
          </z-questionnaire-choice>
        </z-questionnaire-choices>
        <z-questionnaire-error />
      </z-questionnaire-item>

      <z-questionnaire-actions>
        <button type="button" z-questionnaire-previous>Previous</button>
        <button
          type="button"
          z-questionnaire-next
          zType="secondary"
          class="data-[status=unanswered]:opacity-50"
          [attr.data-status]="activeStatus()"
          [disabled]="unanswered()"
        >
          Next
        </button>
        <button type="submit" z-questionnaire-submit [disabled]="unanswered()">Save permissions</button>
      </z-questionnaire-actions>
    </z-questionnaire>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'block w-full' },
})
export class ZardDemoQuestionnaireNavigationStateComponent {
  private readonly sonner = inject(ZardSonnerService);

  readonly items: ZardQuestionnaireItem[] = [
    { name: 'permission', required: true },
    { name: 'verification', required: true },
  ];

  readonly activeItem = signal<QuestionnaireItemName>('permission');
  readonly statuses = signal<Record<QuestionnaireItemName, QuestionnaireItemStatus>>({
    permission: 'unanswered',
    verification: 'unanswered',
  });

  readonly activeStatus = computed(() => this.statuses()[this.activeItem()]);
  readonly unanswered = computed(() => this.activeStatus() === 'unanswered');

  setStatus(name: QuestionnaireItemName, status: QuestionnaireItemStatus): void {
    this.statuses.update(current => ({ ...current, [name]: status }));
  }

  savePermissions(answers: ZardQuestionnaireAnswers): void {
    this.sonner.show('Permissions saved', {
      description: `Permission: ${answers['permission'] ?? 'None'} · Verification: ${answers['verification'] ?? 'None'}`,
    });
  }
}
