import { Component } from '@angular/core';

import { ZardTabComponent, ZardTabGroupComponent, zPosition } from '../tabs.component';

@Component({
  standalone: true,
  imports: [ZardTabComponent, ZardTabGroupComponent],
  template: `
    <div class="w-full h-[300px]">
      <z-tab-group>
        <z-tab label="First">
          <p>Position tab</p>
        </z-tab>
        <z-tab label="Second">
          <p>Content of the second tab</p>
        </z-tab>
        <z-tab label="Third">
          <p>Content of the third tab</p>
        </z-tab>
      </z-tab-group>
    </div>
  `,
})
export class ZardDemoTabsPositiontComponent {}
