import { Component } from '@angular/core';

import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideBold } from '@ng-icons/lucide';

import { ZardToggleComponent } from '../toggle.component';

@Component({
  selector: 'z-demo-toggle-large',
  imports: [ZardToggleComponent, NgIcon],
  template: `
    <z-toggle aria-label="Toggle large" zSize="lg">
      <ng-icon name="lucideBold" />
    </z-toggle>
  `,
  viewProviders: [provideIcons({ lucideBold })],
})
export class ZardDemoToggleLargeComponent {}
