import { ChangeDetectionStrategy, Component, ViewEncapsulation, computed, inject, input } from '@angular/core';

import { type ClassValue } from 'clsx';

import { ZardCarouselComponent } from './carousel.component';
import { carouselItemVariants } from './carousel.variants';
import { mergeClasses } from '../../shared/utils/utils';

@Component({
  selector: 'z-carousel-item',
  imports: [],
  template: ` <ng-content></ng-content> `,
  host: {
    '[class]': 'classes()',
    role: 'group',
    'aria-roledescription': 'slide',
  },
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ZardCarouselItemComponent {
  readonly #parent = inject(ZardCarouselComponent);

  readonly #orientation = computed<'horizontal' | 'vertical'>(() => this.#parent.zOrientation());
  readonly class = input<ClassValue>('');
  protected readonly classes = computed(() => mergeClasses(carouselItemVariants({ zOrientation: this.#orientation() }), this.class()));
}
