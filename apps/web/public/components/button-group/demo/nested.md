```angular-ts showLineNumbers copyButton
import { Component } from '@angular/core';

import { ZardButtonComponent } from '@ngzard/ui/button';
import { ZardButtonGroupComponent } from '@ngzard/ui/button-group';
import { ZardIconComponent } from '@ngzard/ui/icon';

@Component({
  selector: 'z-demo-button-group-nested',
  imports: [ZardButtonGroupComponent, ZardButtonComponent, ZardIconComponent],
  template: `
    <z-button-group>
      <z-button-group>
        <button z-button zSize="sm" zType="outline">1</button>
        <button z-button zSize="sm" zType="outline">2</button>
        <button z-button zSize="sm" zType="outline">3</button>
        <button z-button zSize="sm" zType="outline">4</button>
        <button z-button zSize="sm" zType="outline">5</button>
        <button z-button zSize="sm" zType="outline">6</button>
      </z-button-group>

      <z-button-group>
        <button z-button zSize="sm" zType="outline"><i z-icon zType="arrow-left"></i></button>
        <button z-button zSize="sm" zType="outline"><i z-icon zType="arrow-right"></i></button>
      </z-button-group>
    </z-button-group>
  `,
})
export class ZardDemoButtonGroupNestedComponent {}

```