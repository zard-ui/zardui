```angular-ts showLineNumbers
import { Component } from '@angular/core';

import { ZardInputDirective } from '../input.directive';

@Component({
  standalone: true,
  imports: [ZardInputDirective],
  template: `<input z-input zBorderless placeholder="Borderless" />`,
})
export class ZardDemoInputBorderlessComponent {}

```