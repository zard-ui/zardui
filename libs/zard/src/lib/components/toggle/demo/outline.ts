import { Component } from '@angular/core';

import { ZardIconComponent } from '../../icon/icon.component';
import { ZardToggleComponent } from '../toggle.component';

@Component({
  selector: 'z-demo-toggle-outline',
  standalone: true,
  imports: [ZardToggleComponent, ZardIconComponent],
  template: `
    <z-toggle aria-label="Toggle outline" zType="outline">
      <z-icon zType="bold" />
    </z-toggle>
  `,
})
export class ZardDemoToggleOutlineComponent {}
