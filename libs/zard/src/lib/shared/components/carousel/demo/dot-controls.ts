import { ChangeDetectionStrategy, Component } from '@angular/core';

import { ZardCardImports } from '@/shared/components/card/card.imports';
import { ZardCarouselImports } from '@/shared/components/carousel/carousel.imports';

@Component({
  imports: [ZardCarouselImports, ZardCardImports],
  template: `
    <div class="mx-auto w-3/4 max-w-md">
      <z-carousel zControls="dot">
        <z-carousel-content>
          @for (slide of slides; track slide) {
            <z-carousel-item>
              <div z-card>
                <div z-card-content class="flex aspect-square items-center justify-center p-6">
                  <span class="text-4xl font-semibold">{{ slide }}</span>
                </div>
              </div>
            </z-carousel-item>
          }
        </z-carousel-content>
      </z-carousel>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ZardDemoCarouselDotControlsComponent {
  protected slides = ['1', '2', '3', '4', '5'];
}
