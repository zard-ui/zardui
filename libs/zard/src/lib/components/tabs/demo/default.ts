import { Component, ViewChild } from '@angular/core';

import { ZardTabComponent, ZardTabGroupComponent, zPosition } from '../tabs.component';

@Component({
  standalone: true,
  imports: [ZardTabComponent, ZardTabGroupComponent],
  template: `
    <div class="w-full h-[300px]">
      <z-tab-group
        (zOnTabChange)="onTabChange($event)"
        (zDeselect)="onTabChange($event)"
        [zTabsPosition]="currentPosition.tab"
        [zActivePosition]="currentPosition.active"
        [zShowArrow]="true"
        [zAlignTabs]="'center'"
      >
        <z-tab label="First">
          <p>Position tab: {{ currentPosition.tab }} e Position active: {{ currentPosition.active }}</p>
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
export class ZardDemoTabsDefaultComponent {
  currentPosition: { tab: zPosition; active: zPosition } = { tab: 'top', active: 'top' };
  index = 1;
  @ViewChild(ZardTabGroupComponent) tabGroup!: ZardTabGroupComponent;
  constructor() {
    setInterval(() => {
      const positions: { tab: zPosition; active: zPosition }[] = [
        { tab: 'top', active: 'top' },
        { tab: 'right', active: 'left' },
        { tab: 'bottom', active: 'top' },
        { tab: 'left', active: 'left' },
      ];
      this.currentPosition = positions[this.index];
      this.index = (this.index + 1) % positions.length;
      this.tabGroup.selectTabByIndex(this.index);
    }, 5000);
  }
  onTabChange(event: { index: number; tab: ZardTabComponent }) {
    console.log(`Tab changed: Index ${event.index}, Label: ${event.tab.label()}`);
  }
}
