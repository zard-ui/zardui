import { Component } from '@angular/core';

import { ZardCarouselContentComponent } from '../carousel-content.component';
import { ZardCarouselItemComponent } from '../carousel-item.component';
import { ZardCarouselComponent } from '../carousel.component';

@Component({
  standalone: true,
  imports: [ZardCarouselComponent, ZardCarouselContentComponent, ZardCarouselItemComponent],
  template: `
    <div class="w-full max-w-md mx-auto">
      <z-carousel>
        <z-carousel-content>
          <z-carousel-item>
            <div class="p-6 h-48 flex items-center justify-center bg-primary/10 rounded-md">Slide 1</div>
          </z-carousel-item>
          <z-carousel-item>
            <div class="p-6 h-48 flex items-center justify-center bg-primary/10 rounded-md">Slide 2</div>
          </z-carousel-item>
          <z-carousel-item>
            <div class="p-6 h-48 flex items-center justify-center bg-primary/10 rounded-md">Slide 3</div>
          </z-carousel-item>
        </z-carousel-content>
      </z-carousel>
    </div>
  `,
})
export class ZardDemoCarouselDefaultComponent {}
