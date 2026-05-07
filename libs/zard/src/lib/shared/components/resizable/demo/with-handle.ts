import { Component } from '@angular/core';

import { ZardResizableImports } from '@/shared/components/resizable/resizable.imports';

@Component({
  selector: 'z-demo-resizable-with-handle',
  imports: [...ZardResizableImports],
  template: `
    <div class="space-y-4">
      <z-resizable class="h-60 w-80 rounded-lg border sm:w-96">
        <z-resizable-panel [zDefaultSize]="25">
          <div class="flex h-full items-center justify-center p-6">
            <span class="font-semibold">Sidebar</span>
          </div>
        </z-resizable-panel>
        <z-resizable-handle zWithHandle />
        <z-resizable-panel [zDefaultSize]="75">
          <div class="flex h-full items-center justify-center p-6">
            <span class="font-semibold">Content</span>
          </div>
        </z-resizable-panel>
      </z-resizable>
    </div>
  `,
})
export class ZardDemoResizableWithHandleComponent {}
