import { ChangeDetectionStrategy, Component, computed, input, ViewEncapsulation } from '@angular/core';

import type { ClassValue } from 'clsx';

import { dividerVariants, type ZardDividerVariants } from './divider.variants';

import { mergeClasses } from '@/shared/utils/merge-classes';

@Component({
  selector: 'z-divider',
  standalone: true,
  template: '',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: {
    '[attr.role]': `'separator'`,
    '[attr.aria-orientation]': 'zOrientation()',
    '[class]': 'classes()',
  },
  exportAs: 'zDivider',
})
export class ZardDividerComponent {
  readonly zOrientation = input<ZardDividerVariants['zOrientation']>('horizontal');
  readonly zSpacing = input<ZardDividerVariants['zSpacing']>('default');
  readonly class = input<ClassValue>('');

  protected readonly classes = computed(() =>
    mergeClasses(
      dividerVariants({
        zOrientation: this.zOrientation(),
        zSpacing: this.zSpacing(),
      }),
      this.class(),
    ),
  );
}
