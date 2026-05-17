import { Component } from '@angular/core';

import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucidePlus } from '@ng-icons/lucide';

import { ZardButtonComponent } from '@/shared/components/button/button.component';
import {
  ZardButtonGroupComponent,
  ZardButtonGroupDividerComponent,
} from '@/shared/components/button-group/button-group.component';

@Component({
  selector: 'z-demo-button-group-split',
  imports: [ZardButtonGroupComponent, ZardButtonGroupDividerComponent, ZardButtonComponent, NgIcon],
  template: `
    <z-button-group>
      <button type="button" z-button zType="secondary">Button</button>
      <z-button-group-divider />
      <button type="button" z-button zType="secondary" zSize="icon" aria-label="Add">
        <ng-icon name="lucidePlus" />
      </button>
    </z-button-group>
  `,
  viewProviders: [provideIcons({ lucidePlus })],
})
export class ZardDemoButtonGroupSplitComponent {}
