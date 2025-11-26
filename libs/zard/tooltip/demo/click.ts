import { Component } from '@angular/core';

import { ZardButtonComponent } from '@ngzard/ui/button';
import { ZardTooltipModule } from '@ngzard/ui/tooltip';

@Component({
  selector: 'z-demo-tooltip-click',
  imports: [ZardButtonComponent, ZardTooltipModule],
  template: `
    <button type="button" z-button zType="outline" zTooltip="Tooltip content" zTrigger="click">Click</button>
  `,
})
export class ZardDemoTooltipClickComponent {}
