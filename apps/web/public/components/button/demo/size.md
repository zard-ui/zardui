```angular-ts showLineNumbers
import { Component } from '@angular/core';

import { ZardButtonComponent } from '../button.component';

@Component({
  standalone: true,
  imports: [ZardButtonComponent],
  template: `
    <button z-button zSize="sm">Small</button>
    <button z-button>Default</button>
    <button z-button zSize="lg">Large</button>
  `,
})
export class ZardDemoButtonSizeComponent {}

```