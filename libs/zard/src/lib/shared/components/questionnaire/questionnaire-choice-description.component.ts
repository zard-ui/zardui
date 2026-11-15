import { ChangeDetectionStrategy, Component, computed, input, ViewEncapsulation } from '@angular/core';

import type { ClassValue } from 'clsx';

import { mergeClasses } from '@/shared/utils/merge-classes';

import { questionnaireChoiceDescriptionVariants } from './questionnaire.variants';

@Component({
  selector: 'z-questionnaire-choice-description',
  template: `
    <ng-content />
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: {
    'data-slot': 'questionnaire-choice-description',
    '[class]': 'classes()',
  },
  exportAs: 'zQuestionnaireChoiceDescription',
})
export class ZardQuestionnaireChoiceDescriptionComponent {
  readonly class = input<ClassValue>('');
  protected readonly classes = computed(() => mergeClasses(questionnaireChoiceDescriptionVariants(), this.class()));
}
