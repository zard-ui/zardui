```angular-ts showLineNumbers copyButton
import { Component } from '@angular/core';

import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideBold } from '@ng-icons/lucide';

import { ZardToggleComponent } from '../toggle.component';

@Component({
  selector: 'z-demo-toggle-outline',
  imports: [ZardToggleComponent, NgIcon],
  template: `
    <z-toggle aria-label="Toggle outline" zType="outline">
      <ng-icon name="lucideBold" />
    </z-toggle>
  `,
  viewProviders: [provideIcons({ lucideBold })],
})
export class ZardDemoToggleOutlineComponent {}

```