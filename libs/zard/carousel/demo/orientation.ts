import { ChangeDetectionStrategy, Component } from '@angular/core';

import { ZardCardComponent } from '@ngzard/ui/card';

import { ZardCarouselModule } from '../carousel.module';

@Component({
  imports: [ZardCarouselModule, ZardCardComponent],
  template: `
    <div class="mx-auto w-3/4 max-w-md">
      <z-carousel zOrientation="vertical" class="w-full">
        <z-carousel-content class="h-[200px] md:h-[300px]">
          @for (slide of slides; track slide) {
            <z-carousel-item>
              <z-card class="w-full">
                <div class="flex h-[100px] items-center justify-center text-4xl font-semibold md:h-[200px]">
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
export class ZardDemoCarouselOrientationComponent {
  protected slides = ['1', '2', '3', '4', '5'];
}
