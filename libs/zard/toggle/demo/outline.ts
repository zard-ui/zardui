import { Component } from '@angular/core';

import { ZardIconComponent } from '@ngzard/ui/icon';
import { ZardToggleComponent } from '@ngzard/ui/toggle';

@Component({
  selector: 'z-demo-toggle-outline',
  imports: [ZardToggleComponent, ZardIconComponent],
  standalone: true,
  template: `
    <z-toggle aria-label="Toggle outline" zType="outline">
      <z-icon zType="bold" />
    </z-toggle>
  `,
})
export class ZardDemoToggleOutlineComponent {}
