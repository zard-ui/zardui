```angular-ts showLineNumbers
import { Component } from '@angular/core';

import { ZardLoaderComponent } from '../loader.component';

@Component({
  standalone: true,
  imports: [ZardLoaderComponent],
  template: `
    <z-loader zSize="sm" />
    <z-loader zSize="default" />
    <z-loader zSize="lg" />
  `,
})
export class ZardDemoLoaderSizeComponent {}

```