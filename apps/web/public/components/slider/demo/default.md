```angular-ts showLineNumbers copyButton
import { Component } from '@angular/core';

import { ZardSliderComponent } from '../slider.component';

@Component({
  selector: 'z-demo-slider-default',
  imports: [ZardSliderComponent],
  template: `
    <div class="flex min-h-87.5 w-full items-center justify-center p-10">
      <z-slider class="w-[60%]" zDefault="50" />
    </div>
  `,
})
export class ZardDemoSliderDefaultComponent {}

```