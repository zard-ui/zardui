import { Component } from '@angular/core';

import { ZardToggleComponent } from '../toggle.component';
import { ZardIconComponent } from '../../icon/icon.component';

@Component({
  standalone: true,
  imports: [ZardToggleComponent, ZardIconComponent],
  template: `
    <z-toggle aria-label="Toggle disabled" disabled>
      <div z-icon zType="Bold"></div>
    </z-toggle>
  `,
})
export class ZardDemoToggleDisabledComponent {}
