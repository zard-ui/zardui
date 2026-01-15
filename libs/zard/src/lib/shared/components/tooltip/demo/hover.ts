import { Component } from '@angular/core';

import { ZardTooltipImports } from '@/shared/components/tooltip/tooltip.imports';

import { ZardButtonComponent } from '../../button/button.component';

@Component({
  selector: 'z-demo-tooltip-hover',
  imports: [ZardButtonComponent, ZardTooltipImports],
  template: `
    <button type="button" z-button zType="outline" zTooltip="Tooltip content">Hover</button>
  `,
})
export class ZardDemoTooltipHoverComponent {}
