import { ChangeDetectionStrategy, Component, signal } from '@angular/core';

import { ZardFieldImports } from '@/shared/components/field/field.imports';
import { ZardSliderComponent } from '@/shared/components/slider/slider.component';

@Component({
  selector: 'z-demo-field-slider',
  imports: [...ZardFieldImports, ZardSliderComponent],
  template: `
    <div class="w-full min-w-md">
      <div z-field>
        <div z-field-title>Volume</div>
        <p z-field-description>
          Set the playback volume (
          <span class="font-medium tabular-nums">{{ value() }}</span>
          %).
        </p>
        <z-slider
          class="mt-2 w-full"
          aria-label="Volume"
          [zDefault]="value()"
          [zMin]="0"
          [zMax]="100"
          [zStep]="1"
          (zSlideIndexChange)="value.set($event)"
        />
      </div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ZardDemoFieldSliderComponent {
  protected readonly value = signal(40);
}
