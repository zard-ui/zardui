import { ChangeDetectionStrategy, Component } from '@angular/core';

import { ZardCardImports } from '@/shared/components/card/card.imports';

import { ZardCarouselImports } from '../carousel.imports';

@Component({
  imports: [ZardCarouselImports, ZardCardImports],
  template: `
    <div class="w-full max-w-xs">
      <z-carousel zOrientation="vertical" class="w-full">
        <z-carousel-content class="h-[200px] md:h-[300px]">
          @for (slide of slides; track slide) {
            <z-carousel-item>
              <z-card class="w-full">
                <z-card-content class="flex aspect-square items-center justify-center p-6">
                  <span class="text-4xl font-semibold">{{ slide }}</span>
                </z-card-content>
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
