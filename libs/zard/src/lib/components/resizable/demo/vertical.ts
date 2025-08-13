import { Component } from '@angular/core';

import { ZardResizableHandleComponent } from '../resizable-handle.component';
import { ZardResizablePanelComponent } from '../resizable-panel.component';
import { ZardResizableComponent } from '../resizable.component';

@Component({
  selector: 'z-demo-resizable-vertical',
  standalone: true,
  imports: [ZardResizableComponent, ZardResizablePanelComponent, ZardResizableHandleComponent],
  template: `
    <z-resizable zLayout="vertical" class="h-[400px] w-[500px] max-w-md rounded-lg border">
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
