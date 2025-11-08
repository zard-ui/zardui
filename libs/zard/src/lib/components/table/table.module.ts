import { NgModule } from '@angular/core';

import {
  ZardTableBodyComponent,
  ZardTableCaptionComponent,
  ZardTableCellComponent,
  ZardTableHeadComponent,
  ZardTableHeaderComponent,
  ZardTableRowComponent,
} from './table.components';
import {
  ZardDetailsDirective,
  ZardDropdownCheckboxDirective,
  ZardDropdownCheckIconWrapperDirective,
  ZardDropdownLiDirective,
  ZardDropdownLiLabelDirective,
  ZardDropdownUlDirective,
  ZardSummaryDirective,
  ZardTableFilteringDirective,
  ZardTablePaginationDirective,
  ZardTableWrapperDirective,
  ZardThSortableDirective,
  ZardToolbarDirective,
} from './table.directive';

const directives = [
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

const components = [ZardTableHeadComponent, ZardTableBodyComponent, ZardTableHeaderComponent, ZardTableCellComponent, ZardTableRowComponent, ZardTableCaptionComponent];

@NgModule({
  imports: [directives, components],
  exports: [directives, components],
})
export class ZardTableModule {}
