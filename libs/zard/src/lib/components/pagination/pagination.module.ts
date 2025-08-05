import { NgModule } from '@angular/core';

import {
  ZardPaginationComponent,
  ZardPaginationContentComponent,
  ZardPaginationEllipsisComponent,
  ZardPaginationItemComponent,
  ZardPaginationLinkComponent,
  ZardPaginationNextComponent,
  ZardPaginationPreviousComponent,
} from './pagination.component';

const components = [
  ZardPaginationComponent,
  ZardPaginationContentComponent,
  ZardPaginationItemComponent,
  ZardPaginationLinkComponent,
  ZardPaginationPreviousComponent,
  ZardPaginationNextComponent,
  ZardPaginationEllipsisComponent,
];

@NgModule({
  imports: components,
  exports: components,
})
export class ZardPaginationModule {}
