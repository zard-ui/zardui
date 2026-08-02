import { ChangeDetectionStrategy, Component, computed, input, ViewEncapsulation } from '@angular/core';

import type { ClassValue } from 'clsx';

import { mergeClasses } from '@/shared/utils/merge-classes';

import { progressVariants } from './progress.variants';

@Component({
  selector: 'z-progress',
  template: `
    <div
      data-slot="progress-indicator"
      class="bg-primary size-full flex-1 transition-all"
      [style.transform]="indicatorTransform()"
    ></div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: {
    'data-slot': 'progress',
    role: 'progressbar',
    'aria-valuemin': '0',
    'aria-valuemax': '100',
    '[attr.aria-valuenow]': 'clampedValue()',
    '[class]': 'classes()',
  },
  exportAs: 'zProgress',
})
export class ZardProgressComponent {
  readonly value = input(0);
  readonly class = input<ClassValue>('');

  protected readonly clampedValue = computed(() => {
    const v = this.value();
    if (v > 100) return 100;
    if (v < 0) return 0;
    return v;
  });

  protected readonly indicatorTransform = computed(() => `translateX(-${100 - this.clampedValue()}%)`);

  protected readonly classes = computed(() => mergeClasses(progressVariants(), this.class()));
}
