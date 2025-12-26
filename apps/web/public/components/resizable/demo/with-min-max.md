```angular-ts showLineNumbers copyButton
import { Component } from '@angular/core';

import { ZardResizableImports } from '@/shared/components/resizable/resizable.imports';

@Component({
  selector: 'z-demo-resizable-with-min-max',
  imports: [ZardResizableImports],
  standalone: true,
  template: `
    <div class="space-y-4">
      <z-resizable class="w-125 max-w-md rounded-lg border">
        <z-resizable-panel [zDefaultSize]="25" zMin="0" zMax="40%">
          <div class="flex h-50 items-center justify-center p-6">
            <span class="font-semibold">One</span>
          </div>
        </z-resizable-panel>
        <z-resizable-handle zWithHandle />
        <z-resizable-panel [zDefaultSize]="75" zMin="100px">
          <div class="flex h-full items-center justify-center p-6">
            <span class="font-semibold">Two</span>
          </div>
        </z-resizable-panel>
      </z-resizable>
    </div>
  `,
})
export class ZardDemoResizableWithMinMaxComponent {}

```