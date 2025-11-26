import { Component } from '@angular/core';

import { ZardIconComponent } from '@ngzard/ui/icon';

import { ZardToggleComponent } from '../toggle.component';

@Component({
  selector: 'z-demo-toggle-with-default',
  imports: [ZardToggleComponent, ZardIconComponent],
  standalone: true,
  template: `
    <z-toggle aria-label="With default" [zDefault]="true">
      <z-icon zType="bold" />
    </z-toggle>
  `,
})
export class ZardDemoToggleWithDefaultComponent {}
