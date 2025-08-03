import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import {
  ZardTableComponent,
  ZardTableHeaderComponent,
  ZardTableBodyComponent,
  ZardTableRowComponent,
  ZardTableHeadComponent,
  ZardTableCellComponent,
  ZardTableCaptionComponent,
} from './table.component';

const TABLE_COMPONENTS = [
  ZardTableComponent,
  ZardTableHeaderComponent,
  ZardTableBodyComponent,
  ZardTableRowComponent,
  ZardTableHeadComponent,
  ZardTableCellComponent,
  ZardTableCaptionComponent,
];

@NgModule({
  imports: [CommonModule, ...TABLE_COMPONENTS],
  exports: [...TABLE_COMPONENTS],
})
export class ZardTableModule {}
