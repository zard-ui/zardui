import type { ClassValue } from 'clsx';

import { ChangeDetectionStrategy, Component, computed, input, ViewEncapsulation } from '@angular/core';

import { mergeClasses } from '../../shared/utils/utils';
import { badgeVariants, ZardBadgeVariants } from './badge.variants';

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

  protected readonly classes = computed(() => mergeClasses(badgeVariants({ zType: this.zType(), zShape: this.zShape() }), this.class()));
}
