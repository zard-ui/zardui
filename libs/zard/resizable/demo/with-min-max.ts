import { Component } from '@angular/core';

import { ZardResizableHandleComponent, ZardResizableComponent } from '../resizable-handle.component';
import { ZardResizablePanelComponent } from '../resizable-panel.component';

@Component({
  selector: 'z-demo-resizable-with-min-max',
  imports: [ZardResizableComponent, ZardResizablePanelComponent, ZardResizableHandleComponent],
  standalone: true,
  template: `
    <div class="space-y-4">
      <z-resizable class="w-[500px] max-w-md rounded-lg border">
        <z-resizable-panel [zDefaultSize]="25" zMin="0" zMax="40%">
          <div class="flex h-[200px] items-center justify-center p-6">
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
