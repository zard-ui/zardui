import { Component } from '@angular/core';

import { ZardTabComponent, ZardTabGroupComponent } from '../tabs.component';

@Component({
  selector: 'z-demo-tabs-line',
  imports: [ZardTabComponent, ZardTabGroupComponent],
  standalone: true,
  template: `
    <z-tab-group zVariant="line">
      <z-tab label="Overview" />
      <z-tab label="Analytics" />
      <z-tab label="Reports" />
    </z-tab-group>
  `,
})
export class ZardDemoTabsLineComponent {}
