import { Component } from '@angular/core';

import { ZardButtonComponent } from '../button.component';

@Component({
  selector: 'z-demo-button-full',
  standalone: true,
  imports: [ZardButtonComponent],
  template: ` <button z-button zFull>Default</button> `,
})
export class ZardDemoButtonFullComponent {}
