```angular-ts showLineNumbers
import { Component } from '@angular/core';

import { zAlign, ZardTabComponent, ZardTabGroupComponent } from '../tabs.component';
import { ZardButtonComponent } from '../../components';

@Component({
  standalone: true,
  imports: [ZardTabComponent, ZardTabGroupComponent, ZardButtonComponent],
  template: `
    <div class="w-full h-[300px]">
      <z-tab-group [zAlignTabs]="zAlignTabs">
        <z-tab label="First">
          <p class="text-center w-full">zAlignTabs: {{ zAlignTabs }}</p>
          <div class="flex justify-center items-center gap-2 mt-4">
            <button z-button zType="ghost" (click)="zAlignTabs = 'start'">Start</button>
            <button z-button zType="ghost" (click)="zAlignTabs = 'center'">Center</button>
            <button z-button zType="ghost" (click)="zAlignTabs = 'end'">End</button>
          </div>
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
  zAlignTabs: zAlign = 'start';
}

```