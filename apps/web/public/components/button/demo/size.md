```angular-ts showLineNumbers copyButton
import { Component } from '@angular/core';

import { ZardIconComponent } from '../../icon/icon.component';
import { ZardButtonComponent } from '../button.component';

@Component({
  selector: 'z-demo-button-size',
  standalone: true,
  imports: [ZardButtonComponent, ZardIconComponent],
  template: `
    <div class="flex flex-col items-center">
      <div class="mb-4 flex gap-2">
        <button z-button zSize="sm">Small</button>
        <button z-button zSize="sm"><z-icon zType="arrow-up"></z-icon></button>
      </div>

      <div class="mb-4 flex gap-2">
        <button z-button>Default</button>
        <button z-button><z-icon zType="arrow-up"></z-icon></button>
      </div>

      <div class="mb-4 flex gap-2">
        <button z-button zSize="lg">Large</button>
        <button z-button zSize="lg"><z-icon zType="arrow-up"></z-icon></button>
      </div>
    </div>
  `,
})
export class ZardDemoButtonSizeComponent {}

```
