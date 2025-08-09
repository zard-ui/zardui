import { ClassValue } from 'class-variance-authority/dist/types';

import { ChangeDetectionStrategy, Component, computed, input, ViewEncapsulation } from '@angular/core';

import { mergeClasses } from '../../shared/utils/utils';
import { formControlVariants } from './form.variants';

@Component({
  selector: 'z-form-control, [z-form-control]',
  exportAs: 'zFormControl',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  template: '<ng-content></ng-content>',
  host: {
    '[class]': 'classes()',
  },
})
export class ZardFormControlComponent {
  readonly class = input<ClassValue>('');

  protected readonly classes = computed(() => mergeClasses(formControlVariants(), this.class()));
}
