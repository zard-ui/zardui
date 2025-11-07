```angular-ts showLineNumbers copyButton
import { ChangeDetectionStrategy, Component } from '@angular/core';

import { ZardCardComponent } from '../../card';
import { ZardCarouselModule } from '../carousel.module';

@Component({
  imports: [ZardCarouselModule, ZardCardComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="mx-auto w-[400px] max-w-md">
      <z-carousel zOrientation="vertical" class="w-full">
        <z-carousel-content class="h-[300px]">
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
export class ZardDemoCarouselOrientationComponent {
  protected slides = ['1', '2', '3', '4', '5'];
}

```