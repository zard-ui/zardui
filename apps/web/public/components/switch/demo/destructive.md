```angular-ts showLineNumbers
import { Component } from '@angular/core';

import { ZardSwitchComponent } from '../switch.component';

@Component({
  standalone: true,
  imports: [ZardSwitchComponent],
  template: ` <z-switch zType="destructive" /> `,
})
export class ZardDemoSwitchDestructiveComponent {}

```