import { Component } from '@angular/core';

import { ZardButtonComponent } from '@ngzard/ui/button';

import { ZardTooltipModule } from '../tooltip';

@Component({
  selector: 'z-demo-tooltip-events',
  imports: [ZardButtonComponent, ZardTooltipModule],
  template: `
    <div class="flex w-[100px] flex-col gap-4">
      <button type="button" z-button zType="outline" zTooltip="Tooltip content" (zShow)="onShow()" (zHide)="onHide()">
        Events
      </button>

      <span class="text-sm">Event: {{ event }}</span>
    </div>
  `,
})
export class ZardDemoTooltipEventsComponent {
  protected event = 'none';

  protected onShow() {
    this.event = '(zShow)';
  }

  protected onHide() {
    this.event = '(zHide)';
  }
}
