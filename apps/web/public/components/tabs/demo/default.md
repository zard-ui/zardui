```angular-ts showLineNumbers copyButton
import { Component } from '@angular/core';

import { ZardTabComponent, ZardTabGroupComponent } from '../tabs.component';

@Component({
  selector: 'z-demo-tabs-default',
  imports: [ZardTabComponent, ZardTabGroupComponent],
  standalone: true,
  template: `
    <div class="h-[300px] w-full">
      <z-tab-group>
        <z-tab label="First">
          <p>Is the default tab component</p>
        </z-tab>
        <z-tab label="Second">
          <p>Content of the second tab</p>
        </z-tab>
        <z-tab label="Third">
          <p>Content of the third tab</p>
        </z-tab>
        <z-tab label="Fourth">
          <p>Content of the fourth tab</p>
        </z-tab>
        <z-tab label="Fifth">
          <p>Content of the fifth tab</p>
        </z-tab>
        <z-tab label="Sixth">
          <p>Content of the sixth tab</p>
        </z-tab>
      </z-tab-group>
    </div>
  `,
})
export class ZardDemoTabsDefaultComponent {}

```