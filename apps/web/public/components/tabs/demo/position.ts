import { Component } from '@angular/core';

import { ZardTabComponent, ZardTabGroupComponent, zPosition } from '../tabs.component';

@Component({
  standalone: true,
  imports: [ZardTabComponent, ZardTabGroupComponent],
  template: `
    <div class="w-full h-[300px]">
      <z-tab-group [zTabsPosition]="currentPosition.tab" [zActivePosition]="currentPosition.active">
        <z-tab label="First">
          <p>Position tab: {{ currentPosition.tab }} and position active: {{ currentPosition.active }}</p>
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
export class ZardDemoTabsPositiontComponent {
  currentPosition: { tab: zPosition; active: zPosition } = { tab: 'top', active: 'top' };
  index = 1;
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
    }, 5000);
  }
}
