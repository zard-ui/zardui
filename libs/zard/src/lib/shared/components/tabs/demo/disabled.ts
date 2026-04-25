import { Component } from '@angular/core';

import { ZardTabComponent, ZardTabGroupComponent } from '../tabs.component';

@Component({
  selector: 'z-demo-tabs-disabled',
  imports: [ZardTabComponent, ZardTabGroupComponent],
  standalone: true,
  template: `
    <div class="w-full max-w-md">
      <z-tab-group>
        <z-tab label="Home" />
        <z-tab label="Disabled" zDisabled />
      </z-tab-group>
    </div>
  `,
})
export class ZardDemoTabsDisabledComponent {}
