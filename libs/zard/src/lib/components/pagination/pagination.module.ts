import { NgModule } from '@angular/core';

import {
  ZardPaginationBasicComponent,
  ZardPaginationComponent,
  ZardPaginationContentComponent,
  ZardPaginationEllipsisComponent,
  ZardPaginationItemComponent,
  ZardPaginationLinkComponent,
  ZardPaginationNextComponent,
  ZardPaginationPreviousComponent,
} from './pagination.component';

const components = [
  ZardPaginationBasicComponent,
  ZardPaginationContentComponent,
  ZardPaginationItemComponent,
  ZardPaginationLinkComponent,
  ZardPaginationPreviousComponent,
  ZardPaginationNextComponent,
  ZardPaginationEllipsisComponent,
  ZardPaginationComponent,
];

@NgModule({
  imports: components,
  exports: components,
})
export class ZardPaginationModule {}
