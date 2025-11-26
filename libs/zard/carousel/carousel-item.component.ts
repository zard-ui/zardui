import { ChangeDetectionStrategy, Component, ViewEncapsulation, computed, inject, input } from '@angular/core';

import { type ClassValue } from 'clsx';

import { mergeClasses } from '@ngzard/ui/core';

import { ZardCarouselComponent } from './carousel.component';
import { carouselItemVariants } from './carousel.variants';

@Component({
  selector: 'z-carousel-item',
  imports: [],
  template: `
    <ng-content />
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: {
    '[class]': 'classes()',
    role: 'group',
    'aria-roledescription': 'slide',
  },
})
export class ZardCarouselItemComponent {
  readonly #parent = inject(ZardCarouselComponent);

  readonly #orientation = computed<'horizontal' | 'vertical'>(() => this.#parent.zOrientation());
  readonly class = input<ClassValue>('');
  protected readonly classes = computed(() =>
    mergeClasses(carouselItemVariants({ zOrientation: this.#orientation() }), this.class()),
  );
}
