```angular-ts showLineNumbers copyButton
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { ZardDividerComponent } from '../../divider/divider.component';
import { ZardRadioComponent } from '../../radio/radio.component';
import { ZardTabComponent, ZardTabGroupComponent, type zPosition } from '../tabs.component';

@Component({
  selector: 'z-demo-tabs-position',
  standalone: true,
  imports: [ZardTabComponent, ZardTabGroupComponent, ZardRadioComponent, FormsModule, ZardDividerComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="flex h-[300px] w-full flex-col justify-between">
      <z-tab-group [zTabsPosition]="zTabsPosition" [zActivePosition]="zActivePosition" class="h-[180px]">
        <z-tab label="First">
          <p>Is the default tab component</p>
        </z-tab>
        <z-tab label="Second">
          <p>Content of the second tab</p>
        </z-tab>
        <z-tab label="Third">
          <p>Content of the third tab</p>
        </z-tab>
      </z-tab-group>
      <div>
        <z-divider class="my-0" />
        <div class="flex flex-col gap-3 px-4 py-2 text-sm">
          <div class="flex items-center justify-between">
            <span>Tabs Position:</span>
            <div class="flex gap-2">
              <span z-radio name="tab" [(ngModel)]="zTabsPosition" value="top" zSize="sm">Top</span>
              <span z-radio name="tab" [(ngModel)]="zTabsPosition" value="bottom" zSize="sm">Bottom</span>
              <span z-radio name="tab" [(ngModel)]="zTabsPosition" value="left" zSize="sm">Left</span>
              <span z-radio name="tab" [(ngModel)]="zTabsPosition" value="right" zSize="sm">Right</span>
            </div>
          </div>
          <div class="flex items-center justify-center gap-2">
            <span>Active Tab Indicator Position:</span>
            <span z-radio name="active" [(ngModel)]="zActivePosition" value="top" zSize="sm">Top</span>
            <span z-radio name="active" [(ngModel)]="zActivePosition" value="bottom" zSize="sm">Bottom</span>
            <span z-radio name="active" [(ngModel)]="zActivePosition" value="left" zSize="sm">Left</span>
            <span z-radio name="active" [(ngModel)]="zActivePosition" value="right" zSize="sm">Right</span>
          </div>
        </div>
      </div>
    </div>
  `,
})
export class ZardDemoTabsPositionComponent {
  protected zTabsPosition: zPosition = 'top';
  protected zActivePosition: zPosition = 'bottom';
}

```