```angular-ts showLineNumbers copyButton
import { Component, signal } from '@angular/core';

import { ZardSwitchComponent } from '../switch.component';

@Component({
  selector: 'z-demo-switch-basic',
  imports: [ZardSwitchComponent],
  template: `
    <z-switch [(zChecked)]="checked" />
    <z-switch zType="destructive">Destructive</z-switch>
  `,
  styles: `
    :host {
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      gap: 24px;
    }
  `,
})
export class ZardDemoSwitchBasicComponent {
  readonly checked = signal(false);
}

```