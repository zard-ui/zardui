```angular-ts showLineNumbers copyButton
import { Component } from '@angular/core';

import { ZardSwitchComponent } from '../switch.component';

@Component({
  selector: 'zard-demo-switch',
  imports: [ZardSwitchComponent],
  standalone: true,
  template: ` <z-switch /> `,
})
export class ZardDemoSwitchDefaultComponent {}

```