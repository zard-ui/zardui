```angular-ts showLineNumbers
import { Component } from '@angular/core';

import { ZardTabComponent, ZardTabGroupComponent, zPosition } from '../tabs.component';
import { ZardButtonComponent } from '../../components';

@Component({
  standalone: true,
  imports: [ZardTabComponent, ZardTabGroupComponent, ZardButtonComponent],
  template: `
    <div class="w-full h-[300px]">
      <z-tab-group [zTabsPosition]="zTabsPosition" [zActivePosition]="zActivePosition">
        <z-tab label="zTabsPosition">
          <p class="text-center w-full">zTabsPosition: {{ zTabsPosition }}</p>
          <div class="flex justify-center items-center gap-2 mt-4">
            <button z-button zType="ghost" (click)="zTabsPosition = 'top'">Top</button>
            <button z-button zType="ghost" (click)="zTabsPosition = 'bottom'">Bottom</button>
            <button z-button zType="ghost" (click)="zTabsPosition = 'left'">Left</button>
            <button z-button zType="ghost" (click)="zTabsPosition = 'right'">Right</button>
          </div>
        </z-tab>
        <z-tab label="zActivePosition">
          <p class="text-center w-full">zActivePosition: {{ zActivePosition }}</p>
          <div class="flex justify-center items-center gap-2 mt-4">
            <button z-button zType="ghost" (click)="zActivePosition = 'top'">Top</button>
            <button z-button zType="ghost" (click)="zActivePosition = 'bottom'">Bottom</button>
            <button z-button zType="ghost" (click)="zActivePosition = 'left'">Left</button>
            <button z-button zType="ghost" (click)="zActivePosition = 'right'">Right</button>
          </div>
        </z-tab>
      </z-tab-group>
    </div>
  `,
})
export class ZardDemoTabsPositiontComponent {
  zTabsPosition: zPosition = 'top';
  zActivePosition: zPosition = 'top';
}

```