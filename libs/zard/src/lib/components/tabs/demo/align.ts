import { Component } from '@angular/core';

import { zAlign, ZardTabComponent, ZardTabGroupComponent } from '../tabs.component';

@Component({
  standalone: true,
  imports: [ZardTabComponent, ZardTabGroupComponent],
  template: `
    <div class="w-full h-[300px]">
      <z-tab-group [zAlignTabs]="currentAlign">
        <z-tab label="First">
          <p>Align tab: {{ currentAlign }}</p>
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
export class ZardDemoTabsAlignComponent {
  currentAlign: zAlign = 'start';
  index = 1;
}
