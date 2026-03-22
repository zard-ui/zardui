```angular-ts showLineNumbers copyButton
import { Component } from '@angular/core';

import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideMinus, lucidePlus } from '@ng-icons/lucide';

import { ZardButtonComponent } from '../../button/button.component';
import { ZardButtonGroupComponent } from '../button-group.component';

@Component({
  selector: 'z-demo-button-group-orientation',
  imports: [ZardButtonGroupComponent, ZardButtonComponent, NgIcon],
  template: `
    <z-button-group zOrientation="vertical">
      <button type="button" z-button zType="outline"><ng-icon name="lucidePlus" /></button>
      <button type="button" z-button zType="outline"><ng-icon name="lucideMinus" /></button>
    </z-button-group>
  `,
  viewProviders: [provideIcons({ lucidePlus, lucideMinus })],
})
export class ZardDemoButtonGroupOrientationComponent {}

```