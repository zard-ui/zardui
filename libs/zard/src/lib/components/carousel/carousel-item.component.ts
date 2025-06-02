import { ChangeDetectionStrategy, Component, ViewEncapsulation, input, computed } from '@angular/core';
import { CommonModule } from '@angular/common';

import { carouselItemVariants } from './carousel.variants';

@Component({
  selector: 'z-carousel-item',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="min-w-0 shrink-0 grow-0" [ngClass]="classes()" role="group" aria-roledescription="slide">
      <ng-content></ng-content>
    </div>
  `,
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ZardCarouselItemComponent {
  public readonly zOrientation = input<'horizontal' | 'vertical'>('horizontal');

  protected readonly classes = computed(() => carouselItemVariants({ zOrientation: this.zOrientation() }));
}
