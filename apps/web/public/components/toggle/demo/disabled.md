```angular-ts showLineNumbers copyButton
import { Component } from '@angular/core';

import { ZardIconComponent } from '../../icon/icon.component';
import { ZardToggleComponent } from '../toggle.component';

@Component({
  selector: 'z-demo-toggle-disabled',
  imports: [ZardToggleComponent, ZardIconComponent],
  standalone: true,
  template: `
    <z-toggle aria-label="Toggle disabled" disabled>
      <z-icon zType="bold" />
    </z-toggle>
  `,
})
export class ZardDemoToggleDisabledComponent {}

```