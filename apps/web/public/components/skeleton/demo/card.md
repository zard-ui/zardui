```angular-ts showLineNumbers copyButton
import { Component } from '@angular/core';

import { ZardSkeletonComponent } from '@ngzard/ui/skeleton';

@Component({
  selector: 'z-demo-skeleton-card',
  imports: [ZardSkeletonComponent],
  standalone: true,
  template: `
    <div class="flex flex-col space-y-3">
      <z-skeleton class="rounded-xll h-[125px] w-[250px]" />
      <div class="space-y-2">
        <z-skeleton class="h-4 w-[250px]" />
        <z-skeleton class="h-4 w-[200px]" />
      </div>
    </div>
  `,
})
export class ZardDemoSkeletonCardComponent {}

```