```angular-ts showLineNumbers copyButton
import { Component } from '@angular/core';

import { ZardInputDirective } from '../input.directive';

@Component({
  selector: 'z-demo-input-borderless',
  standalone: true,
  imports: [ZardInputDirective],
  template: `<input z-input zBorderless placeholder="Borderless" />`,
})
export class ZardDemoInputBorderlessComponent {}

```