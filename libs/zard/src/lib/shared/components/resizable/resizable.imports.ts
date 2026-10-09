export { ZardResizableHandleComponent } from './resizable-handle.component';
export { ZardResizablePanelComponent } from './resizable-panel.component';
export { ZardResizableComponent } from './resizable.component';

import { ZardResizableHandleComponent } from './resizable-handle.component';
import { ZardResizablePanelComponent } from './resizable-panel.component';
import { ZardResizableComponent } from './resizable.component';

export const ZardResizableImports = [
  ZardResizableComponent,
  ZardResizableHandleComponent,
  ZardResizablePanelComponent,
] as const;
