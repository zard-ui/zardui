import { Component, ViewChild } from '@angular/core';

import { ZardCarouselThumbsComponent } from '../carousel-extensions.component';
import { ZardCarouselContentComponent } from '../carousel-content.component';
import { ZardCarouselComponent, CarouselApi } from '../carousel.component';
import { ZardCarouselItemComponent } from '../carousel-item.component';

@Component({
  standalone: true,
  imports: [ZardCarouselComponent, ZardCarouselContentComponent, ZardCarouselItemComponent, ZardCarouselThumbsComponent],
  template: `
    <div class="w-full max-w-md mx-auto">
      <z-carousel [zOptions]="{ loop: true }" (zOnInit)="onMainCarouselInit($event)">
        <z-carousel-content>
          @for (slide of slides; track $index) {
            <z-carousel-item>
              <div class="p-6 h-72 flex items-center justify-center bg-primary/10 rounded-md">
                <div class="text-2xl font-bold">{{ slide }}</div>
              </div>
            </z-carousel-item>
          }
        </z-carousel-content>
      </z-carousel>

      <z-carousel-thumbs #thumbs>
        <ng-template #thumbTemplate let-index>
          <div class="text-sm">{{ slides[index] }}</div>
        </ng-template>
      </z-carousel-thumbs>
    </div>
  `,
})
export class ZardDemoCarouselThumbsComponent {
  @ViewChild('thumbs') thumbsComponent!: ZardCarouselThumbsComponent;

  slides = ['Slide 1', 'Slide 2', 'Slide 3', 'Slide 4', 'Slide 5'];

  onMainCarouselInit(api: CarouselApi) {
    this.thumbsComponent.setMainApi(api);
  }
}
