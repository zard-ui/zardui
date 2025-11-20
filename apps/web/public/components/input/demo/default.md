```angular-ts showLineNumbers copyButton
import { Component } from '@angular/core';

import { ZardInputDirective } from '../input.directive';

@Component({
  selector: 'z-demo-input-default',
  imports: [ZardInputDirective],
  standalone: true,
  template: `
    <input z-input placeholder="Default" />
    <input z-input disabled placeholder="Disabled" />
  `,
})
export class ZardDemoInputDefaultComponent {}

```