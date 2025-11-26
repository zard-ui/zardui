import { Component } from '@angular/core';

import { ZardSwitchComponent } from '@ngzard/ui/switch';

@Component({
  selector: 'zard-demo-switch',
  imports: [ZardSwitchComponent],
  standalone: true,
  template: `
    <z-switch />
  `,
})
export class ZardDemoSwitchDefaultComponent {}
