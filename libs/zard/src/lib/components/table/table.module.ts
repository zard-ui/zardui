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
  ZardThSortableDirective,
  ZardToolbarDirective,
} from './table.directive';

const directives = [
  ZardTableDirective,
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
  ZardThSortableDirective,
];

@NgModule({
  imports: directives,
  exports: directives,
})
export class ZardTableModule {}
