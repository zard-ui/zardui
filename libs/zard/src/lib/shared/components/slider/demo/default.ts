import { Component } from '@angular/core';

import { ZardSliderComponent } from '../slider.component';

@Component({
  selector: 'z-demo-slider-default',
  imports: [ZardSliderComponent],
  template: `
    <div class="flex min-h-50 w-full items-center p-10">
      <z-slider class="mx-auto w-full max-w-xs" [zDefault]="[75]" />
    </div>
  `,
})
export class ZardDemoSliderDefaultComponent {}
