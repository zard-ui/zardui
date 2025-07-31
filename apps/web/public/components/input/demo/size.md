```angular-ts showLineNumbers
import { Component } from '@angular/core';

import { ZardInputDirective } from '../input.directive';

@Component({
  standalone: true,
  imports: [ZardInputDirective],
  template: `
    <input z-input zSize="sm" placeholder="small size" />
    <input z-input zSize="default" placeholder="default size" />
    <input z-input zSize="lg" placeholder="large size" />
  `,
})
export class ZardDemoInputSizeComponent {}

```