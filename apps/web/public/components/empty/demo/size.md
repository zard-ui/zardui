```angular-ts showLineNumbers copyButton
import { Component } from '@angular/core';

import { ZardEmptyComponent } from '../empty.component';

@Component({
  selector: 'z-demo-empty-size',
  standalone: true,
  imports: [ZardEmptyComponent],
  template: `
    <z-empty zSize="sm" zDescription="small" />
    <z-empty zDescription="default" />
    <z-empty zSize="lg" zDescription="large" />
  `,
})
export class ZardDemoEmptySizeComponent {}

```