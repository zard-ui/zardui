import { Component } from '@angular/core';

import { ZardIconComponent } from '@ngzard/ui/icon';

import { ZardToggleComponent } from '../toggle.component';

@Component({
  selector: 'z-demo-toggle-small',
  imports: [ZardToggleComponent, ZardIconComponent],
  standalone: true,
  template: `
    <z-toggle aria-label="Toggle small" zSize="sm">
      <z-icon zType="bold" />
    </z-toggle>
  `,
})
export class ZardDemoToggleSmallComponent {}
