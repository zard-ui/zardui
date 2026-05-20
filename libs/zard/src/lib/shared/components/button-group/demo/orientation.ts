import { Component } from '@angular/core';

import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideMinus, lucidePlus } from '@ng-icons/lucide';

import { ZardButtonComponent } from '@/shared/components/button/button.component';
import { ZardButtonGroupComponent } from '@/shared/components/button-group/button-group.component';

@Component({
  selector: 'z-demo-button-group-orientation',
  imports: [ZardButtonGroupComponent, ZardButtonComponent, NgIcon],
  template: `
    <z-button-group zOrientation="vertical">
      <button type="button" z-button zType="outline" zSize="icon" aria-label="Add">
        <ng-icon name="lucidePlus" />
      </button>
      <button type="button" z-button zType="outline" zSize="icon" aria-label="Remove">
        <ng-icon name="lucideMinus" />
      </button>
    </z-button-group>
  `,
  viewProviders: [provideIcons({ lucidePlus, lucideMinus })],
})
export class ZardDemoButtonGroupOrientationComponent {}
