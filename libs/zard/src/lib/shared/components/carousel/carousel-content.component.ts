import { ChangeDetectionStrategy, Component, ViewEncapsulation, computed, inject, input } from '@angular/core';

import { type ClassValue } from 'clsx';

import { ZardCarouselComponent } from '@/shared/components/carousel/carousel.component';
import { carouselContentVariants } from '@/shared/components/carousel/carousel.variants';
import { mergeClasses } from '@/shared/utils/merge-classes';

@Component({
  selector: 'z-carousel-content',
  imports: [],
  template: `
    <ng-content />
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: {
    '[class]': 'classes()',
  },
})
export class ZardCarouselContentComponent {
  readonly #parent = inject(ZardCarouselComponent);
  readonly #orientation = computed<'horizontal' | 'vertical'>(() => this.#parent.zOrientation());
  readonly class = input<ClassValue>('');
  protected readonly classes = computed(() =>
    mergeClasses(carouselContentVariants({ zOrientation: this.#orientation() }), this.class()),
  );
}
