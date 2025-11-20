```angular-ts showLineNumbers copyButton
import { Component } from '@angular/core';

import { ZardSkeletonComponent } from '../skeleton.component';

@Component({
  selector: 'z-demo-skeleton-default',
  imports: [ZardSkeletonComponent],
  standalone: true,
  template: `
    <div class="flex items-center space-x-4">
      <z-skeleton class="h-12 w-12 rounded-full" />
      <div class="space-y-2">
        <z-skeleton class="h-4 w-[250px]" />
        <z-skeleton class="h-4 w-[200px]" />
      </div>
    </div>
  `,
})
export class ZardDemoSkeletonDefaultComponent {}

```