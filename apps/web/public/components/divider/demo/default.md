```angular-ts showLineNumbers copyButton
import { Component } from '@angular/core';

import { ZardDividerComponent } from '../divider.component';

@Component({
  selector: 'z-demo-divider-default',
  standalone: true,
  imports: [ZardDividerComponent],
  template: `
    <div class="flex flex-col">
      <p>Before divider</p>
      <z-divider></z-divider>
      <p>After divider</p>
    </div>
  `,
})
export class ZardDemoDividerDefaultComponent {}

```