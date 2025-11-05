import { Component } from '@angular/core';

import { ZardCardComponent } from '../../card';
import { ZardCarouselModule } from '../carousel.module';

@Component({
  standalone: true,
  imports: [ZardCarouselModule, ZardCardComponent],
  template: `
    <div class="mx-auto w-full max-w-md">
      <z-carousel>
        <z-carousel-content>
          @for (slide of slides; track slide) {
            <z-carousel-item>
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
export class ZardDemoCarouselDefaultComponent {
  protected slides = ['1', '2', '3', '4', '5'];
}
