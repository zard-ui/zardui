import { Component } from '@angular/core';

import { ZardIconComponent } from '../../icon/icon.component';
import { ZardToggleComponent } from '../toggle.component';

@Component({
  selector: 'z-demo-toggle-large',
  standalone: true,
  imports: [ZardToggleComponent, ZardIconComponent],
  template: `
    <z-toggle aria-label="Toggle large" zSize="lg">
      <z-icon zType="bold" />
    </z-toggle>
  `,
})
export class ZardDemoToggleLargeComponent {}
