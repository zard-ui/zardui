import { NgModule } from '@angular/core';

import { ZardResizableHandleComponent } from './resizable-handle.component';
import { ZardResizablePanelComponent } from './resizable-panel.component';
import { ZardResizableComponent } from './resizable.component';

const RESIZABLE_COMPONENTS = [ZardResizableComponent, ZardResizableHandleComponent, ZardResizablePanelComponent];

@NgModule({
  imports: [...RESIZABLE_COMPONENTS],
  exports: [...RESIZABLE_COMPONENTS],
})
export class ResizbleModule {}
