import { NgModule } from '@angular/core';

import {
  ZardTableDirective,
  ZardTableFilteringDirective,
  ZardTablePaginationDirective,
  ZardTableWrapperDirective,
  ZardTbodyDirective,
  ZardTdDirective,
  ZardThDirective,
  ZardTheadDirective,
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
];

@NgModule({
  imports: directives,
  exports: directives,
})
export class ZardTableModule {}
