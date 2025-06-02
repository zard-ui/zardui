import { Component, OnInit, ViewChild, inject } from '@angular/core';

import { ZardCarouselIndicatorsComponent } from '../carousel-extensions.component';
import { ZardCarouselContentComponent } from '../carousel-content.component';
import { ZardCarouselComponent, CarouselApi } from '../carousel.component';
import { ZardCarouselPluginsService } from '../carousel-plugins.service';
import { ZardCarouselItemComponent } from '../carousel-item.component';
import { ZardButtonComponent } from '../../components';

type EmblaPlugin = ReturnType<typeof import('embla-carousel-autoplay').default>;

@Component({
  standalone: true,
  imports: [ZardCarouselComponent, ZardCarouselContentComponent, ZardCarouselItemComponent, ZardCarouselIndicatorsComponent, ZardButtonComponent],
  template: `
    <div class="w-full max-w-md mx-auto">
      <div class="flex gap-2 mb-4">
        <button z-button zType="outline" (click)="toggleAutoplay()">{{ isAutoplayActive ? 'Pause' : 'Start' }} Autoplay</button>
        <button z-button zType="outline" (click)="toggleLoop()">{{ carouselOptions.loop ? 'Disable' : 'Enable' }} Loop</button>
      </div>

      <z-carousel [zOptions]="carouselOptions" [zPlugins]="plugins" (zOnInit)="onCarouselInit($event)">
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

      <z-carousel-indicators #indicators></z-carousel-indicators>

      <div class="mt-4 text-center text-sm">
        <p>Current slide: {{ currentSlide }} / {{ totalSlides }}</p>
      </div>
    </div>
  `,
})
export class ZardDemoCarouselPluginsComponent implements OnInit {
  @ViewChild(ZardCarouselIndicatorsComponent) indicators!: ZardCarouselIndicatorsComponent;

  private pluginsService = inject(ZardCarouselPluginsService);

  carouselOptions = {
    loop: true,
    align: 'center' as const,
  };

  plugins: EmblaPlugin[] = [];
  carouselApi: CarouselApi | null = null;

  isAutoplayActive = false;
  currentSlide = 1;
  totalSlides = 0;

  slides = ['Slide 1', 'Slide 2', 'Slide 3', 'Slide 4', 'Slide 5'];

  async ngOnInit() {
    // Initialize autoplay plugin by default
    await this.setupAutoplay(true);
  }

  onCarouselInit(api: CarouselApi) {
    this.carouselApi = api;
    this.indicators.setApi(api);

    this.totalSlides = api.slideCount();
    this.currentSlide = api.selectedIndex + 1;

    api.addEventListener('select', () => {
      this.currentSlide = api.selectedIndex + 1;
    });
  }

  async toggleAutoplay() {
    this.isAutoplayActive = !this.isAutoplayActive;
    await this.setupAutoplay(this.isAutoplayActive);
    this.reinitCarousel();
  }

  toggleLoop() {
    this.carouselOptions = {
      ...this.carouselOptions,
      loop: !this.carouselOptions.loop,
    };
    this.reinitCarousel();
  }

  private async setupAutoplay(active: boolean) {
    if (active) {
      const autoplayPlugin = await this.pluginsService.createAutoplayPlugin({
        delay: 2000,
        stopOnInteraction: false,
      });
      this.plugins = [...this.plugins.filter(p => p.name !== 'Autoplay'), autoplayPlugin];
    } else {
      this.plugins = this.plugins.filter(p => p.name !== 'Autoplay');
    }
  }

  private reinitCarousel() {
    if (this.carouselApi) {
      this.carouselApi.reInit(this.carouselOptions, this.plugins);
    }
  }
}
