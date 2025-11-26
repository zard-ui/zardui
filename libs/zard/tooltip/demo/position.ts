import { Component } from '@angular/core';

import { ZardButtonComponent } from '@ngzard/ui/button';

import { ZardTooltipModule } from '../tooltip';

@Component({
  selector: 'z-demo-tooltip-position',
  imports: [ZardButtonComponent, ZardTooltipModule],
  standalone: true,
  template: `
    <div class="flex flex-col space-y-2">
      <button type="button" z-button zType="outline" zTooltip="Tooltip content" zPosition="top">Top</button>

      <div class="flex space-x-2">
        <button type="button" z-button zType="outline" zTooltip="Tooltip content" zPosition="left">Left</button>
        <button type="button" z-button zType="outline" zTooltip="Tooltip content" zPosition="right">Right</button>
      </div>

      <button type="button" z-button zType="outline" zTooltip="Tooltip content" zPosition="bottom">Bottom</button>
    </div>
  `,
})
export class ZardDemoTooltipPositionComponent {}
