```angular-ts showLineNumbers
import { Component } from '@angular/core';

import { ZardButtonComponent } from '../../components';
import { ZardTabComponent, ZardTabGroupComponent } from '../tabs.component';

@Component({
  standalone: true,
  imports: [ZardTabComponent, ZardTabGroupComponent, ZardButtonComponent],
  template: `
    <div class="w-full h-[300px]">
      <z-tab-group [zShowArrow]="zShowArrow">
        <z-tab label="First">
          <p class="text-center w-full">zShowArrow: {{ zShowArrow }}</p>
          <div class="flex justify-center items-center gap-2 mt-4">
            <button z-button zType="ghost" (click)="zShowArrow = true">Show Arrow</button>
            <button z-button zType="ghost" (click)="zShowArrow = false">Hide Arrow</button>
          </div>
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
        <z-tab label="Seventh">
          <p>Content of the seventh tab</p>
        </z-tab>
        <z-tab label="Eighth">
          <p>Content of the eighth tab</p>
        </z-tab>
        <z-tab label="Ninth">
          <p>Content of the ninth tab</p>
        </z-tab>
        <z-tab label="Tenth">
          <p>Content of the tenth tab</p>
        </z-tab>
      </z-tab-group>
    </div>
  `,
})
export class ZardDemoTabsArrowComponent {
  zShowArrow = true;
}

```