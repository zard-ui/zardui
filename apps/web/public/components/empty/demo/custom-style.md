```angular-ts showLineNumbers copyButton
import { Component } from '@angular/core';
import { ZardEmptyComponent } from '../empty.component';

@Component({
  standalone: true,
  imports: [ZardEmptyComponent],
  template: ` <z-empty class="rounded-xl bg-[#fdfdfd] shadow-[0_4px_12px_rgba(0,0,0,0.08)] p-4" /> `,
})
export class ZardDemoEmptyCustomStyleComponent {}

```