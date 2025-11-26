```angular-ts showLineNumbers copyButton
import { Component } from '@angular/core';

import { ZardInputDirective } from '@ngzard/ui/input';

@Component({
  selector: 'z-demo-input-status',
  imports: [ZardInputDirective],
  standalone: true,
  template: `
    <input z-input zStatus="error" placeholder="Error" />
    <input z-input zStatus="warning" placeholder="Warning" />
    <input z-input zStatus="success" placeholder="Success" />
  `,
})
export class ZardDemoInputStatusComponent {}

```