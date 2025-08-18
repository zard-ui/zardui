import { Component } from '@angular/core';

import { ZardSliderComponent } from '../slider.component';

@Component({
  standalone: true,
  imports: [ZardSliderComponent],
  template: `
    <div class="preview flex min-h-[350px] w-full justify-center p-10 items-center">
      <z-slider [class]="'w-[60%]'" zStep="10" zMin="30" zMax="120" />
    </div>
  `,
})
export class ZardDemoSliderMinMaxComponent {}
