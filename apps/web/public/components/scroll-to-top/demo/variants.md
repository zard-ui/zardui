```angular-ts showLineNumbers copyButton
import { Component } from '@angular/core';

import { ZardScrollToTopComponent } from '../scroll-to-top.component';

@Component({
  selector: 'z-demo-scroll-to-top-variants',
  imports: [ZardScrollToTopComponent],
  standalone: true,
  template: `
    <div class="relative">
      <div class="bg-background h-150 overflow-y-auto rounded-lg border p-6">
        <div class="space-y-4">
          <h3 class="text-lg font-semibold">Scroll down to see the button variants</h3>
          <div class="flex items-center justify-center gap-1">
            <svg
              class="text-muted-foreground h-5 w-5 animate-bounce"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
            </svg>
          </div>
          <div class="h-200 space-y-4">
            @for (i of [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]; track i) {
              <div class="rounded-lg border p-4">
                <p class="text-sm">Content block {{ i }}</p>
              </div>
            }
          </div>
        </div>
        <z-scroll-to-top variant="default" target="parent" class="right-6 bottom-30" />
        <z-scroll-to-top variant="outline" target="parent" class="right-6 bottom-18" />
        <z-scroll-to-top variant="subtle" target="parent" class="right-6 bottom-6" />
      </div>
    </div>
  `,
})
export class ZardDemoScrollToTopVariantsComponent {}

```