```angular-ts showLineNumbers copyButton
import { Component } from '@angular/core';

import { ZardButtonComponent } from '../button.component';

@Component({
  selector: 'z-demo-button-type',
  standalone: true,
  imports: [ZardButtonComponent],
  template: `
    <button z-button zSize="sm">Default</button>
    <button z-button zSize="sm" zType="outline">Outline</button>
    <button z-button zSize="sm" zType="destructive">Destructive</button>
    <button z-button zSize="sm" zType="secondary">Secondary</button>
    <button z-button zSize="sm" zType="ghost">Ghost</button>
    <button z-button zSize="sm" zType="link">Link</button>
  `,
  host: {
    class: 'flex flex-col items-center gap-4 md:flex-row md:gap-8',
  },
})
export class ZardDemoButtonTypeComponent {}

```
