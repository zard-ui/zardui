import { ChangeDetectionStrategy, Component } from '@angular/core';

import { ZardCardImports } from '@zard/components/card';
import { ZardCarouselImports } from '@zard/components/carousel';

import { ExampleImports } from './example.component';

const SLIDES = [1, 2, 3, 4, 5] as const;

/** shadcn/ui's `carousel-example`, in zard. */
@Component({
  selector: 'z-carousel-example',
  imports: [ExampleImports, ZardCardImports, ZardCarouselImports],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <z-example-wrapper zClass="lg:grid-cols-1">
      <z-example zTitle="Basic">
        <z-carousel class="mx-auto max-w-xs sm:max-w-sm">
          <z-carousel-content>
            @for (slide of slides; track slide) {
              <z-carousel-item>
                <div class="style-luma:p-2.5 p-1">
                  <z-card>
                    <z-card-content class="flex aspect-square items-center justify-center p-6">
                      <span class="text-4xl font-semibold">{{ slide }}</span>
                    </z-card-content>
                  </z-card>
                </div>
              </z-carousel-item>
            }
          </z-carousel-content>
        </z-carousel>
      </z-example>

      <z-example zTitle="Multiple">
        <z-carousel class="mx-auto max-w-xs sm:max-w-sm" [zOptions]="{ align: 'start' }">
          <z-carousel-content>
            @for (slide of slides; track slide) {
              <z-carousel-item class="sm:basis-1/2 lg:basis-1/3">
                <div class="style-luma:p-2.5 p-1">
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
      </z-example>

      <z-example zTitle="With Gap">
        <z-carousel class="mx-auto max-w-xs sm:max-w-sm">
          <z-carousel-content class="-ml-1">
            @for (slide of slides; track slide) {
              <z-carousel-item class="pl-1 md:basis-1/2">
                <div class="style-luma:p-2.5 p-1">
                  <z-card>
                    <z-card-content class="flex aspect-square items-center justify-center p-6">
                      <span class="text-2xl font-semibold">{{ slide }}</span>
                    </z-card-content>
                  </z-card>
                </div>
              </z-carousel-item>
            }
          </z-carousel-content>
        </z-carousel>
      </z-example>
    </z-example-wrapper>
  `,
})
export class CarouselExampleComponent {
  protected readonly slides = SLIDES;
}
