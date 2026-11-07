import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
  type OnDestroy,
  ViewEncapsulation,
} from '@angular/core';

import type { ClassValue } from 'clsx';

import { mergeClasses } from '@/shared/utils/merge-classes';

import { ZardQuestionnaireItemComponent } from './questionnaire-item.component';
import { questionnaireDescriptionVariants } from './questionnaire.variants';

@Component({
  selector: 'z-questionnaire-description',
  template: `
    <p>
      <ng-content />
    </p>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: {
    'data-slot': 'questionnaire-description',
    '[id]': 'item.descriptionId()',
    '[class]': 'classes()',
  },
  exportAs: 'zQuestionnaireDescription',
})
export class ZardQuestionnaireDescriptionComponent implements OnDestroy {
  readonly item = inject(ZardQuestionnaireItemComponent);
  readonly class = input<ClassValue>('');
  protected readonly classes = computed(() => mergeClasses(questionnaireDescriptionVariants(), this.class()));

  constructor() {
    this.item.descriptionPresent.set(true);
  }

  ngOnDestroy(): void {
    this.item.descriptionPresent.set(false);
  }
}
