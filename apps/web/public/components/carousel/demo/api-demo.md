```angular-ts showLineNumbers copyButton
import { ChangeDetectionStrategy, Component, signal } from '@angular/core';

import { type EmblaCarouselType } from 'embla-carousel';

import { ZardButtonComponent } from '@ngzard/ui/button';
import { ZardCardComponent } from '@ngzard/ui/card';
import { ZardCarouselModule } from '@ngzard/ui/carousel';

@Component({
  imports: [ZardCarouselModule, ZardButtonComponent, ZardCardComponent],
  template: `
    <div class="mx-auto w-3/4 max-w-md">
      <z-carousel [zOptions]="{ loop: false }" (zSelected)="onSlideChange()" (zInited)="onCarouselInit($event)">
        <z-carousel-content>
          @for (slide of slides; track slide) {
            <z-carousel-item>
              <z-card>
                <div class="flex h-40 items-center justify-center text-4xl font-semibold">{{ slide }}</div>
              </z-card>
            </z-carousel-item>
          }
        </z-carousel-content>
      </z-carousel>

      <div class="mt-4 flex justify-center gap-2">
        <button z-button zType="outline" (click)="goToPrevious()" [disabled]="!canScrollPrev()">Previous</button>
        <button z-button zType="outline" (click)="goToNext()" [disabled]="!canScrollNext()">Next</button>
        <button z-button zType="outline" (click)="goToSlide(2)">Go to Slide 3</button>
      </div>

      <div class="mt-4 space-y-2 text-center text-sm">
        <p>
          <strong>Current slide:</strong>
          {{ currentSlide() }} / {{ totalSlides() }}
        </p>
        <p>
          <strong>Scroll progress:</strong>
          {{ Math.round(scrollProgress() * 100) }}%
        </p>
        <p>
          <strong>Can scroll prev:</strong>
          {{ canScrollPrev() ? 'Yes' : 'No' }}
        </p>
        <p>
          <strong>Can scroll next:</strong>
          {{ canScrollNext() ? 'Yes' : 'No' }}
        </p>
        <p>
          <strong>Slides in view:</strong>
          {{ slidesInView().join(', ') }}
        </p>
      </div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ZardDemoCarouselApiComponent {
  // Math for template
  Math = Math;

  // Data
  protected slides = ['1', '2', '3', '4', '5'];

  // Carousel API signal
  private readonly carouselApi = signal<EmblaCarouselType | null>(null);

  // Reactive state from carousel API
  protected readonly currentSlide = signal<number>(1);
  protected readonly totalSlides = signal<number>(0);
  protected readonly scrollProgress = signal<number>(0);
  protected readonly slidesInView = signal<number[]>([]);

  // Computed signals for API methods
  protected readonly canScrollPrev = signal(false);

  protected readonly canScrollNext = signal(false);

  onCarouselInit(api: EmblaCarouselType) {
    this.carouselApi.set(api);
    this.update();
  }

  onSlideChange() {
    this.update();
  }

  private update(): void {
    const api = this.carouselApi();
    if (api) {
      this.scrollProgress.set(api.scrollProgress());
      this.totalSlides.set(api.scrollSnapList().length);
      this.currentSlide.set(api.selectedScrollSnap() + 1);
      this.slidesInView.set(api.slidesInView());
      this.canScrollPrev.set(api.canScrollPrev());
      this.canScrollNext.set(api.canScrollNext());
    }
  }

  goToPrevious() {
    this.carouselApi()?.scrollPrev();
  }

  goToNext() {
    this.carouselApi()?.scrollNext();
  }

  goToSlide(index: number) {
    this.carouselApi()?.scrollTo(index);
  }
}

```