```angular-ts showLineNumbers
import { Component } from '@angular/core';

import { ZardLoaderComponent } from '../loader.component';

@Component({
  standalone: true,
  imports: [ZardLoaderComponent],
  template: `<z-loader />`,
  styles: [
    `
      :host {
        display: flex;
        flex-wrap: wrap;
        gap: 24px;
      }
    `,
  ],
})
export class ZardDemoLoaderBasicComponent {}

```