import { Component } from '@angular/core';

import { ZardButtonComponent } from '../button.component';

@Component({
  standalone: true,
  imports: [ZardButtonComponent],
  template: `
    <button z-button zType="outline">Button</button>
    <button z-button zType="outline"><i class="icon-arrow-up"></i></button>
  `,
})
export class ZardDemoButtonDefaultComponent {}
