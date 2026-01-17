```angular-ts showLineNumbers copyButton
import { Component } from '@angular/core';

import { ZardTooltipImports } from '@/shared/components/tooltip/tooltip.imports';

import { ZardButtonComponent } from '../../button/button.component';

@Component({
  selector: 'z-demo-tooltip-events',
  imports: [ZardButtonComponent, ZardTooltipImports],
  template: `
    <div class="flex w-25 flex-col gap-4">
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

```