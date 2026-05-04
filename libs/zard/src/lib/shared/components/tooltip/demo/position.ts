import { Component } from '@angular/core';

import { ZardButtonComponent } from '@/shared/components/button';
import { ZardTooltipImports } from '@/shared/components/tooltip/tooltip.imports';

@Component({
  selector: 'z-demo-tooltip-position',
  imports: [ZardButtonComponent, ZardTooltipImports],
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
