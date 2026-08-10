import { Component, ChangeDetectionStrategy, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { ZardFieldImports } from '@zard/components/field/field.imports';
import { ZardSliderComponent } from '@zard/components/slider/slider.component';

@Component({
  selector: 'z-block-field-slider',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ZardFieldImports, ZardSliderComponent, FormsModule],
  template: `
    <div class="w-full max-w-md">
      <div z-field>
        <label z-field-label for="block-field-slider">Price Range</label>
        <p z-field-description>Set your budget range (\${{ sliderValue() }} - $800).</p>
        <z-slider
          id="block-field-slider"
          class="flex-1"
          [zMin]="0"
          [zMax]="800"
          [ngModel]="sliderValue()"
          (ngModelChange)="sliderValue.set($event)"
        />
      </div>
    </div>
  `,
})
export class BlockFieldSliderComponent {
  readonly sliderValue = signal(50);
}
