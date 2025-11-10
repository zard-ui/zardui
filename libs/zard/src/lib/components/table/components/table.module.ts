import { NgModule } from '@angular/core';

import { ZardTableColumnSelectorComponent } from './column-selector/table-column-selector.component';
import { ZardTableFilteringComponent } from './filtering/table-filtering.component';
import { ZardTablePaginationComponent } from './pagination/table-pagination.component';
import {
  ZardTableBodyComponent,
  ZardTableCaptionComponent,
  ZardTableCellComponent,
  ZardTableHeadComponent,
  ZardTableHeaderComponent,
  ZardTableRowComponent,
  ZardTableWrapperComponent,
} from './table.components';

const components = [
  ZardTableWrapperComponent,
  ZardTableHeadComponent,
  ZardTableBodyComponent,
  ZardTableHeaderComponent,
  ZardTableCellComponent,
  ZardTableRowComponent,
  ZardTableCaptionComponent,
  ZardTablePaginationComponent,
  ZardTableFilteringComponent,
  ZardTableColumnSelectorComponent,
];

@NgModule({
  imports: components,
  exports: components,
})
export class ZardTableModule {}
