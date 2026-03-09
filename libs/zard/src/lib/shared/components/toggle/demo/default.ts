import { Component } from '@angular/core';

import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideBold } from '@ng-icons/lucide';

import { ZardToggleComponent } from '../toggle.component';

@Component({
  selector: 'z-demo-toggle-default',
  imports: [ZardToggleComponent, NgIcon],
  template: `
    <z-toggle aria-label="Default toggle">
      <ng-icon name="lucideBold" />
    </z-toggle>
  `,
  viewProviders: [provideIcons({ lucideBold })],
})
export class ZardDemoToggleDefaultComponent {}
