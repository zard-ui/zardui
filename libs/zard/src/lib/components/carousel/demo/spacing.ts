import { Component, signal, computed } from '@angular/core';

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
        <button z-button zType="outline" (click)="currentSpacing.set('sm')">Small (2)</button>
        <button z-button zType="outline" (click)="currentSpacing.set('md')">Medium (4)</button>
        <button z-button zType="outline" (click)="currentSpacing.set('lg')">Large (6)</button>
        <button z-button zType="outline" (click)="currentSpacing.set('xl')">Extra Large (8)</button>
      </div>

      <z-carousel [zOptions]="{ align: 'start' }">
        <z-carousel-content [class]="contentSpacingClass()">
          @for (slide of slides; track $index) {
            <z-carousel-item class="basis-1/3" [class]="itemSpacingClass()">
              <div class="h-40 flex items-center justify-center bg-primary/10 rounded-md">
                {{ slide }}
              </div>
            </z-carousel-item>
          }
        </z-carousel-content>
      </z-carousel>

      <div class="mt-4 text-center text-sm">
        <p><strong>Current spacing:</strong> {{ currentSpacing() }}</p>
        <p><strong>Content class:</strong> {{ contentSpacingClass() }}</p>
        <p><strong>Item class:</strong> {{ itemSpacingClass() }}</p>
      </div>
    </div>
  `,
})
export class ZardDemoCarouselSpacingComponent {
  slides = ['Slide 1', 'Slide 2', 'Slide 3', 'Slide 4', 'Slide 5', 'Slide 6'];
  currentSpacing = signal<'sm' | 'md' | 'lg' | 'xl'>('md');

  // Computed classes based on current spacing
  protected readonly contentSpacingClass = computed(() => {
    const spacing = this.currentSpacing();
    const spacingMap = {
      sm: '-ml-2',
      md: '-ml-4',
      lg: '-ml-6',
      xl: '-ml-8',
    };
    return spacingMap[spacing];
  });

  protected readonly itemSpacingClass = computed(() => {
    const spacing = this.currentSpacing();
    const spacingMap = {
      sm: 'pl-2',
      md: 'pl-4',
      lg: 'pl-6',
      xl: 'pl-8',
    };
    return spacingMap[spacing];
  });
}
