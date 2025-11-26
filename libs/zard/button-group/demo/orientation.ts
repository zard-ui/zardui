import { Component } from '@angular/core';

import { ZardButtonComponent } from '@ngzard/ui/button';
import { ZardIconComponent } from '@ngzard/ui/icon';

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
