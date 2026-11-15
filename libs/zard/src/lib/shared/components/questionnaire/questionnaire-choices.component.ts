import { ChangeDetectionStrategy, Component, computed, input, ViewEncapsulation } from '@angular/core';

import type { ClassValue } from 'clsx';

import { mergeClasses } from '@/shared/utils/merge-classes';

import { questionnaireChoicesVariants } from './questionnaire.variants';

@Component({
  selector: 'z-questionnaire-choices',
  template: '<ng-content />',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: {
    'data-slot': 'questionnaire-choices',
    '[class]': 'classes()',
  },
  exportAs: 'zQuestionnaireChoices',
})
export class ZardQuestionnaireChoicesComponent {
  readonly class = input<ClassValue>('');
  protected readonly classes = computed(() => mergeClasses(questionnaireChoicesVariants(), this.class()));
}
