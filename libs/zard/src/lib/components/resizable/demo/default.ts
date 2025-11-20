import { Component } from '@angular/core';

import { ZardResizableHandleComponent } from '../resizable-handle.component';
import { ZardResizablePanelComponent } from '../resizable-panel.component';
import { ZardResizableComponent } from '../resizable.component';

@Component({
  selector: 'z-demo-resizable-default',
  imports: [ZardResizableComponent, ZardResizablePanelComponent, ZardResizableHandleComponent],
  standalone: true,
  template: `
    <z-resizable class="h-[200px] w-[500px] max-w-md rounded-lg border">
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
