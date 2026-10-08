import { ChangeDetectionStrategy, Component, computed, input, ViewEncapsulation } from '@angular/core';

import type { ClassValue } from 'clsx';

import { mergeClasses } from '@/shared/utils/merge-classes';

import { aspectRatioVariants } from './aspect-ratio.variants';

@Component({
  selector: 'z-aspect-ratio, [z-aspect-ratio]',
  template: `
    <ng-content />
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: {
    'data-slot': 'aspect-ratio',
    '[style.aspectRatio]': 'zRatio()',
    '[class]': 'classes()',
  },
  exportAs: 'zAspectRatio',
})
export class ZardAspectRatioComponent {
  readonly zRatio = input<number | string>(1);
  readonly class = input<ClassValue>('');

  protected readonly classes = computed(() => mergeClasses(aspectRatioVariants(), this.class()));
}
