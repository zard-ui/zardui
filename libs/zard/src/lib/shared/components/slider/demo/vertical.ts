import { Component } from '@angular/core';

import { ZardSliderComponent } from '../slider.component';

@Component({
  selector: 'z-demo-slider-vertical',
  imports: [ZardSliderComponent],
  template: `
    <div class="flex h-87.5 w-full items-center justify-center p-10">
      <z-slider class="mx-auto w-full max-w-xs" [zDefault]="100" zMin="30" zMax="120" zOrientation="vertical" />
    </div>
  `,
  host: {
    '[style.width]': '"inherit"',
  },
})
export class ZardDemoSliderVerticalComponent {}
