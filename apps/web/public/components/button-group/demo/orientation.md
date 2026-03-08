```angular-ts showLineNumbers copyButton
import { Component } from '@angular/core';

import { NgIcon, provideIcons } from '@ng-icons/core';

import { ZardIconRegistry } from '@/shared/core';

import { ZardButtonComponent } from '../../button/button.component';
import { ZardButtonGroupComponent } from '../button-group.component';

@Component({
  selector: 'z-demo-button-group-orientation',
  imports: [ZardButtonGroupComponent, ZardButtonComponent, NgIcon],
  template: `
    <z-button-group zOrientation="vertical">
      <button type="button" z-button zType="outline"><ng-icon name="plus" /></button>
      <button type="button" z-button zType="outline"><ng-icon name="minus" /></button>
    </z-button-group>
  `,
  viewProviders: [provideIcons({ plus: ZardIconRegistry.plus, minus: ZardIconRegistry.minus })],
})
export class ZardDemoButtonGroupOrientationComponent {}

```