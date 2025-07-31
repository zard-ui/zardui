```angular-ts showLineNumbers
import { Component } from '@angular/core';

import { ZardButtonComponent } from '../button.component';

@Component({
  standalone: true,
  imports: [ZardButtonComponent],
  template: `
    <button z-button>Default</button>
    <button z-button zShape="circle">Circle</button>
    <button z-button zShape="square">Square</button>
  `,
})
export class ZardDemoButtonShapeComponent {}

```