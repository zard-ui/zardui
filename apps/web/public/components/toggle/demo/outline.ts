import { Component } from '@angular/core';

import { ZardToggleComponent } from '../toggle.component';

@Component({
  standalone: true,
  imports: [ZardToggleComponent],
  template: `
    <z-toggle aria-label="Toggle outline" zType="outline">
      <div class="icon-bold"></div>
    </z-toggle>
  `,
})
export class ZardDemoToggleOutlineComponent {}
