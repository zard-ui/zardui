```angular-ts showLineNumbers copyButton
import { Component } from '@angular/core';

import { ZardButtonComponent } from '@ngzard/ui/button';
import { ZardButtonGroupComponent, ZardButtonGroupDividerComponent } from '@ngzard/ui/button-group';

@Component({
  selector: 'z-demo-button-group-divider',
  imports: [ZardButtonGroupComponent, ZardButtonComponent, ZardButtonGroupDividerComponent],
  template: `
    <z-button-group>
      <button z-button zSize="sm" zType="secondary">Copy</button>
      <z-button-group-divider />
      <button z-button zSize="sm" zType="secondary">Paste</button>
    </z-button-group>
  `,
})
export class ZardDemoButtonGroupDividerComponent {}

```