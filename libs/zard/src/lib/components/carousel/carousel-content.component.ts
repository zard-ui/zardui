import { ChangeDetectionStrategy, Component, ViewEncapsulation, computed, inject, input } from '@angular/core';

import { type ClassValue } from 'clsx';

import { ZardCarouselComponent } from './carousel.component';
import { carouselContentVariants } from './carousel.variants';
import { mergeClasses } from '../../shared/utils/utils';

@Component({
  selector: 'z-carousel-content',
  imports: [],
  template: ` <ng-content></ng-content> `,
  host: {
    '[class]': 'classes()',
  },
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ZardCarouselContentComponent {
  readonly #parent = inject(ZardCarouselComponent);
  readonly #orientation = computed<'horizontal' | 'vertical'>(() => this.#parent.zOrientation());
  readonly class = input<ClassValue>('');
  protected readonly classes = computed(() => mergeClasses(carouselContentVariants({ zOrientation: this.#orientation() }), this.class()));
}
