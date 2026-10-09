import {
  ZardSelectGroupComponent,
  ZardSelectLabelComponent,
  ZardSelectSeparatorComponent,
} from '@/shared/components/select/select-group.component';
import { ZardSelectItemComponent } from '@/shared/components/select/select-item.component';
import { ZardSelectComponent } from '@/shared/components/select/select.component';

export const ZardSelectImports = [
  ZardSelectComponent,
  ZardSelectGroupComponent,
  ZardSelectItemComponent,
  ZardSelectLabelComponent,
  ZardSelectSeparatorComponent,
] as const;
