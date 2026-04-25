import { Component } from '@angular/core';

import { ZardToggleComponent } from '../toggle.component';

@Component({
  selector: 'z-demo-toggle-size',
  imports: [ZardToggleComponent],
  template: `
    <div class="flex items-center gap-2">
      <z-toggle zAriaLabel="Toggle small" zSize="sm" zType="outline">Small</z-toggle>
      <z-toggle zAriaLabel="Toggle default" zSize="default" zType="outline">Default</z-toggle>
      <z-toggle zAriaLabel="Toggle large" zSize="lg" zType="outline">Large</z-toggle>
    </div>
  `,
})
export class ZardDemoToggleSizeComponent {}
