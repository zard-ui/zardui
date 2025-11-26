```angular-ts showLineNumbers copyButton
import { Component } from '@angular/core';

import { ZardButtonComponent } from '@ngzard/ui/button';
import { ZardButtonGroupComponent } from '@ngzard/ui/button-group';
import { ZardIconComponent } from '@ngzard/ui/icon';
import { ZardInputDirective } from '@ngzard/ui/input';

@Component({
  selector: 'z-demo-button-group-input',
  imports: [ZardButtonGroupComponent, ZardButtonComponent, ZardIconComponent, ZardInputDirective],
  template: `
    <z-button-group>
      <input z-input placeholder="Search..." />
      <button z-button zType="outline"><i z-icon zType="search"></i></button>
    </z-button-group>
  `,
})
export class ZardDemoButtonGroupInputComponent {}

```