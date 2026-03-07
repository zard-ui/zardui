import { Component } from '@angular/core';

import { NgIcon, provideIcons } from '@ng-icons/core';

import { zardMinusIcon, zardPlusIcon } from '../../../core/icons-registry';
import { ZardButtonComponent } from '../../button/button.component';
import { ZardButtonGroupComponent } from '../button-group.component';

@Component({
  selector: 'z-demo-button-group-orientation',
  imports: [ZardButtonGroupComponent, ZardButtonComponent, NgIcon],
  template: `
    <z-button-group zOrientation="vertical">
      <button z-button zType="outline"><ng-icon name="plus" /></button>
      <button z-button zType="outline"><ng-icon name="minus" /></button>
    </z-button-group>
  `,
  viewProviders: [provideIcons({ plus: zardPlusIcon, minus: zardMinusIcon })],
})
export class ZardDemoButtonGroupOrientationComponent {}
