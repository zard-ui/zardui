import { Component } from '@angular/core';

import { ZardButtonComponent } from '../../button/button.component';
import { ZardIconComponent } from '../../icon/icon.component';
import { ZardButtonGroupComponent } from '../button-group.component';

@Component({
  selector: 'z-demo-button-group-size',
  imports: [ZardButtonGroupComponent, ZardButtonComponent, ZardIconComponent],
  template: `
    <z-button-group>
      <button z-button zType="outline" zSize="sm">Small</button>
      <button z-button zType="outline" zSize="sm">Group</button>
      <button z-button zType="outline" zSize="sm"><i z-icon zType="plus"></i></button>
    </z-button-group>

    <z-button-group>
      <button z-button zType="outline">Default</button>
      <button z-button zType="outline">Group</button>
      <button z-button zType="outline"><i z-icon zType="plus"></i></button>
    </z-button-group>

    <z-button-group>
      <button z-button zType="outline" zSize="lg">Large</button>
      <button z-button zType="outline" zSize="lg">Group</button>
      <button z-button zType="outline" zSize="lg"><i z-icon zType="plus"></i></button>
    </z-button-group>
  `,
  host: {
    class: 'flex flex-col items-start gap-4',
  },
})
export class ZardDemoButtonGroupSizeComponent {}
