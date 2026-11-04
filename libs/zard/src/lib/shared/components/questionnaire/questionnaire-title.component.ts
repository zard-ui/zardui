import { ChangeDetectionStrategy, Component, computed, input, ViewEncapsulation } from '@angular/core';

import type { ClassValue } from 'clsx';

import { mergeClasses } from '@/shared/utils/merge-classes';

import { questionnaireTitleVariants } from './questionnaire.variants';

@Component({
  selector: 'z-questionnaire-title',
  template: `
    <legend>
      <ng-content />
    </legend>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: {
    'data-slot': 'questionnaire-title',
    '[class]': 'classes()',
  },
  exportAs: 'zQuestionnaireTitle',
})
export class ZardQuestionnaireTitleComponent {
  readonly class = input<ClassValue>('');
  protected readonly classes = computed(() => mergeClasses(questionnaireTitleVariants(), this.class()));
}
