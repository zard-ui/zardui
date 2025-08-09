```angular-ts showLineNumbers copyButton
import { Component } from '@angular/core';

import { ZardBadgeComponent } from '../badge.component';

@Component({
  standalone: true,
  imports: [ZardBadgeComponent],
  template: ` <z-badge>Default</z-badge> `,
})
export class ZardDemoBadgeDefaultComponent {}

```