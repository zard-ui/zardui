```angular-ts showLineNumbers
import { Component } from '@angular/core';

import { ZardBadgeComponent } from '../badge.component';

@Component({
  standalone: true,
  imports: [ZardBadgeComponent],
  template: ` <z-badge zType="secondary">Default</z-badge> `,
})
export class ZardDemoBadgeSecondaryComponent {}

```