import { Component } from '@angular/core';

import { ZardSeparatorComponent } from '../separator.component';

@Component({
  selector: 'z-demo-separator-preview',
  imports: [ZardSeparatorComponent],
  standalone: true,
  template: `
    <div class="flex max-w-sm flex-col gap-4 text-sm">
      <div class="flex flex-col gap-1.5">
        <div class="leading-none font-medium">Zard/ui</div>
        <div class="text-muted-foreground">The Next Level for Your Angular Projects</div>
      </div>
      <z-separator />
      <div>A set of beautifully designed components that you can customize, extend, and build on.</div>
    </div>
  `,
})
export class ZardDemoSeparatorPreviewComponent {}
