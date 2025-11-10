```angular-ts showLineNumbers copyButton
import { Component, ViewChild } from '@angular/core';

import { ZardCarouselContentComponent } from '../carousel-content.component';
import { ZardCarouselItemComponent } from '../carousel-item.component';
import { ZardCarouselComponent } from '../carousel.component';

@Component({
  standalone: true,
  imports: [ZardCarouselComponent, ZardCarouselContentComponent, ZardCarouselItemComponent],
  template: `
    <div class="mx-auto w-full max-w-md">
      <z-carousel [zOptions]="{ loop: true }">
        <z-carousel-content>
          @for (slide of slides; track $index) {
            <z-carousel-item>
              <div class="bg-primary/10 flex h-72 items-center justify-center rounded-md p-6">
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
}

```