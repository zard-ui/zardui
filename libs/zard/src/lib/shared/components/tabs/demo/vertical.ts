import { Component } from '@angular/core';

import { ZardTabComponent, ZardTabGroupComponent } from '../tabs.component';

@Component({
  selector: 'z-demo-tabs-vertical',
  imports: [ZardTabComponent, ZardTabGroupComponent],
  standalone: true,
  template: `
    <div class="flex w-full max-w-md flex-col gap-6">
      <z-tab-group zOrientation="vertical">
        <z-tab label="Account" />
        <z-tab label="Password" />
        <z-tab label="Notifications" />
      </z-tab-group>

      <z-tab-group zOrientation="vertical" zVariant="line">
        <z-tab label="Account" />
        <z-tab label="Password" />
        <z-tab label="Notifications" />
      </z-tab-group>
    </div>
  `,
})
export class ZardDemoTabsVerticalComponent {}
