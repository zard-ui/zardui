import { Component } from '@angular/core';

import { ZardCarouselContentComponent } from '../carousel-content.component';
import { ZardCarouselItemComponent } from '../carousel-item.component';
import { ZardCarouselComponent } from '../carousel.component';
import { ZardButtonComponent } from '../../components';

@Component({
  standalone: true,
  imports: [ZardCarouselComponent, ZardCarouselContentComponent, ZardCarouselItemComponent, ZardButtonComponent],
  template: `
    <div class="w-full max-w-md mx-auto">
      <div class="flex gap-4 mb-4">
        <button z-button zType="outline" (click)="orientation = 'horizontal'">Horizontal</button>
        <button z-button zType="outline" (click)="orientation = 'vertical'">Vertical</button>
      </div>

      <z-carousel [zOrientation]="orientation" style="height: 300px">
        <z-carousel-content [zOrientation]="orientation">
          <z-carousel-item [zOrientation]="orientation">
            <div class="p-6 flex items-center justify-center bg-primary/10 rounded-md h-full">Slide 1</div>
          </z-carousel-item>
          <z-carousel-item [zOrientation]="orientation">
            <div class="p-6 flex items-center justify-center bg-primary/10 rounded-md h-full">Slide 2</div>
          </z-carousel-item>
          <z-carousel-item [zOrientation]="orientation">
            <div class="p-6 flex items-center justify-center bg-primary/10 rounded-md h-full">Slide 3</div>
          </z-carousel-item>
        </z-carousel-content>
      </z-carousel>
    </div>
  `,
})
export class ZardDemoCarouselOrientationComponent {
  orientation: 'horizontal' | 'vertical' = 'horizontal';
}
