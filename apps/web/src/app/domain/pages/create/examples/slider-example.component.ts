import { ChangeDetectionStrategy, Component, signal } from '@angular/core';

import { ZardFieldImports } from '@zard/components/field';
import { ZardSliderComponent } from '@zard/components/slider';

import { ExampleImports } from './example.component';

/** shadcn/ui's `slider-example`, in zard. */
@Component({
  selector: 'z-slider-example',
  imports: [ExampleImports, ZardFieldImports, ZardSliderComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <z-example-wrapper>
      <z-example zTitle="Basic">
        <z-slider class="w-full" [zDefault]="[50]" zMax="100" zStep="1" />
      </z-example>

      <z-example zTitle="Range">
        <z-slider class="w-full" [zDefault]="[25, 50]" zMax="100" zStep="5" />
      </z-example>

      <z-example zTitle="Multiple Thumbs">
        <z-slider class="w-full" [zDefault]="[10, 20, 70]" zMax="100" zStep="10" />
      </z-example>

      <z-example zTitle="Vertical">
        <div class="flex items-center gap-6">
          <z-slider class="h-40" [zDefault]="[50]" zMax="100" zStep="1" zOrientation="vertical" />
          <z-slider class="h-40" [zDefault]="[25]" zMax="100" zStep="1" zOrientation="vertical" />
        </div>
      </z-example>

      <z-example zTitle="Controlled">
        <div class="grid w-full gap-3">
          <div class="flex items-center justify-between gap-2">
            <label z-field-label for="slider-demo-temperature">Temperature</label>
            <span class="text-muted-foreground text-sm">{{ temperature().join(', ') }}</span>
          </div>
          <z-slider
            id="slider-demo-temperature"
            class="w-full"
            zMin="0"
            zMax="1"
            zStep="0.1"
            [zValue]="temperature()"
            (zSlideIndexChange)="onTemperature($event)"
          />
        </div>
      </z-example>

      <z-example zTitle="Disabled">
        <z-slider class="w-full" [zDefault]="[50]" zMax="100" zStep="1" zDisabled />
      </z-example>
    </z-example-wrapper>
  `,
})
export class SliderExampleComponent {
  protected readonly temperature = signal([0.3, 0.7]);

  protected onTemperature(value: number[]): void {
    // The slider reports raw floats; shadcn shows them on its 0.1 step.
    this.temperature.set(value.map(v => Math.round(v * 10) / 10));
  }
}
