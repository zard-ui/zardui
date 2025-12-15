```angular-ts showLineNumbers copyButton
import { Component } from '@angular/core';

import { ZardButtonComponent } from '../button.component';

@Component({
  selector: 'z-demo-button-link',
  imports: [ZardButtonComponent],
  standalone: true,
  template: `
    <button z-button zType="link">Link</button>
  `,
})
export class ZardDemoButtonLinkComponent {}

```