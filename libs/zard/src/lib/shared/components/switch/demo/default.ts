import { Component } from '@angular/core';

import { ZardSwitchComponent } from '../switch.component';

@Component({
  selector: 'zard-demo-switch',
  imports: [ZardSwitchComponent],
  template: `
    <z-switch />
  `,
})
export class ZardDemoSwitchDefaultComponent {}
