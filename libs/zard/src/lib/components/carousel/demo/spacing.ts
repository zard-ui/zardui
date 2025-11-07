import { Component, signal, computed, ChangeDetectionStrategy } from '@angular/core';

import { mergeClasses } from '../../../shared/utils/utils';
import { ZardCardComponent } from '../../card';
import { ZardSegmentedComponent } from '../../segmented/segmented.component';
import { ZardCarouselModule } from '../carousel.module';

@Component({
  imports: [ZardCarouselModule, ZardSegmentedComponent, ZardCardComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="mx-auto w-full max-w-4xl">
      <div class="mb-4 flex justify-center gap-2">
        <z-segmented [zOptions]="options" zDefaultValue="md" (zChange)="onChange($event)" />
      </div>

      <z-carousel [zOptions]="{ align: 'start' }">
        <z-carousel-content [class]="contentSpacingClass()">
          @for (slide of slides; track slide) {
            <z-carousel-item [class]="itemSpacingClass()">
              <z-card>
                <div class="flex h-40 items-center justify-center text-4xl font-semibold">{{ slide }}</div>
              </z-card>
            </z-carousel-item>
          }
        </z-carousel-content>
      </z-carousel>

      <div class="mt-4 text-center text-sm">
        <p><strong>Content class:</strong> {{ contentSpacingClass() }}</p>
        <p><strong>Item class:</strong> {{ itemSpacingClass() }}</p>
      </div>
    </div>
  `,
})
export class ZardDemoCarouselSpacingComponent {
  protected slides = ['1', '2', '3', '4', '5', '6'];
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
    return mergeClasses('basis-1/3', spacingMap[spacing]);
  });

  options = [
    {
      value: 'sm',
      label: 'Small',
    },
    {
      value: 'md',
      label: 'Medium',
    },
    {
      value: 'lg',
      label: 'Large',
    },
    {
      value: 'xl',
      label: 'Extra Large',
    },
  ];

  onChange(value: string) {
    this.currentSpacing.set(value as 'sm' | 'md' | 'lg' | 'xl');
  }
}
