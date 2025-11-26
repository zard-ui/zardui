```angular-ts showLineNumbers copyButton
import { Component } from '@angular/core';

import { ZardSliderComponent } from '@ngzard/ui/slider';

@Component({
  selector: 'z-demo-slider-default',
  imports: [ZardSliderComponent],
  standalone: true,
  template: `
    <div class="preview flex min-h-[350px] w-full items-center justify-center p-10">
      <z-slider class="w-[60%]" zDefault="50" />
    </div>
  `,
})
export class ZardDemoSliderDefaultComponent {}

```