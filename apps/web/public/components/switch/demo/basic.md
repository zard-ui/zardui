```angular-ts showLineNumbers copyButton
import { Component } from '@angular/core';

import { ZardSwitchComponent } from '../switch.component';

@Component({
  selector: 'z-demo-switch-basic',
  standalone: true,
  imports: [ZardSwitchComponent],
  template: `
    <z-switch />
    <z-switch zType="destructive">Destructive</z-switch>
  `,
  styles: [
    `
      :host {
        display: flex;
        flex-wrap: wrap;
        align-items: center;
        gap: 24px;
      }
    `,
  ],
})
export class ZardDemoSwitchBasicComponent {}

```
