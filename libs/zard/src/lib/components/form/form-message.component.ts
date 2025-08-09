import { ClassValue } from 'class-variance-authority/dist/types';

import { ChangeDetectionStrategy, Component, computed, input, ViewEncapsulation } from '@angular/core';

import { mergeClasses } from '../../shared/utils/utils';
import { formMessageVariants, ZardFormMessageVariants } from './form.variants';

@Component({
  selector: 'z-form-message, [z-form-message]',
  exportAs: 'zFormMessage',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  template: '<ng-content></ng-content>',
  host: {
    '[class]': 'classes()',
  },
})
export class ZardFormMessageComponent {
  readonly class = input<ClassValue>('');
  readonly zType = input<ZardFormMessageVariants['zType']>('default');

  protected readonly classes = computed(() => mergeClasses(formMessageVariants({ zType: this.zType() }), this.class()));
}
