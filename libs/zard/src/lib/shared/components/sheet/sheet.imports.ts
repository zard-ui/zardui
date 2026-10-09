export {
  ZardSheetCloseDirective,
  ZardSheetComponent,
  ZardSheetDescriptionComponent,
  ZardSheetFooterComponent,
  ZardSheetHeaderComponent,
  ZardSheetTitleComponent,
} from './sheet.component';

import {
  ZardSheetCloseDirective,
  ZardSheetComponent,
  ZardSheetDescriptionComponent,
  ZardSheetFooterComponent,
  ZardSheetHeaderComponent,
  ZardSheetTitleComponent,
} from './sheet.component';

/** Every part of the declarative sheet, for a template that composes one. */
export const ZardSheetImports = [
  ZardSheetComponent,
  ZardSheetHeaderComponent,
  ZardSheetTitleComponent,
  ZardSheetDescriptionComponent,
  ZardSheetFooterComponent,
  ZardSheetCloseDirective,
] as const;
