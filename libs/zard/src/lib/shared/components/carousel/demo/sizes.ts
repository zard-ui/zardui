import { ChangeDetectionStrategy, Component } from '@angular/core';

import { ZardCardImports } from '@/shared/components/card/card.imports';
import { ZardCarouselImports } from '@/shared/components/carousel/carousel.imports';

@Component({
  imports: [ZardCarouselImports, ZardCardImports],
  template: `
    <div class="w-full max-w-[12rem] sm:max-w-xs md:max-w-sm">
      <z-carousel [zOptions]="{ align: 'start' }">
        <z-carousel-content>
          @for (slide of slides; track slide) {
            <z-carousel-item class="basis-1/2 lg:basis-1/3">
              <div class="p-1">
                <z-card>
                  <z-card-content class="flex aspect-square items-center justify-center p-6">
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
export class ZardDemoCarouselSizeComponent {
  protected slides = ['1', '2', '3', '4', '5'];
}
