```angular-ts showLineNumbers
import { Component } from '@angular/core';

import { ZardInputDirective } from '../input.directive';

@Component({
  standalone: true,
  imports: [ZardInputDirective],
  template: `
    <input z-input placeholder="Default" />
    <input z-input disabled placeholder="Disabled" />
  `,
})
export class ZardDemoInputDefaultComponent {}

```