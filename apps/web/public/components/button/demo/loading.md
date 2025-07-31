```angular-ts showLineNumbers
import { Component } from '@angular/core';

import { ZardButtonComponent } from '../button.component';

@Component({
  standalone: true,
  imports: [ZardButtonComponent],
  template: ` <button z-button zLoading>Default</button> `,
})
export class ZardDemoButtonLoadingComponent {}

```