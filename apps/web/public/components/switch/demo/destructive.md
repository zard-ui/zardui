```angular-ts showLineNumbers copyButton
import { Component } from '@angular/core';

import { ZardSwitchComponent } from '@ngzard/ui/switch';

@Component({
  selector: 'z-demo-switch-destructive',
  imports: [ZardSwitchComponent],
  standalone: true,
  template: `
    <z-switch zType="destructive" />
  `,
})
export class ZardDemoSwitchDestructiveComponent {}

```