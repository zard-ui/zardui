import { Component } from '@angular/core';

import { ZardSeparatorComponent } from '../separator.component';

@Component({
  selector: 'z-demo-separator-vertical',
  imports: [ZardSeparatorComponent],
  standalone: true,
  template: `
    <div class="flex h-20">
      <p>Left</p>
      <z-separator zOrientation="vertical" />
      <p>Right</p>
    </div>
  `,
})
export class ZardDemoSeparatorVerticalComponent {}
