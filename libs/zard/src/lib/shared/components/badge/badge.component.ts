import { ChangeDetectionStrategy, Component, computed, input, ViewEncapsulation } from '@angular/core';

import type { ClassValue } from 'clsx';

import { badgeVariants, type ZardBadgeVariants } from './badge.variants';

import { mergeClasses } from '@/shared/utils/merge-classes';

@Component({
  selector: 'z-badge',
  standalone: true,
  template: `
    <ng-content />
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: {
    '[class]': 'classes()',
  },
  exportAs: 'zBadge',
})
export class ZardBadgeComponent {
  readonly zType = input<ZardBadgeVariants['zType']>('default');
  readonly zShape = input<ZardBadgeVariants['zShape']>('default');

  readonly class = input<ClassValue>('');

  protected readonly classes = computed(() =>
    mergeClasses(badgeVariants({ zType: this.zType(), zShape: this.zShape() }), this.class()),
  );
}
