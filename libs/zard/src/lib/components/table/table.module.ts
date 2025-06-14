import { NgModule } from '@angular/core';

import { ZardTableDirective, ZardTbodyDirective, ZardTdDirective, ZardThDirective, ZardTheadDirective, ZardTrDirective } from './table.directive';
import { ZThSortableDirective } from './zThSortable.directive';

const directives = [ZardTableDirective, ZardTheadDirective, ZardTbodyDirective, ZardTrDirective, ZardThDirective, ZardTdDirective, ZThSortableDirective];

@NgModule({
  imports: directives,
  exports: directives,
})
export class ZardTableModule {}
