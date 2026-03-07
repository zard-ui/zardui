import { Component } from '@angular/core';

import { NgIcon, provideIcons } from '@ng-icons/core';

import { zardArrowLeftIcon, zardArrowRightIcon } from '../../../core/icons-registry';
import { ZardButtonComponent } from '../../button/button.component';
import { ZardButtonGroupComponent } from '../button-group.component';

@Component({
  selector: 'z-demo-button-group-nested',
  imports: [ZardButtonGroupComponent, ZardButtonComponent, NgIcon],
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
        <button z-button zSize="sm" zType="outline"><ng-icon name="arrow-left" /></button>
        <button z-button zSize="sm" zType="outline"><ng-icon name="arrow-right" /></button>
      </z-button-group>
    </z-button-group>
  `,
  viewProviders: [provideIcons({ arrowLeft: zardArrowLeftIcon, arrowRight: zardArrowRightIcon })],
})
export class ZardDemoButtonGroupNestedComponent {}
