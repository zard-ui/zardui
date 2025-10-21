import { Component } from '@angular/core';

import { ZardToggleComponent } from '../toggle.component';
import { ZardIconComponent } from '../../icon/icon.component';

@Component({
  standalone: true,
  imports: [ZardToggleComponent, ZardIconComponent],
  template: `
    <z-toggle aria-label="With default" [zDefault]="true">
      <div z-icon zType="Bold"></div>
    </z-toggle>
  `,
})
export class ZardDemoToggleWithDefaultComponent {}
