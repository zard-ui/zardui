```angular-ts showLineNumbers copyButton
import { Component } from '@angular/core';
import { Bold } from 'lucide-angular';

import { ZardToggleComponent } from '../toggle.component';
import { ZardIconComponent } from '../../icon/icon.component';

@Component({
  standalone: true,
  imports: [ZardToggleComponent, ZardIconComponent],
  template: `
    <z-toggle aria-label="Toggle large" zSize="lg">
      <z-icon [zType]="BoldIcon" />
    </z-toggle>
  `,
})
export class ZardDemoToggleLargeComponent {
  readonly BoldIcon = Bold;
}

```