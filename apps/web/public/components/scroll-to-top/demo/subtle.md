```angular-ts showLineNumbers copyButton
import { Component } from '@angular/core';

import { ZardScrollToTopComponent } from '../scroll-to-top.component';

@Component({
  selector: 'z-demo-scroll-to-top-subtle',
  imports: [ZardScrollToTopComponent],
  standalone: true,
  template: `
    <div class="space-y-4">
      <h3 class="text-lg font-semibold">Subtle variant</h3>
      <p class="text-muted-foreground">Scroll down to see the subtle style button.</p>
      @for (i of [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20]; track i) {
        <div class="rounded-lg border p-4">
          <p class="text-sm">Content block {{ i }}</p>
        </div>
      }
    </div>
    <z-scroll-to-top variant="subtle" />
  `,
})
export class ZardDemoScrollToTopSubtleComponent {}

```