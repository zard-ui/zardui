import { Component } from '@angular/core';

import { ZardButtonComponent } from '../../button/button.component';
import { ZardIconComponent } from '../../icon/icon.component';
import { ZardButtonGroupComponent } from '../button-group.component';

@Component({
  selector: 'z-demo-button-group-default',
  imports: [ZardButtonGroupComponent, ZardButtonComponent, ZardIconComponent],
  template: `
    <z-button-group>
      <button z-button>Button</button>
      <button z-button zType="outline"><i z-icon zType="arrow-up"></i></button>
    </z-button-group>
  `,
})
export class ZardDemoButtonGroupDefaultComponent {}
