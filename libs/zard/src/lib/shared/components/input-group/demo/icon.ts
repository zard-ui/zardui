import { Component } from '@angular/core';

import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideCheck, lucideCreditCard, lucideInfo, lucideMail, lucideSearch, lucideStar } from '@ng-icons/lucide';

import { ZardInputComponent } from '@/shared/components/input/input.component';
import { ZardInputGroupImports } from '@/shared/components/input-group/input-group.imports';

@Component({
  selector: 'z-demo-input-group-icon',
  imports: [ZardInputComponent, NgIcon, ...ZardInputGroupImports],
  template: `
    <div class="grid w-full min-w-sm gap-6">
      <z-input-group>
        <input z-input placeholder="Search..." />
        <z-input-group-addon>
          <ng-icon name="lucideSearch" />
        </z-input-group-addon>
      </z-input-group>
      <z-input-group>
        <input z-input type="email" placeholder="Enter your email" />
        <z-input-group-addon>
          <ng-icon name="lucideMail" />
        </z-input-group-addon>
      </z-input-group>
      <z-input-group>
        <input z-input placeholder="Card number" />
        <z-input-group-addon>
          <ng-icon name="lucideCreditCard" />
        </z-input-group-addon>
        <z-input-group-addon zAlign="inline-end">
          <ng-icon name="lucideCheck" />
        </z-input-group-addon>
      </z-input-group>
      <z-input-group>
        <input z-input placeholder="Card number" />
        <z-input-group-addon zAlign="inline-end">
          <ng-icon name="lucideStar" />
          <ng-icon name="lucideInfo" />
        </z-input-group-addon>
      </z-input-group>
    </div>
  `,
  viewProviders: [provideIcons({ lucideSearch, lucideMail, lucideCreditCard, lucideCheck, lucideStar, lucideInfo })],
})
export class ZardDemoInputGroupIconComponent {}
