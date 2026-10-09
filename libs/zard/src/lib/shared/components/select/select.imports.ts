export {
  ZardSelectGroupComponent,
  ZardSelectLabelComponent,
  ZardSelectSeparatorComponent,
} from './select-group.component';
export { ZardSelectItemComponent } from './select-item.component';
export { ZardSelectComponent } from './select.component';

import {
  ZardSelectGroupComponent,
  ZardSelectLabelComponent,
  ZardSelectSeparatorComponent,
} from './select-group.component';
import { ZardSelectItemComponent } from './select-item.component';
import { ZardSelectComponent } from './select.component';

export const ZardSelectImports = [
  ZardSelectComponent,
  ZardSelectGroupComponent,
  ZardSelectItemComponent,
  ZardSelectLabelComponent,
  ZardSelectSeparatorComponent,
] as const;
