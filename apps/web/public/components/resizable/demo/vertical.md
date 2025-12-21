```angular-ts showLineNumbers copyButton
import { Component } from '@angular/core';

import { ZardResizableImports } from '@/shared/components/resizable/resizable.imports';

@Component({
  selector: 'z-demo-resizable-vertical',
  imports: [ZardResizableImports],
  standalone: true,
  template: `
    <z-resizable zLayout="vertical" class="h-100 w-125 max-w-md rounded-lg border">
      <z-resizable-panel [zDefaultSize]="25">
        <div class="flex h-full items-center justify-center p-6">
          <span class="font-semibold">One</span>
        </div>
      </z-resizable-panel>
      <z-resizable-handle [zWithHandle]="true" />
      <z-resizable-panel [zDefaultSize]="75">
        <div class="flex h-full items-center justify-center p-6">
          <span class="font-semibold">Two</span>
        </div>
      </z-resizable-panel>
    </z-resizable>
  `,
})
export class ZardDemoResizableVerticalComponent {}

```