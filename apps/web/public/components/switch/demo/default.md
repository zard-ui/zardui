```angular-ts showLineNumbers
import { Component } from '@angular/core';

import { ZardSwitchComponent } from '../switch.component';

@Component({
  standalone: true,
  imports: [ZardSwitchComponent],
  template: ` <z-switch /> `,
})
export class ZardDemoSwitchDefaultComponent {}

```