```angular-ts showLineNumbers copyButton
import { Component } from '@angular/core';

import { ZardSliderComponent } from '../slider.component';

@Component({
  selector: 'z-demo-slider-vertical',
  standalone: true,
  imports: [ZardSliderComponent],
  template: `
    <div class="preview flex h-[350px] w-full items-center justify-center p-10">
      <z-slider [class]="'w-[60%]'" zDefault="100" zMin="30" zMax="120" zOrientation="vertical" />
    </div>
  `,
})
export class ZardDemoSliderVerticalComponent {}

```