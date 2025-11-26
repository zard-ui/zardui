```angular-ts showLineNumbers copyButton
import { Component } from '@angular/core';

import { ZardButtonComponent } from '@ngzard/ui/button';

@Component({
  selector: 'z-demo-button-loading',
  imports: [ZardButtonComponent],
  standalone: true,
  template: `
    <button z-button zLoading>Default</button>
  `,
})
export class ZardDemoButtonLoadingComponent {}

```