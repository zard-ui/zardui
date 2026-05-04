import { ChangeDetectionStrategy, Component, computed, input, ViewEncapsulation } from '@angular/core';

import type { ClassValue } from 'clsx';

import { mergeClasses } from '@/shared/utils/merge-classes';

import { separatorVariants, type ZardSeparatorVariants } from './separator.variants';

@Component({
  selector: 'z-separator',
  standalone: true,
  template: '',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: {
    '[attr.role]': `'separator'`,
    '[attr.aria-orientation]': 'zOrientation()',
    '[class]': 'classes()',
  },
  exportAs: 'zSeparator',
})
export class ZardSeparatorComponent {
  readonly zOrientation = input<ZardSeparatorVariants['zOrientation']>('horizontal');
  readonly zSpacing = input<ZardSeparatorVariants['zSpacing']>('default');
  readonly class = input<ClassValue>('');

  protected readonly classes = computed(() =>
    mergeClasses(
      separatorVariants({
        zOrientation: this.zOrientation(),
        zSpacing: this.zSpacing(),
      }),
      this.class(),
    ),
  );
}
