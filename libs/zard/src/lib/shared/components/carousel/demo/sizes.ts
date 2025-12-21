import { ChangeDetectionStrategy, Component } from '@angular/core';

import { ZardCardComponent } from '../../card';
import { ZardCarouselImports } from '../carousel.imports';

@Component({
  imports: [ZardCarouselImports, ZardCardComponent],
  template: `
    <div class="mx-auto w-3/4 max-w-md">
      <z-carousel>
        <z-carousel-content>
          @for (slide of slides; track slide) {
            <z-carousel-item class="md:basis-1/2 lg:basis-1/3">
              <z-card>
                <div class="flex h-25 items-center justify-center text-4xl font-semibold md:h-50">
                  {{ slide }}
                </div>
              </z-card>
            </z-carousel-item>
          }
        </z-carousel-content>
      </z-carousel>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ZardDemoCarouselSizeComponent {
  protected slides = ['1', '2', '3', '4', '5'];
}
