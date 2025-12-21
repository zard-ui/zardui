import { Component } from '@angular/core';

import { ResizableImports } from '@/shared/components/resizable/resizable.imports';

@Component({
  selector: 'z-demo-resizable-default',
  imports: [ResizableImports],
  standalone: true,
  template: `
    <z-resizable class="h-50 w-125 max-w-md rounded-lg border">
      <z-resizable-panel>
        <div class="flex h-full items-center justify-center p-6">
          <span class="font-semibold">One</span>
        </div>
      </z-resizable-panel>
      <z-resizable-handle />
      <z-resizable-panel>
        <div class="flex h-full items-center justify-center p-6">
          <span class="font-semibold">Two</span>
        </div>
      </z-resizable-panel>
    </z-resizable>
  `,
})
export class ZardDemoResizableDefaultComponent {}
