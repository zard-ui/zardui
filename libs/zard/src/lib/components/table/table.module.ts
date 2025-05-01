import { NgModule } from '@angular/core';

import { ZardTableDirective, ZardTbodyDirective, ZardTdDirective, ZardThDirective, ZardTheadDirective, ZardTrDirective } from './table.directive';

const directives = [ZardTableDirective, ZardTheadDirective, ZardTbodyDirective, ZardTrDirective, ZardThDirective, ZardTdDirective];

@NgModule({
  imports: directives,
  exports: directives,
})
export class ZardTableModule {}
