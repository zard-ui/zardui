```angular-ts showLineNumbers copyButton
import { Component } from '@angular/core';

import { ZardDividerComponent } from '../divider.component';

@Component({
  selector: 'z-demo-divider-vertical',
  standalone: true,
  imports: [ZardDividerComponent],
  template: `
    <div class="h-20 flex">
      <p>Left</p>
      <z-divider zOrientation="vertical"></z-divider>
      <p>Right</p>
    </div>
  `,
})
export class ZardDemoDividerVerticalComponent {}

```