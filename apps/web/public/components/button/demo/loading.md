```angular-ts showLineNumbers copyButton
import { Component } from '@angular/core';

import { ZardButtonComponent } from '../button.component';

@Component({
  selector: 'z-demo-button-loading',
  standalone: true,
  imports: [ZardButtonComponent],
  template: ` <button z-button zLoading>Default</button> `,
})
export class ZardDemoButtonLoadingComponent {}

```
