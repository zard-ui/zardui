```angular-ts showLineNumbers copyButton
import { Component } from '@angular/core';

import { NgIcon, provideIcons } from '@ng-icons/core';

import { zardPlusIcon } from '../../../core/icons-registry';
import { ZardButtonComponent } from '../../button/button.component';
import { ZardButtonGroupComponent } from '../button-group.component';

@Component({
  selector: 'z-demo-button-group-size',
  imports: [ZardButtonGroupComponent, ZardButtonComponent, NgIcon],
  template: `
    <z-button-group>
      <button z-button zType="outline" zSize="sm">Small</button>
      <button z-button zType="outline" zSize="sm">Group</button>
      <button z-button zType="outline" zSize="sm"><ng-icon name="plus" /></button>
    </z-button-group>

    <z-button-group>
      <button z-button zType="outline">Default</button>
      <button z-button zType="outline">Group</button>
      <button z-button zType="outline"><ng-icon name="plus" /></button>
    </z-button-group>

    <z-button-group>
      <button z-button zType="outline" zSize="lg">Large</button>
      <button z-button zType="outline" zSize="lg">Group</button>
      <button z-button zType="outline" zSize="lg"><ng-icon name="plus" /></button>
    </z-button-group>
  `,
  viewProviders: [provideIcons({ plus: zardPlusIcon })],
  host: {
    class: 'flex flex-col items-start gap-4',
  },
})
export class ZardDemoButtonGroupSizeComponent {}

```