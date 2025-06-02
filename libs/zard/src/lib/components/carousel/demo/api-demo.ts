import { Component, signal, computed } from '@angular/core';

import { ZardCarouselContentComponent } from '../carousel-content.component';
import { ZardCarouselComponent, CarouselApi } from '../carousel.component';
import { ZardCarouselItemComponent } from '../carousel-item.component';
import { ZardButtonComponent } from '../../components';

@Component({
  standalone: true,
  imports: [ZardCarouselComponent, ZardCarouselContentComponent, ZardCarouselItemComponent, ZardButtonComponent],
  template: `
    <div class="w-full max-w-md mx-auto">
      <z-carousel [zOptions]="{ loop: true }" (zOnInit)="onCarouselInit($event)" (zOnSelect)="onSlideChange($event)">
        <z-carousel-content>
          @for (slide of slides; track $index) {
            <z-carousel-item>
              <div class="p-6 h-48 flex items-center justify-center bg-primary/10 rounded-md">
                {{ slide }}
              </div>
            </z-carousel-item>
          }
        </z-carousel-content>
      </z-carousel>

      <div class="flex gap-2 mt-4 justify-center">
        <button z-button zType="outline" (click)="goToPrevious()">Previous</button>
        <button z-button zType="outline" (click)="goToNext()">Next</button>
        <button z-button zType="outline" (click)="goToSlide(2)">Go to Slide 3</button>
      </div>

      <div class="mt-4 text-center text-sm space-y-2">
        <p><strong>Current slide:</strong> {{ currentSlide() }} / {{ totalSlides() }}</p>
        <p><strong>Scroll progress:</strong> {{ Math.round(scrollProgress() * 100) }}%</p>
        <p><strong>Can scroll prev:</strong> {{ canScrollPrev() ? 'Yes' : 'No' }}</p>
        <p><strong>Can scroll next:</strong> {{ canScrollNext() ? 'Yes' : 'No' }}</p>
        <p><strong>Slides in view:</strong> {{ slidesInView().join(', ') }}</p>
      </div>
    </div>
  `,
})
export class ZardDemoCarouselApiComponent {
  // Math for template
  Math = Math;

  // Data
  slides = ['Slide 1', 'Slide 2', 'Slide 3', 'Slide 4', 'Slide 5'];

  // Carousel API signal
  private readonly carouselApi = signal<CarouselApi | null>(null);

  // Reactive state from carousel API
  protected readonly currentSlide = signal<number>(1);
  protected readonly totalSlides = signal<number>(0);
  protected readonly scrollProgress = signal<number>(0);
  protected readonly slidesInView = signal<number[]>([]);

  // Computed signals for API methods
  protected readonly canScrollPrev = computed(() => this.carouselApi()?.canScrollPrev() || false);

  protected readonly canScrollNext = computed(() => this.carouselApi()?.canScrollNext() || false);

  onCarouselInit(api: CarouselApi) {
    this.carouselApi.set(api);
    this.totalSlides.set(api.slideCount());
    this.currentSlide.set(api.selectedIndex + 1);
    this.slidesInView.set(api.slidesInView());

    // Listen to select events
    api.addEventListener('select', () => {
      this.currentSlide.set(api.selectedIndex + 1);
      this.slidesInView.set(api.slidesInView());
    });
  }

  onSlideChange(event: { selectedIndex: number; scrollProgress: number; scrollSnapList: number[] }) {
    this.scrollProgress.set(event.scrollProgress);
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
