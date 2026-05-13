import { Component } from '@angular/core';

import { ZardSliderComponent } from '../slider.component';

@Component({
  selector: 'z-demo-slider-range',
  imports: [ZardSliderComponent],
  template: `
    <div class="flex min-h-50 w-full items-center p-10">
      <z-slider class="mx-auto w-full max-w-xs" [zDefault]="[25, 50]" />
    </div>
  `,
  host: {
    '[style.width]': '"inherit"',
  },
})
export class ZardDemoSliderRangeComponent {}
