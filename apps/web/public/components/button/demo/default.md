```angular-ts showLineNumbers copyButton
import { Component } from '@angular/core';

import { ZardButtonComponent } from '@ngzard/ui/button';
import { ZardIconComponent } from '@ngzard/ui/icon';

@Component({
  selector: 'z-demo-button-default',
  imports: [ZardButtonComponent, ZardIconComponent],
  standalone: true,
  template: `
    <button z-button zType="outline">Button</button>
    <button z-button zType="outline"><i z-icon zType="arrow-up"></i></button>
    <button z-button zType="outline">
      Button
      <i z-icon zType="popcorn"></i>
    </button>
  `,
})
export class ZardDemoButtonDefaultComponent {}

```