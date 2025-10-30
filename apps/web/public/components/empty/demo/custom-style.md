```angular-ts showLineNumbers copyButton
import { Component } from '@angular/core';

import { ZardEmptyComponent } from '../empty.component';

@Component({
  selector: 'z-demo-empty-custom-style',
  standalone: true,
  imports: [ZardEmptyComponent],
  template: ` <z-empty class="rounded-xl p-4 shadow-[0_4px_12px_rgba(0,0,0,0.08)] dark:shadow-[0_4px_12px_rgba(255,255,255,0.1)]" /> `,
})
export class ZardDemoEmptyCustomStyleComponent {}

```