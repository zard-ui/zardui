import { Component } from '@angular/core';
import { Bold } from 'lucide-angular';

import { ZardToggleComponent } from '../toggle.component';
import { ZardIconComponent } from '../../icon/icon.component';

@Component({
  standalone: true,
  imports: [ZardToggleComponent, ZardIconComponent],
  template: `
    <z-toggle aria-label="Toggle outline" zType="outline">
      <z-icon [zType]="BoldIcon" />
    </z-toggle>
  `,
})
export class ZardDemoToggleOutlineComponent {
  readonly BoldIcon = Bold;
}
