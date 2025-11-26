```angular-ts showLineNumbers copyButton
import { Component } from '@angular/core';

import { ZardButtonComponent } from '@ngzard/ui/button';
import { ZardTooltipModule } from '@ngzard/ui/tooltip';

@Component({
  selector: 'z-demo-tooltip-hover',
  imports: [ZardButtonComponent, ZardTooltipModule],
  template: `
    <button type="button" z-button zType="outline" zTooltip="Tooltip content">Hover</button>
  `,
})
export class ZardDemoTooltipHoverComponent {}

```