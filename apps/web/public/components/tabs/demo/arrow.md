```angular-ts showLineNumbers copyButton
import { Component } from '@angular/core';

import { ZardButtonComponent } from '../../button/button.component';
import { ZardTabComponent, ZardTabGroupComponent } from '../tabs.component';

@Component({
  selector: 'z-demo-tabs-arrow',
  standalone: true,
  imports: [ZardTabComponent, ZardTabGroupComponent, ZardButtonComponent],
  template: `
    <div class="h-[300px] w-full">
      <div class="mb-4 text-sm">
        <div class="mt-4 flex items-center justify-center gap-2">
          <button z-button zType="ghost" type="button" [attr.aria-pressed]="showArrow" (click)="showArrow = !showArrow">{{ showArrow ? 'Hide' : 'Show' }} Arrows</button>
        </div>
      </div>
      <z-tab-group [zShowArrow]="showArrow">
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
  showArrow = true;
}

```