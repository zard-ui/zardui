import { Component } from '@angular/core';

import { ZardIconComponent } from '../../icon/icon.component';
import { ZardToggleComponent } from '../toggle.component';

@Component({
  selector: 'z-demo-toggle-with-default',
  standalone: true,
  imports: [ZardToggleComponent, ZardIconComponent],
  template: `
    <z-toggle zAriaLabel="With default" [zDefault]="true">
      <z-icon zType="bold" />
    </z-toggle>
  `,
})
export class ZardDemoToggleWithDefaultComponent {}
