import { Component } from '@angular/core';

import { ZardButtonComponent } from '../../button/button.component';
import { ZardTooltipModule } from '../tooltip';

@Component({
  selector: 'z-demo-tooltip-click',
  imports: [ZardButtonComponent, ZardTooltipModule],
  standalone: true,
  template: ` <button z-button zType="outline" zTooltip="Tooltip content" zTrigger="click">Click</button> `,
})
export class ZardDemoTooltipClickComponent {}
