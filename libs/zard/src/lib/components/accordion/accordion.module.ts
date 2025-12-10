import { NgModule } from '@angular/core';

import { ZardAccordionItemComponent } from './accordion-item.component';
import { ZardAccordionComponent } from './accordion.component';

@NgModule({
  imports: [ZardAccordionComponent, ZardAccordionItemComponent],
  exports: [ZardAccordionComponent, ZardAccordionItemComponent],
})
export class ZardAccordionModule {}
