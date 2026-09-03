import { ChangeDetectionStrategy, Component, OnInit, inject, signal } from '@angular/core';

import type { EmblaPluginType } from 'embla-carousel';

import { ZardCardImports } from '@/shared/components/card/card.imports';
import { ZardCarouselPluginsService } from '@/shared/components/carousel/carousel-plugins.service';
import { ZardCarouselImports } from '@/shared/components/carousel/carousel.imports';

@Component({
  selector: 'z-demo-carousel-plugins',
  imports: [ZardCarouselImports, ZardCardImports],
  template: `
    <div class="w-full max-w-48 sm:max-w-xs">
      <z-carousel [zPlugins]="plugins()" [zOptions]="{ loop: true }">
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
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ZardDemoCarouselPluginsComponent implements OnInit {
  readonly #pluginsService = inject(ZardCarouselPluginsService);

  protected slides = ['1', '2', '3', '4', '5'];
  protected readonly plugins = signal<EmblaPluginType[]>([]);

  async ngOnInit(): Promise<void> {
    const autoplay = await this.#pluginsService.createAutoplayPlugin({ delay: 2000, stopOnInteraction: true });
    this.plugins.set([autoplay]);
  }
}
