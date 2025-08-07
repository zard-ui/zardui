```angular-ts showLineNumbers
import { Component } from '@angular/core';

import { ZardSwitchComponent } from '../switch.component';

@Component({
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