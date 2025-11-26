```angular-ts showLineNumbers copyButton
import { Component } from '@angular/core';

import { ZardDividerComponent } from '@ngzard/ui/divider';

@Component({
  selector: 'z-demo-divider-default',
  imports: [ZardDividerComponent],
  standalone: true,
  template: `
    <div class="flex flex-col">
      <p>Before divider</p>
      <z-divider />
      <p>After divider</p>
    </div>
  `,
})
export class ZardDemoDividerDefaultComponent {}

```