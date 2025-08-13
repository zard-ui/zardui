import { NgModule } from '@angular/core';

import {
  ZardDetailsDirective,
  ZardDropdownCheckboxDirective,
  ZardDropdownCheckIconWrapperDirective,
  ZardDropdownLiDirective,
  ZardDropdownLiLabelDirective,
  ZardDropdownUlDirective,
  ZardSummaryDirective,
  ZardTableDirective,
  ZardTableFilteringDirective,
  ZardTablePaginationDirective,
  ZardTableWrapperDirective,
  ZardTbodyDirective,
  ZardTdDirective,
  ZardThDirective,
  ZardTheadDirective,
  ZardToolbarDirective,
  ZardTrDirective,
} from './table.directive';

const directives = [
  ZardTableDirective,
  ZardTheadDirective,
  ZardTbodyDirective,
  ZardTrDirective,
  ZardThDirective,
  ZardTdDirective,
  ZardTableWrapperDirective,
  ZardTablePaginationDirective,
  ZardTableFilteringDirective,
  ZardSummaryDirective,
  ZardDetailsDirective,
  ZardDropdownUlDirective,
  ZardDropdownLiDirective,
  ZardDropdownCheckIconWrapperDirective,
  ZardDropdownCheckboxDirective,
  ZardToolbarDirective,
  ZardDropdownLiLabelDirective,
];

@NgModule({
  imports: directives,
  exports: directives,
})
export class ZardTableModule {}
