import { Component } from '@angular/core';

import { ZardDividerComponent } from '@ngzard/ui/divider';

@Component({
  selector: 'z-demo-divider-vertical',
  imports: [ZardDividerComponent],
  standalone: true,
  template: `
    <div class="flex h-20">
      <p>Left</p>
      <z-divider zOrientation="vertical" />
      <p>Right</p>
    </div>
  `,
})
export class ZardDemoDividerVerticalComponent {}
