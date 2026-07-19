import { ChangeDetectionStrategy, Component } from '@angular/core';

import { ZardCardImports } from '@/shared/components/card/card.imports';
import { ZardCarouselImports } from '@/shared/components/carousel/carousel.imports';

@Component({
  imports: [ZardCarouselImports, ZardCardImports],
  template: `
    <div class="w-full min-w-xs">
      <z-carousel [zOptions]="{ align: 'start' }" zOrientation="vertical">
        <z-carousel-content class="-mt-1 h-[270px]">
          @for (slide of slides; track slide) {
            <z-carousel-item class="basis-1/2 pt-1">
              <div class="p-1">
                <z-card>
                  <z-card-content class="flex items-center justify-center p-6">
                    <span class="text-3xl font-semibold">{{ slide }}</span>
                  </z-card-content>
                </z-card>
              </div>
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
