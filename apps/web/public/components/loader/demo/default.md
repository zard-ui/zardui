```angular-ts showLineNumbers copyButton
import { Component } from '@angular/core';

import { ZardLoaderComponent } from '../loader.component';

@Component({
  selector: 'z-demo-loader-default',
  standalone: true,
  imports: [ZardLoaderComponent],
  template: `<z-loader />`,
})
export class ZardDemoLoaderDefaultComponent {}

```