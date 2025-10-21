import { Component } from '@angular/core';

import { ZardToggleComponent } from '../toggle.component';
import { ZardIconComponent } from '../../icon/icon.component';

@Component({
  standalone: true,
  imports: [ZardToggleComponent, ZardIconComponent],
  template: `
    <z-toggle>
      <div z-icon zType="Italic"></div>
      Italic
    </z-toggle>
  `,
})
export class ZardDemoToggleWithTextComponent {}
