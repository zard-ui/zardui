```angular-ts showLineNumbers copyButton
import { Component } from '@angular/core';

import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideArrowLeft, lucideArrowRight } from '@ng-icons/lucide';

import { ZardButtonComponent } from '../../button/button.component';
import { ZardButtonGroupComponent } from '../button-group.component';

@Component({
  selector: 'z-demo-button-group-nested',
  imports: [ZardButtonGroupComponent, ZardButtonComponent, NgIcon],
  template: `
    <z-button-group>
      <z-button-group>
        <button type="button" z-button zSize="sm" zType="outline">1</button>
        <button type="button" z-button zSize="sm" zType="outline">2</button>
        <button type="button" z-button zSize="sm" zType="outline">3</button>
        <button type="button" z-button zSize="sm" zType="outline">4</button>
        <button type="button" z-button zSize="sm" zType="outline">5</button>
        <button type="button" z-button zSize="sm" zType="outline">6</button>
      </z-button-group>

      <z-button-group>
        <button type="button" z-button zSize="sm" zType="outline"><ng-icon name="lucideArrowLeft" /></button>
        <button type="button" z-button zSize="sm" zType="outline"><ng-icon name="lucideArrowRight" /></button>
      </z-button-group>
    </z-button-group>
  `,
  viewProviders: [provideIcons({ lucideArrowLeft, lucideArrowRight })],
})
export class ZardDemoButtonGroupNestedComponent {}

```