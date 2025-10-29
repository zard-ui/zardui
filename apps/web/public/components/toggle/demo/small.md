```angular-ts showLineNumbers copyButton
import { Component } from '@angular/core';

import { ZardIconComponent } from '../../icon/icon.component';
import { ZardToggleComponent } from '../toggle.component';

@Component({
  selector: 'z-demo-toggle-small',
  standalone: true,
  imports: [ZardToggleComponent, ZardIconComponent],
  template: `
    <z-toggle aria-label="Toggle small" zSize="sm">
      <z-icon zType="bold" />
    </z-toggle>
  `,
})
export class ZardDemoToggleSmallComponent {}

```