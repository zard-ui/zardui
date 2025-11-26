```angular-ts showLineNumbers copyButton
import { Component } from '@angular/core';

import { ZardIconComponent } from '@ngzard/ui/icon';
import { ZardToggleComponent } from '@ngzard/ui/toggle';

@Component({
  selector: 'z-demo-toggle-with-text',
  imports: [ZardToggleComponent, ZardIconComponent],
  standalone: true,
  template: `
    <z-toggle>
      <z-icon zType="italic" />
      Italic
    </z-toggle>
  `,
})
export class ZardDemoToggleWithTextComponent {}

```