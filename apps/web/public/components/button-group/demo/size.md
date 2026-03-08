```angular-ts showLineNumbers copyButton
import { Component } from '@angular/core';

import { NgIcon, provideIcons } from '@ng-icons/core';

import { ZardButtonComponent } from '@/shared/components/button/button.component';
import { ZardButtonGroupComponent } from '@/shared/components/button-group/button-group.component';
import { ZardIconRegistry } from '@/shared/core';

@Component({
  selector: 'z-demo-button-group-size',
  imports: [ZardButtonGroupComponent, ZardButtonComponent, NgIcon],
  template: `
    <z-button-group>
      <button type="button" z-button zType="outline" zSize="sm">Small</button>
      <button type="button" z-button zType="outline" zSize="sm">Group</button>
      <button type="button" z-button zType="outline" zSize="sm"><ng-icon name="plus" /></button>
    </z-button-group>

    <z-button-group>
      <button type="button" z-button zType="outline">Default</button>
      <button type="button" z-button zType="outline">Group</button>
      <button type="button" z-button zType="outline"><ng-icon name="plus" /></button>
    </z-button-group>

    <z-button-group>
      <button type="button" z-button zType="outline" zSize="lg">Large</button>
      <button type="button" z-button zType="outline" zSize="lg">Group</button>
      <button type="button" z-button zType="outline" zSize="lg"><ng-icon name="plus" /></button>
    </z-button-group>
  `,
  viewProviders: [provideIcons({ plus: ZardIconRegistry.plus })],
  host: {
    class: 'flex flex-col items-start gap-4',
  },
})
export class ZardDemoButtonGroupSizeComponent {}

```