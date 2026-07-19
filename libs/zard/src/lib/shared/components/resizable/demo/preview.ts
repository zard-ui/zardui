import { Component, ViewEncapsulation } from '@angular/core';

import { ZardResizableImports } from '@/shared/components/resizable/resizable.imports';

@Component({
  selector: 'z-demo-resizable-preview',
  imports: [...ZardResizableImports],
  template: `
    <z-resizable class="h-60 w-80 rounded-lg border sm:w-96">
      <z-resizable-panel>
        <div class="flex h-full items-center justify-center p-6">
          <span class="font-semibold">One</span>
        </div>
      </z-resizable-panel>
      <z-resizable-handle zWithHandle />
      <z-resizable-panel>
        <z-resizable zLayout="vertical">
          <z-resizable-panel zDefaultSize="25">
            <div class="flex h-full items-center justify-center p-6">
              <span class="font-semibold">Two</span>
            </div>
          </z-resizable-panel>
          <z-resizable-handle zWithHandle />
          <z-resizable-panel zDefaultSize="75">
            <div class="flex h-full items-center justify-center p-6">
              <span class="font-semibold">Three</span>
            </div>
          </z-resizable-panel>
        </z-resizable>
      </z-resizable-panel>
    </z-resizable>
  `,
  encapsulation: ViewEncapsulation.None,
})
export class ZardDemoResizablePreviewComponent {}
