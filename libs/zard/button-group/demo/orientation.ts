import { Component } from '@angular/core';

import { ZardButtonComponent } from '../../button/button.component';
import { ZardIconComponent } from '../../icon/icon.component';
import { ZardButtonGroupComponent } from '../button-group.component';

@Component({
  selector: 'z-demo-button-group-orientation',
  imports: [ZardButtonGroupComponent, ZardButtonComponent, ZardIconComponent],
  template: `
    <z-button-group zOrientation="vertical">
      <button z-button zType="outline"><i z-icon zType="plus"></i></button>
      <button z-button zType="outline"><i z-icon zType="minus"></i></button>
    </z-button-group>
  `,
})
export class ZardDemoButtonGroupOrientationComponent {}
