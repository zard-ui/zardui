import { ChangeDetectionStrategy, Component, type OnInit, inject, signal } from '@angular/core';

import { type EmblaCarouselType, type EmblaPluginType } from 'embla-carousel';

import { ZardButtonComponent } from '@ngzard/ui/button';
import { ZardCardComponent } from '@ngzard/ui/card';

import { ZardCarouselPluginsService } from '../carousel-plugins.service';
import { ZardCarouselModule } from '../carousel.module';

@Component({
  imports: [ZardCarouselModule, ZardButtonComponent, ZardCardComponent],
  template: `
    <div class="mx-auto w-3/4 max-w-md">
      <div class="mb-4 flex gap-2">
        <button type="button" z-button zType="outline" (click)="toggleAutoplay()">
          {{ isAutoplayActive() ? 'Pause' : 'Start' }} Autoplay
        </button>
        <button type="button" z-button zType="outline" (click)="toggleLoop()">
          {{ carouselOptions.loop ? 'Disable' : 'Enable' }} Loop
        </button>
      </div>

      <z-carousel
        [zOptions]="carouselOptions"
        [zPlugins]="plugins"
        (zInited)="onCarouselInit($event)"
        (zSelected)="onSlideChange()"
      >
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

      <div class="mt-4 text-center text-sm">
        <p>Current slide: {{ currentSlide() }} / {{ totalSlides() }}</p>
      </div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ZardDemoCarouselPluginsComponent implements OnInit {
  private readonly pluginsService = inject(ZardCarouselPluginsService);

  carouselOptions = {
    loop: true,
    align: 'center' as const,
  };

  plugins: EmblaPluginType[] = [];
  carouselApi!: EmblaCarouselType;

  protected readonly isAutoplayActive = signal(false);
  protected readonly currentSlide = signal(1);
  protected readonly totalSlides = signal(0);

  protected slides = ['1', '2', '3', '4', '5'];

  ngOnInit(): void {
    // Autoplay by default
    this.toggleAutoplay().catch(err => {
      console.error('Failed to initialize autoplay:', err);
      this.isAutoplayActive.set(false);
    });
  }

  onCarouselInit(api: EmblaCarouselType) {
    this.carouselApi = api;

    this.totalSlides.set(api.scrollSnapList().length);
    this.currentSlide.set(api.selectedScrollSnap() + 1);
  }

  protected onSlideChange(): void {
    this.currentSlide.set(this.carouselApi.selectedScrollSnap() + 1);
  }

  async toggleAutoplay() {
    this.isAutoplayActive.update(b => !b);
    if (this.isAutoplayActive()) {
      await this.startAutoplay();
    } else {
      this.pauseAutoplay();
    }
    this.reinitCarousel();
  }

  toggleLoop() {
    this.carouselOptions = {
      ...this.carouselOptions,
      loop: !this.carouselOptions.loop,
    };

    this.reinitCarousel();
  }

  private async startAutoplay() {
    const autoplayPlugin = await this.pluginsService.createAutoplayPlugin({
      stopOnMouseEnter: true,
      delay: 2000,
      stopOnInteraction: false,
    });
    this.plugins = [...this.plugins.filter(p => p.name !== 'autoplay'), autoplayPlugin];
  }

  private pauseAutoplay(): void {
    this.plugins = this.plugins.filter(p => p.name !== 'autoplay');
  }

  private reinitCarousel() {
    if (this.carouselApi) {
      this.carouselApi.reInit(this.carouselOptions, this.plugins);
    }
  }
}
