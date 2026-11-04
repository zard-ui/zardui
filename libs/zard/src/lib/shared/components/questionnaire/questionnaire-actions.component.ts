import { ChangeDetectionStrategy, Component, computed, input, ViewEncapsulation } from '@angular/core';

import type { ClassValue } from 'clsx';

import { mergeClasses } from '@/shared/utils/merge-classes';

import { questionnaireActionsVariants } from './questionnaire.variants';

@Component({
  selector: 'z-questionnaire-actions',
  template: '<ng-content />',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: {
    'data-slot': 'questionnaire-actions',
    '[class]': 'classes()',
  },
  exportAs: 'zQuestionnaireActions',
})
export class ZardQuestionnaireActionsComponent {
  readonly class = input<ClassValue>('');
  protected readonly classes = computed(() => mergeClasses(questionnaireActionsVariants(), this.class()));
}
