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
          <h3 class="text-lg font-semibold">Scroll down to see the buttons</h3>
          <p class="text-muted-foreground">Different visual styles for the scroll-to-top button.</p>
          <div class="h-300 space-y-4">
            @for (i of [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]; track i) {
              <div class="rounded-lg border p-4">
                <p class="text-sm">Content block {{ i }}</p>
              </div>
            }
          </div>
        </div>
        <z-scroll-to-top variant="default" target="parent" class="right-6 bottom-24" />
        <z-scroll-to-top variant="outline" target="parent" class="right-6 bottom-12" />
        <z-scroll-to-top variant="subtle" target="parent" class="right-6 bottom-6" />
      </div>
    </div>
  `,
})
export class ZardDemoScrollToTopVariantsComponent {}
