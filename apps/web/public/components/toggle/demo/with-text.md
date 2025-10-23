```angular-ts showLineNumbers copyButton
import { Component } from '@angular/core';

import { ZardIconComponent } from '../../icon/icon.component';
import { ZardToggleComponent } from '../toggle.component';

@Component({
  standalone: true,
  imports: [ZardToggleComponent, ZardIconComponent],
  template: `
    <z-toggle>
      <z-icon zType="italic" />
      Italic
    </z-toggle>
  `,
})
export class ZardDemoToggleWithTextComponent {}

```