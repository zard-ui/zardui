import { Component } from '@angular/core';

import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideBookmark } from '@ng-icons/lucide';

import { ZardToggleComponent } from '../toggle.component';

@Component({
  selector: 'z-demo-toggle-default',
  imports: [ZardToggleComponent, NgIcon],
  template: `
    <z-toggle zAriaLabel="Toggle bookmark" zSize="sm" zType="outline">
      <ng-icon name="lucideBookmark" class="group-data-[state=on]/toggle:[&_path]:fill-foreground" />
      Bookmark
    </z-toggle>
  `,
  viewProviders: [provideIcons({ lucideBookmark })],
})
export class ZardDemoToggleDefaultComponent {}
