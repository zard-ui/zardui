import { Component } from '@angular/core';

import { ZardButtonComponent } from '../../button/button.component';
import { ZardButtonGroupComponent, ZardButtonGroupDividerComponent } from '../button-group.component';

@Component({
  selector: 'z-demo-button-group-divider',
  imports: [ZardButtonGroupComponent, ZardButtonComponent, ZardButtonGroupDividerComponent],
  template: `
    <z-button-group>
      <button z-button zType="secondary">Copy</button>
      <z-button-group-divider />
      <button z-button zType="secondary">Paste</button>
    </z-button-group>
  `,
})
export class ZardDemoButtonGroupDividerComponent {}
