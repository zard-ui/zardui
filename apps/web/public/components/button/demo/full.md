```angular-ts showLineNumbers copyButton
import { Component } from '@angular/core';

import { ZardButtonComponent } from '../button.component';

@Component({
  standalone: true,
  imports: [ZardButtonComponent],
  template: ` <button z-button zFull>Default</button> `,
})
export class ZardDemoButtonFullComponent {}

```