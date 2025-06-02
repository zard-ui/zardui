import { Component } from '@angular/core';

import { ZardCarouselContentComponent } from '../carousel-content.component';
import { ZardCarouselItemComponent } from '../carousel-item.component';
import { ZardCarouselComponent } from '../carousel.component';

@Component({
  standalone: true,
  imports: [ZardCarouselComponent, ZardCarouselContentComponent, ZardCarouselItemComponent],
  template: `
    <div class="w-full max-w-md mx-auto">
      <z-carousel [zOptions]="{ align: 'start' }">
        <z-carousel-content>
          @for (slide of slides; track $index) {
            <z-carousel-item class="basis-1/2 md:basis-1/3">
              <div class="p-4 h-40 flex items-center justify-center bg-primary/10 rounded-md">
                {{ slide }}
              </div>
            </z-carousel-item>
          }
        </z-carousel-content>
      </z-carousel>
    </div>
  `,
})
export class ZardDemoCarouselMultipleComponent {
  slides = ['Slide 1', 'Slide 2', 'Slide 3', 'Slide 4', 'Slide 5'];
}
