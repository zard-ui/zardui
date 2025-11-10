import { Component } from '@angular/core';

import { ZardIconComponent } from '../../icon/icon.component';
import { ZardToggleComponent } from '../toggle.component';

@Component({
  selector: 'z-demo-toggle-disabled',
  standalone: true,
  imports: [ZardToggleComponent, ZardIconComponent],
  template: `
    <z-toggle zAriaLabel="Toggle disabled" zDisabled>
      <z-icon zType="bold" />
    </z-toggle>
  `,
})
export class ZardDemoToggleDisabledComponent {}
