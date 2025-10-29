import { Component } from '@angular/core';

import { ZardButtonComponent } from '../../button/button.component';
import { ZardTooltipModule } from '../tooltip';

@Component({
  selector: 'z-demo-tooltip-hover',
  standalone: true,
  imports: [ZardButtonComponent, ZardTooltipModule],
  template: ` <button z-button zType="outline" zTooltip="Tooltip content">Hover</button> `,
})
export class ZardDemoTooltipHoverComponent {}
