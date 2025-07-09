import { Component } from '@angular/core';

import { ZardToggleComponent } from '../toggle.component';

@Component({
  standalone: true,
  imports: [ZardToggleComponent],
  template: `
    <z-toggle>
      <div class="icon-italic"></div>
      Italic
    </z-toggle>
  `,
})
export class ZardDemoToggleWithTextComponent {}
