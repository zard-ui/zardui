```angular-ts showLineNumbers
import { Component } from '@angular/core';

import { ZardLoaderComponent } from '../loader.component';

@Component({
  standalone: true,
  imports: [ZardLoaderComponent],
  template: `<z-loader />`,
})
export class ZardDemoLoaderDefaultComponent {}

```