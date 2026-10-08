import { ChangeDetectionStrategy, Component } from '@angular/core';

import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideBuilding2, lucideCreditCard, lucideWallet } from '@ng-icons/lucide';

import { ZardButtonComponent } from '@/shared/components/button';
import { ZardDropdownImports } from '@/shared/components/dropdown/dropdown.imports';

@Component({
  selector: 'z-demo-dropdown-radio-icons',
  imports: [ZardDropdownImports, ZardButtonComponent, NgIcon],
  template: `
    <button type="button" z-button zType="outline" z-dropdown [zDropdownMenu]="menu">Payment Method</button>

    <z-dropdown-menu-content #menu="zDropdownMenuContent" class="w-56">
      <z-dropdown-menu-label>Select Payment Method</z-dropdown-menu-label>
      <z-dropdown-menu-radio-group [(zValue)]="selected">
        <z-dropdown-menu-radio-item zValue="card">
          <ng-icon name="lucideCreditCard" class="mr-2 size-4" />
          Credit Card
        </z-dropdown-menu-radio-item>
        <z-dropdown-menu-radio-item zValue="paypal">
          <ng-icon name="lucideWallet" class="mr-2 size-4" />
          PayPal
        </z-dropdown-menu-radio-item>
        <z-dropdown-menu-radio-item zValue="bank">
          <ng-icon name="lucideBuilding2" class="mr-2 size-4" />
          Bank Transfer
        </z-dropdown-menu-radio-item>
      </z-dropdown-menu-radio-group>
    </z-dropdown-menu-content>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  viewProviders: [provideIcons({ lucideCreditCard, lucideWallet, lucideBuilding2 })],
})
export class ZardDemoDropdownRadioIconsComponent {
  selected = 'card';
}
