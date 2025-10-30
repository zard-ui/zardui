import { Component } from '@angular/core';

import { ZardSliderComponent } from '../slider.component';

@Component({
  selector: 'z-demo-slider-min-max',
  standalone: true,
  imports: [ZardSliderComponent],
  template: `
    <div class="preview flex min-h-[350px] w-full items-center justify-center p-10">
      <z-slider [class]="'w-[60%]'" zStep="10" zMin="30" zMax="120" />
    </div>
  `,
})
export class ZardDemoSliderMinMaxComponent {}
