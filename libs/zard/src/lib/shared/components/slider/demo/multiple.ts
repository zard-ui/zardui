import { Component } from '@angular/core';

import { ZardSliderComponent } from '../slider.component';

@Component({
  selector: 'z-demo-slider-multiple',
  imports: [ZardSliderComponent],
  template: `
    <div class="flex min-h-50 w-full items-center justify-center p-10">
      <z-slider class="mx-auto w-full max-w-xs" [zDefault]="[10, 20, 70]" />
    </div>
  `,
})
export class ZardDemoSliderMultipleComponent {}
