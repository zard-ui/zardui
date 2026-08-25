import { ChangeDetectionStrategy, Component } from '@angular/core';

import { ZardTabComponent, ZardTabGroupComponent } from '../tabs.component';

@Component({
  selector: 'z-demo-tabs-line',
  imports: [ZardTabComponent, ZardTabGroupComponent],
  template: `
    <z-tab-group zVariant="line">
      <z-tab label="Overview" />
      <z-tab label="Analytics" />
      <z-tab label="Reports" />
    </z-tab-group>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ZardDemoTabsLineComponent {}
