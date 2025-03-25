import { Component } from '@angular/core';

import { ZardButtonComponent } from '../../button/button.component';
import { ZardTooltipModule } from '../tooltip.module';

@Component({
  standalone: true,
  imports: [ZardButtonComponent, ZardTooltipModule],
  template: ` <button z-button zType="outline" zTooltip="Tooltip content" zTrigger="click">Click</button> `,
})
export class ZardDemoTooltipClickComponent {}
