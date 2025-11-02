```angular-ts showLineNumbers copyButton
import { Component } from '@angular/core';

import { ZardResizableHandleComponent } from '../resizable-handle.component';
import { ZardResizablePanelComponent } from '../resizable-panel.component';
import { ZardResizableComponent } from '../resizable.component';

@Component({
  selector: 'z-demo-resizable-with-min-max',
  standalone: true,
  imports: [ZardResizableComponent, ZardResizablePanelComponent, ZardResizableHandleComponent],
  template: `
    <div class="space-y-4">
      <z-resizable class="max-w-md w-[500px] rounded-lg border">
        <z-resizable-panel [zDefaultSize]="25" zMin="0" zMax="40%">
          <div class="flex h-[200px] items-center justify-center p-6">
            <span class="font-semibold">One</span>
          </div>
        </z-resizable-panel>
        <z-resizable-handle zWithHandle />
        <z-resizable-panel [zDefaultSize]="75" [zMin]="'100px'">
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
