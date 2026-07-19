import { Component, signal } from '@angular/core';

import { ZardFieldImports } from '@/shared/components/field';

import { ZardSliderComponent } from '../slider.component';

@Component({
  selector: 'z-demo-slider-controlled',
  imports: [ZardSliderComponent, ...ZardFieldImports],
  template: `
    <div class="flex min-h-50 w-full flex-col items-center justify-center gap-2 p-10">
      <div class="mx-auto flex w-full max-w-xs justify-between">
        <label z-field-label for="slider-demo-temperature">Temperature</label>
        <span class="text-muted-foreground text-sm">{{ value().join(', ') }}</span>
      </div>
      <z-slider
        id="slider-demo-temperature"
        class="mx-auto w-full max-w-xs"
        zMin="0"
        zMax="1"
        zStep="0.1"
        [zValue]="value()"
        (zSlideIndexChange)="onSlide($event)"
      />
    </div>
  `,
})
export class ZardDemoSliderControlledComponent {
  readonly value = signal([0.3, 0.7]);

  onSlide(value: number[]) {
    this.value.set(value.map(v => Math.round(v * 10) / 10));
  }
}
