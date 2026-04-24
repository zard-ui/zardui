import { Component } from '@angular/core';

import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideBold, lucideItalic } from '@ng-icons/lucide';

import { ZardToggleComponent } from '../toggle.component';

@Component({
  selector: 'z-demo-toggle-outline',
  imports: [ZardToggleComponent, NgIcon],
  template: `
    <div class="flex items-center gap-2">
      <z-toggle zAriaLabel="Toggle italic" zType="outline">
        <ng-icon name="lucideItalic" />
      </z-toggle>
      <z-toggle zAriaLabel="Toggle bold" zType="outline">
        <ng-icon name="lucideBold" />
      </z-toggle>
    </div>
  `,
  viewProviders: [provideIcons({ lucideBold, lucideItalic })],
})
export class ZardDemoToggleOutlineComponent {}
