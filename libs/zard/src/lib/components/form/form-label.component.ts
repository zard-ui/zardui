import { ClassValue } from 'class-variance-authority/dist/types';

import { ChangeDetectionStrategy, Component, computed, input, ViewEncapsulation } from '@angular/core';

import { mergeClasses, transform } from '../../shared/utils/utils';
import { formLabelVariants } from './form.variants';

@Component({
  selector: 'z-form-label, label[z-form-label]',
  exportAs: 'zFormLabel',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  template: '<ng-content></ng-content>',
  host: {
    '[class]': 'classes()',
  },
})
export class ZardFormLabelComponent {
  readonly class = input<ClassValue>('');
  readonly zRequired = input(false, { transform });

  protected readonly classes = computed(() => mergeClasses(formLabelVariants({ zRequired: this.zRequired() }), this.class()));
}
