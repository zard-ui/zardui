```angular-ts showLineNumbers
import { Component } from '@angular/core';

import { ZardBadgeComponent } from '../badge.component';

@Component({
  standalone: true,
  imports: [ZardBadgeComponent],
  template: `
    <z-badge>Default</z-badge>
    <z-badge zShape="square">Square</z-badge>
  `,
})
export class ZardDemoBadgeShapeComponent {}

```