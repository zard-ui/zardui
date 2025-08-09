import { ClassValue } from 'class-variance-authority/dist/types';

import { ChangeDetectionStrategy, Component, computed, input, ViewEncapsulation } from '@angular/core';

import { mergeClasses } from '../../shared/utils/utils';
import { formFieldVariants } from './form.variants';

@Component({
  selector: 'z-form-field, [z-form-field]',
  exportAs: 'zFormField',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  template: '<ng-content></ng-content>',
  host: {
    '[class]': 'classes()',
  },
})
export class ZardFormFieldComponent {
  readonly class = input<ClassValue>('');

  protected readonly classes = computed(() => mergeClasses(formFieldVariants(), this.class()));
}
