```angular-ts showLineNumbers copyButton
import { Component } from '@angular/core';

import { ZardLoaderComponent } from '../loader.component';

@Component({
  selector: 'z-demo-loader-default',
  imports: [ZardLoaderComponent],
  standalone: true,
  template: `<z-loader />`,
})
export class ZardDemoLoaderDefaultComponent {}

```