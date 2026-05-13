import { Component } from '@angular/core';

import { ZardSliderComponent } from '../slider.component';

@Component({
  selector: 'z-demo-slider-min-max',
  imports: [ZardSliderComponent],
  template: `
    <div class="flex min-h-50 w-full items-center justify-center p-10">
      <z-slider class="mx-auto w-full max-w-xs" zStep="10" zMin="30" zMax="120" />
    </div>
  `,
  host: {
    '[style.width]': '"inherit"',
  },
})
export class ZardDemoSliderMinMaxComponent {}
