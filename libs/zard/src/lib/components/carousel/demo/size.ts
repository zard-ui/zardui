import { ChangeDetectionStrategy, Component } from '@angular/core';

import { ZardCardComponent } from '../../card';
import { ZardCarouselModule } from '../carousel.module';

@Component({
  imports: [ZardCarouselModule, ZardCardComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="mx-auto w-full max-w-md">
      <z-carousel>
        <z-carousel-content>
          @for (slide of slides; track slide) {
            <!-- To set the size of the items, you can use the basis utility class on the <z-carousel-item />. -->
            <z-carousel-item class="md:basis-1/2 lg:basis-1/3">
              <z-card class="w-full">
                <div class="flex h-[200px] items-center justify-center text-4xl font-semibold">{{ slide }}</div>
              </z-card>
            </z-carousel-item>
          }
        </z-carousel-content>
      </z-carousel>
    </div>
  `,
})
export class ZardDemoCarouselSizeComponent {
  protected slides = ['1', '2', '3', '4', '5'];
}
