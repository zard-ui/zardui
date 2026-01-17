import { Component } from '@angular/core';

import { ZardTooltipImports } from '@/shared/components/tooltip/tooltip.imports';

import { ZardButtonComponent } from '../../button/button.component';

@Component({
  selector: 'z-demo-tooltip-click',
  imports: [ZardButtonComponent, ZardTooltipImports],
  template: `
    <button type="button" z-button zType="outline" zTooltip="Tooltip content" zTrigger="click">Click</button>
  `,
})
export class ZardDemoTooltipClickComponent {}
