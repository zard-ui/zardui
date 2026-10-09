import { ChangeDetectionStrategy, Component, signal } from '@angular/core';

import type { EmblaCarouselType } from 'embla-carousel';

import { ZardCardImports } from '@/shared/components/card/card.imports';
import { ZardCarouselImports } from '@/shared/components/carousel/carousel.imports';

@Component({
  selector: 'z-demo-carousel-api',
  imports: [ZardCarouselImports, ZardCardImports],
  template: `
    <div class="w-full max-w-48 sm:max-w-xs">
      <z-carousel (zInited)="onInited($event)" (zSelected)="onSelected()">
        <z-carousel-content>
          @for (slide of slides; track slide) {
            <z-carousel-item>
              <div class="p-1">
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
      <p class="text-muted-foreground py-2 text-center text-sm">Slide {{ current() }} of {{ count() }}</p>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ZardDemoCarouselApiComponent {
  protected slides = ['1', '2', '3', '4', '5'];

  protected readonly current = signal(1);
  protected readonly count = signal(0);

  #emblaApi?: EmblaCarouselType;

  onInited(emblaApi: EmblaCarouselType): void {
    this.#emblaApi = emblaApi;
    this.count.set(emblaApi.scrollSnapList().length);
    this.current.set(emblaApi.selectedScrollSnap() + 1);
  }

  onSelected(): void {
    if (!this.#emblaApi) {
      return;
    }
    this.current.set(this.#emblaApi.selectedScrollSnap() + 1);
  }
}
