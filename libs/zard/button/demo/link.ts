import { Component } from '@angular/core';

import { ZardButtonComponent } from '@ngzard/ui/button';

@Component({
  selector: 'z-demo-button-link',
  imports: [ZardButtonComponent],
  standalone: true,
  template: `
    <button z-button zType="link">Link</button>
  `,
})
export class ZardDemoButtonLinkComponent {}
