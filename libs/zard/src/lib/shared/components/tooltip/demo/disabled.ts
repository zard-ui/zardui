import { Component } from '@angular/core';

import { ZardButtonComponent } from '@/shared/components/button';
import { ZardTooltipImports } from '@/shared/components/tooltip/tooltip.imports';

@Component({
  selector: 'z-demo-tooltip-disabled-button',
  imports: [ZardButtonComponent, ZardTooltipImports],
  template: `
    <span zTooltip="This feature is currently unavailable" class="block" tabindex="0">
      <button type="button" z-button zType="outline" [zDisabled]="true">Disabled</button>
    </span>
  `,
})
export class ZardDemoTooltipDisabledButtonComponent {}
