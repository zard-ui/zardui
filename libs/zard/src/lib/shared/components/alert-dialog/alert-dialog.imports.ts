export {
  ZardAlertDialogCloseDirective,
  ZardAlertDialogComponent,
  ZardAlertDialogDescriptionComponent,
  ZardAlertDialogFooterComponent,
  ZardAlertDialogHeaderComponent,
  ZardAlertDialogMediaComponent,
  ZardAlertDialogTitleComponent,
} from './alert-dialog.component';

import {
  ZardAlertDialogCloseDirective,
  ZardAlertDialogComponent,
  ZardAlertDialogDescriptionComponent,
  ZardAlertDialogFooterComponent,
  ZardAlertDialogHeaderComponent,
  ZardAlertDialogMediaComponent,
  ZardAlertDialogTitleComponent,
} from './alert-dialog.component';

/** Every part of the declarative alert dialog, for a template that composes one. */
export const ZardAlertDialogImports = [
  ZardAlertDialogComponent,
  ZardAlertDialogHeaderComponent,
  ZardAlertDialogMediaComponent,
  ZardAlertDialogTitleComponent,
  ZardAlertDialogDescriptionComponent,
  ZardAlertDialogFooterComponent,
  ZardAlertDialogCloseDirective,
] as const;
