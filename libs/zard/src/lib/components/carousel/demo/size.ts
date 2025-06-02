import { Component, signal } from '@angular/core';

import { ZardCarouselContentComponent } from '../carousel-content.component';
import { ZardCarouselItemComponent } from '../carousel-item.component';
import { ZardCarouselComponent } from '../carousel.component';
import { ZardButtonComponent } from '../../components';

@Component({
  standalone: true,
  imports: [ZardCarouselComponent, ZardCarouselContentComponent, ZardCarouselItemComponent, ZardButtonComponent],
  template: `
    <div class="w-full max-w-4xl mx-auto">
      <div class="flex gap-2 mb-4 justify-center">
        <button z-button zType="outline" (click)="currentSize.set('basis-full')">Full Width</button>
        <button z-button zType="outline" (click)="currentSize.set('basis-1/2')">Half Width</button>
        <button z-button zType="outline" (click)="currentSize.set('basis-1/3')">Third Width</button>
        <button z-button zType="outline" (click)="currentSize.set('md:basis-1/2 lg:basis-1/3')">Responsive</button>
      </div>

      <z-carousel [zOptions]="{ align: 'start' }">
        <z-carousel-content>
          @for (slide of slides; track $index) {
            <z-carousel-item [class]="currentSize()">
              <div class="p-4 h-40 flex items-center justify-center bg-primary/10 rounded-md">
                {{ slide }}
              </div>
            </z-carousel-item>
          }
        </z-carousel-content>
      </z-carousel>

      <div class="mt-4 text-center text-sm">
        <p><strong>Current size:</strong> {{ currentSize() }}</p>
      </div>
    </div>
  `,
})
export class ZardDemoCarouselSizeComponent {
  slides = ['Slide 1', 'Slide 2', 'Slide 3', 'Slide 4', 'Slide 5', 'Slide 6'];
  currentSize = signal<string>('basis-1/3');
}
