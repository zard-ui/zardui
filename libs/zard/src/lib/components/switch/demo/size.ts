import { Component } from '@angular/core';

import { ZardSwitchComponent } from '../switch.component';

@Component({
  selector: 'z-demo-switch-size',
  standalone: true,
  imports: [ZardSwitchComponent],
  template: `
    <z-switch zSize="sm">Small</z-switch>
    <z-switch>Default</z-switch>
    <z-switch zSize="lg">Large</z-switch>
  `,
})
export class ZardDemoSwitchSizeComponent {}
