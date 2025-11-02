import { ChangeDetectionStrategy, Component, computed, input, ViewEncapsulation } from '@angular/core';

import type { ClassValue } from 'clsx';

import { badgeVariants, type ZardBadgeVariants } from './badge.variants';
import { mergeClasses } from '../../shared/utils/utils';

@Component({
  selector: 'z-badge',
  exportAs: 'zBadge',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  template: `<ng-content />`,
  host: {
    '[class]': 'classes()',
  },
})
export class ZardBadgeComponent {
  readonly zType = input<ZardBadgeVariants['zType']>('default');
  readonly zShape = input<ZardBadgeVariants['zShape']>('default');

  readonly class = input<ClassValue>('');

  protected readonly classes = computed(() =>
    mergeClasses(badgeVariants({ zType: this.zType(), zShape: this.zShape() }), this.class()),
  );
}
