import { Component } from '@angular/core';

import { ZardButtonComponent } from '../../button/button.component';
import { type zAlign, ZardTabComponent, ZardTabGroupComponent } from '../tabs.component';

@Component({
  selector: 'z-demo-tabs-align',
  imports: [ZardTabComponent, ZardTabGroupComponent, ZardButtonComponent],
  standalone: true,
  template: `
    <div class="h-[300px] w-full">
      <z-tab-group [zAlignTabs]="zAlignTabs">
        <z-tab label="First">
          <p class="w-full text-center">zAlignTabs: {{ zAlignTabs }}</p>
          <div class="mt-4 flex items-center justify-center gap-2">
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
