```angular-ts showLineNumbers copyButton
import { Component } from '@angular/core';

import { ZardIconComponent } from '@ngzard/ui/icon';
import { ZardToggleComponent } from '@ngzard/ui/toggle';

@Component({
  selector: 'z-demo-toggle-large',
  imports: [ZardToggleComponent, ZardIconComponent],
  standalone: true,
  template: `
    <z-toggle aria-label="Toggle large" zSize="lg">
      <z-icon zType="bold" />
    </z-toggle>
  `,
})
export class ZardDemoToggleLargeComponent {}

```