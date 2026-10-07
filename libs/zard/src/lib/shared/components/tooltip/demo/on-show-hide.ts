import { ChangeDetectionStrategy, Component } from '@angular/core';

import { ZardButtonComponent } from '@/shared/components/button';
import { ZardTooltipImports } from '@/shared/components/tooltip/tooltip.imports';

@Component({
  selector: 'z-demo-tooltip-on-show-hide',
  imports: [ZardButtonComponent, ZardTooltipImports],
  template: `
    <div class="flex w-25 flex-col gap-4">
      <button type="button" z-button zType="outline" zTooltip="Tooltip content" (zShow)="onShow()" (zHide)="onHide()">
        Events
      </button>

      <span class="text-sm">Event: {{ event }}</span>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ZardDemoTooltipOnShowHideComponent {
  protected event = 'none';

  protected onShow() {
    this.event = '(zShow)';
  }

  protected onHide() {
    this.event = '(zHide)';
  }
}
