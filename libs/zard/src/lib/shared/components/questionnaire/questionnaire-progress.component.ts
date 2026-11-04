import { ChangeDetectionStrategy, Component, computed, inject, input, ViewEncapsulation } from '@angular/core';

import type { ClassValue } from 'clsx';

import { mergeClasses } from '@/shared/utils/merge-classes';

import { ZardQuestionnaireComponent } from './questionnaire.component';
import { questionnaireProgressVariants } from './questionnaire.variants';

@Component({
  selector: 'z-questionnaire-progress',
  template: `
    <ng-content>Question {{ current() }} of {{ total() }}</ng-content>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: {
    role: 'progressbar',
    'aria-label': 'Questionnaire progress',
    '[attr.aria-valuemin]': 'total() === 0 ? 0 : 1',
    '[attr.aria-valuemax]': 'total()',
    '[attr.aria-valuenow]': 'current()',
    '[attr.aria-valuetext]': '"Question " + current() + " of " + total()',
    'data-slot': 'questionnaire-progress',
    '[class]': 'classes()',
  },
  exportAs: 'zQuestionnaireProgress',
})
export class ZardQuestionnaireProgressComponent {
  private readonly questionnaire = inject(ZardQuestionnaireComponent);

  readonly class = input<ClassValue>('');
  readonly current = computed(() =>
    this.questionnaire.enabledItems().length === 0 ? 0 : this.questionnaire.activeIndex() + 1,
  );

  readonly total = computed(() => this.questionnaire.enabledItems().length);

  protected readonly classes = computed(() => mergeClasses(questionnaireProgressVariants(), this.class()));
}
