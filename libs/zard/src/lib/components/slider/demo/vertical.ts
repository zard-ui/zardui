import { Component } from '@angular/core';

import { ZardSliderComponent } from '../slider.component';

@Component({
  standalone: true,
  imports: [ZardSliderComponent],
  template: `
    <div class="preview flex h-[350px] w-full justify-center p-10 items-center">
      <z-slider [class]="'w-[60%]'" zDefault="100" zMin="30" zMax="120" zOrientation="vertical" />
    </div>
  `,
})
export class ZardDemoSliderVerticalComponent {}
