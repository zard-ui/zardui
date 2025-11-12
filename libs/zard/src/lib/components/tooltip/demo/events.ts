import { Component } from '@angular/core';

import { ZardButtonComponent } from '../../button/button.component';
import { ZardTooltipModule } from '../tooltip';

@Component({
  selector: 'z-demo-tooltip-events',
  standalone: true,
  imports: [ZardButtonComponent, ZardTooltipModule],
  template: `
    <div class="flex w-[100px] flex-col gap-4">
      <button type="button" z-button zType="outline" zTooltip="Tooltip content" (zShow)="onShow()" (zHide)="onHide()">
        Events
      </button>

      <span>Event: {{ event }}</span>
    </div>
  `,
})
export class ZardDemoTooltipEventsComponent {
  protected event = 'none';

  protected onShow() {
    this.event = 'zShow';
  }

  protected onHide() {
    this.event = 'zHide';
  }
}
