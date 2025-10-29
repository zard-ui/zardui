```angular-ts showLineNumbers copyButton
import { Component } from '@angular/core';

import { ZardSwitchComponent } from '../switch.component';

@Component({
  selector: 'z-demo-switch-destructive',
  standalone: true,
  imports: [ZardSwitchComponent],
  template: ` <z-switch zType="destructive" /> `,
})
export class ZardDemoSwitchDestructiveComponent {}

```