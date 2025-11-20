```angular-ts showLineNumbers copyButton
import { Component } from '@angular/core';

import { ZardButtonComponent } from '../button.component';

@Component({
  selector: 'z-demo-button-full',
  imports: [ZardButtonComponent],
  standalone: true,
  template: ` <button z-button zFull>Default</button> `,
})
export class ZardDemoButtonFullComponent {}

```