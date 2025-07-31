```angular-ts showLineNumbers
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

import { ZardButtonComponent } from '../../button/button.component';
import { ZardTooltipModule } from '../tooltip';

@Component({
  standalone: true,
  imports: [CommonModule, ZardButtonComponent, ZardTooltipModule],
  template: `
    <div class="flex flex-col space-y-2">
      <button z-button zType="outline" zTooltip="Tooltip content" zPosition="top">Top</button>

      <div class="flex space-x-2">
        <button z-button zType="outline" zTooltip="Tooltip content" zPosition="left">Left</button>
        <button z-button zType="outline" zTooltip="Tooltip content" zPosition="right">Right</button>
      </div>

      <button z-button zType="outline" zTooltip="Tooltip content" zPosition="bottom">Bottom</button>
    </div>
  `,
})
export class ZardDemoTooltipPositionComponent {}

```