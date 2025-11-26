import { Component } from '@angular/core';

import { ZardSwitchComponent } from '@ngzard/ui/switch';

@Component({
  selector: 'z-demo-switch-basic',
  imports: [ZardSwitchComponent],
  standalone: true,
  template: `
    <z-switch />
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
export class ZardDemoSwitchBasicComponent {}
