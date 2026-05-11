import { Component } from '@angular/core';

import { ZardResizableImports } from '@/shared/components/resizable/resizable.imports';

@Component({
  selector: 'z-demo-resizable-vertical',
  imports: [...ZardResizableImports],
  template: `
    <z-resizable zLayout="vertical" class="h-60 w-80 rounded-lg border sm:w-96">
      <z-resizable-panel [zDefaultSize]="30">
        <div class="flex h-full items-center justify-center p-6">
          <span class="font-semibold">Header</span>
        </div>
      </z-resizable-panel>
      <z-resizable-handle />
      <z-resizable-panel [zDefaultSize]="70">
        <div class="flex h-full items-center justify-center p-6">
          <span class="font-semibold">Content</span>
        </div>
      </z-resizable-panel>
    </z-resizable>
  `,
})
export class ZardDemoResizableVerticalComponent {}
