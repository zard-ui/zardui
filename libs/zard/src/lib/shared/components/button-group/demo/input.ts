import { Component } from '@angular/core';

import { NgIcon, provideIcons } from '@ng-icons/core';

import { zardSearchIcon } from '../../../core/icons-registry';
import { ZardButtonComponent } from '../../button/button.component';
import { ZardInputDirective } from '../../input/input.directive';
import { ZardButtonGroupComponent } from '../button-group.component';

@Component({
  selector: 'z-demo-button-group-input',
  imports: [ZardButtonGroupComponent, ZardButtonComponent, NgIcon, ZardInputDirective],
  template: `
    <z-button-group>
      <input z-input placeholder="Search..." />
      <button z-button zType="outline"><ng-icon name="search" /></button>
    </z-button-group>
  `,
  viewProviders: [provideIcons({ search: zardSearchIcon })],
})
export class ZardDemoButtonGroupInputComponent {}
