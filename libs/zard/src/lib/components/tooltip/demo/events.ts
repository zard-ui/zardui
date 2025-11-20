import { Component } from '@angular/core';

import { ZardButtonComponent } from '../../button/button.component';
import { ZardTooltipModule } from '../tooltip';

@Component({
  selector: 'z-demo-tooltip-events',
  imports: [ZardButtonComponent, ZardTooltipModule],
  standalone: true,
  template: `
    <button z-button zType="outline" zTooltip="Tooltip content" (zOnShow)="onShow()" (zOnHide)="onHide()">
      Events
    </button>
  `,
})
export class ZardDemoTooltipEventsComponent {
  onShow() {
    console.log('show');
  }

  onHide() {
    console.log('hide');
  }
}
