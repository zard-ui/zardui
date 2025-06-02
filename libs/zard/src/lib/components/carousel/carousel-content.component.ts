import { ChangeDetectionStrategy, Component, ViewEncapsulation, ViewChild, ElementRef, input, computed } from '@angular/core';
import { CommonModule } from '@angular/common';

import { carouselContentVariants } from './carousel.variants';

@Component({
  selector: 'z-carousel-content',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="overflow-hidden">
      <div [ngClass]="classes()" #carouselContent>
        <ng-content></ng-content>
      </div>
    </div>
  `,
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ZardCarouselContentComponent {
  public readonly zOrientation = input<'horizontal' | 'vertical'>('horizontal');

  @ViewChild('carouselContent', { static: true }) carouselContentRef!: ElementRef<HTMLElement>;

  protected readonly classes = computed(() => carouselContentVariants({ zOrientation: this.zOrientation() }));
}
