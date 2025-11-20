```angular-ts showLineNumbers copyButton
import { Component } from '@angular/core';

import { ZardInputDirective } from '../input.directive';

@Component({
  selector: 'z-demo-input-borderless',
  imports: [ZardInputDirective],
  standalone: true,
  template: `<input z-input zBorderless placeholder="Borderless" />`,
})
export class ZardDemoInputBorderlessComponent {}

```