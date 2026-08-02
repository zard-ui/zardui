import { Component } from '@angular/core';

import { ZardButtonComponent } from '@/shared/components/button';
import { ZardTooltipImports } from '@/shared/components/tooltip/tooltip.imports';

@Component({
  selector: 'z-demo-tooltip-click',
  imports: [ZardButtonComponent, ZardTooltipImports],
  template: `
    <button type="button" z-button zType="outline" zTooltip="Tooltip content" zTrigger="click">Click</button>
  `,
})
export class ZardDemoTooltipClickComponent {}
