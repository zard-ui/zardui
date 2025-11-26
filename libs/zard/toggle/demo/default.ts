import { Component } from '@angular/core';

import { ZardIconComponent } from '@ngzard/ui/icon';
import { ZardToggleComponent } from '@ngzard/ui/toggle';

@Component({
  selector: 'z-demo-toggle-default',
  imports: [ZardToggleComponent, ZardIconComponent],
  standalone: true,
  template: `
    <z-toggle aria-label="Default toggle">
      <z-icon zType="bold" />
    </z-toggle>
  `,
})
export class ZardDemoToggleDefaultComponent {}
