import { ChangeDetectionStrategy, Component, computed, input, ViewEncapsulation } from '@angular/core';
import { ClassValue } from 'class-variance-authority/dist/types';

import { dividerVariants, ZardDividerVariants } from './divider.variants';
import { mergeClasses } from '../../shared/utils/utils';

@Component({
  selector: 'z-divider',
  standalone: true,
  exportAs: 'zDivider',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  template: '',
  host: {
    '[attr.role]': `'separator'`,
    '[attr.aria-orientation]': 'zOrientation()',
    '[class]': 'classes()',
  },
})
export class ZardDividerComponent {
  readonly zOrientation = input<ZardDividerVariants['zOrientation']>('horizontal');
  readonly class = input<ClassValue>('');

  protected readonly classes = computed(() => mergeClasses(dividerVariants({ zOrientation: this.zOrientation() }), this.class()));
}
