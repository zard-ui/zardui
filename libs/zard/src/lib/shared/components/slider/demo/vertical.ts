import { Component } from '@angular/core';

import { ZardSliderComponent } from '../slider.component';

@Component({
  selector: 'z-demo-slider-vertical',
  imports: [ZardSliderComponent],
  template: `
    <div class="flex h-50 w-full items-center justify-center">
      <div class="flex h-full w-20 justify-center gap-6">
        <z-slider [zDefault]="[50]" zOrientation="vertical" />
        <z-slider [zDefault]="[25]" zOrientation="vertical" />
      </div>
    </div>
  `,
})
export class ZardDemoSliderVerticalComponent {}
