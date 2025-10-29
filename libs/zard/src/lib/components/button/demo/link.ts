import { Component } from '@angular/core';

import { ZardButtonComponent } from '../button.component';

@Component({
  selector: 'z-demo-button-link',
  standalone: true,
  imports: [ZardButtonComponent],
  template: ` <button z-button zType="link">Link</button> `,
})
export class ZardDemoButtonLinkComponent {}
