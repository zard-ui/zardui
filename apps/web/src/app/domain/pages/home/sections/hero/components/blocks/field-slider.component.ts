import { Component, ChangeDetectionStrategy } from '@angular/core';
import { FormsModule } from '@angular/forms';

import {
  ZardFormFieldComponent,
  ZardFormLabelComponent,
  ZardFormControlComponent,
} from '@zard/components/form/form.component';
import { ZardSliderComponent } from '@zard/components/slider/slider.component';

@Component({
  selector: 'z-block-field-slider',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ZardFormFieldComponent, ZardFormLabelComponent, ZardFormControlComponent, ZardSliderComponent, FormsModule],
  template: `
    <div class="w-full max-w-md">
      <z-form-field>
        <label z-form-label>Price Range</label>
        <p class="text-muted-foreground text-sm leading-normal font-normal">
          Set your budget range (\${{ sliderValue }} - $800).
        </p>
        <z-form-control>
          <z-slider [zMin]="0" [zMax]="800" [(ngModel)]="sliderValue" class="flex-1" />
        </z-form-control>
      </z-form-field>
    </div>
  `,
})
export class BlockFieldSliderComponent {
  sliderValue = 50;
}
