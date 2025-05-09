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
        [zAlignTabs]="'center'"
      >
        <z-tab label="First">
          <p>Conteúdo da primeira tab com position tab: {{ currentPosition.tab }} e position active: {{ currentPosition.active }}</p>
        </z-tab>
        <z-tab label="Second">
          <p>Conteúdo da segunda tab</p>
        </z-tab>
        <z-tab label="Third">
          <p>Conteúdo da terceira tab</p>
        </z-tab>
        <z-tab label="Third">
          <p>Conteúdo da terceira tab</p>
        </z-tab>
        <z-tab label="Third">
          <p>Conteúdo da terceira tab</p>
        </z-tab>
        <z-tab label="Third">
          <p>Conteúdo da terceira tab</p>
        </z-tab>
      </z-tab-group>
    </div>
  `,
})
export class ZardDemoTabsDefaultComponent {
  currentPosition: { tab: zPosition; active: zPosition } = { tab: 'left', active: 'top' };
  index = 0;
  @ViewChild(ZardTabGroupComponent) tabGroup!: ZardTabGroupComponent;
  constructor() {
    //N vai assim para prd, apenas para demo nesse push
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
