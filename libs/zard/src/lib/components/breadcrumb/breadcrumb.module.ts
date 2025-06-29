import { NgModule } from '@angular/core';

import {
  ZardBreadcrumbComponent,
  ZardBreadcrumbEllipsisComponent,
  ZardBreadcrumbItemComponent,
  ZardBreadcrumbLinkComponent,
  ZardBreadcrumbListComponent,
  ZardBreadcrumbPageComponent,
  ZardBreadcrumbSeparatorComponent,
} from './breadcrumb.component';

const components = [
  ZardBreadcrumbComponent,
  ZardBreadcrumbListComponent,
  ZardBreadcrumbItemComponent,
  ZardBreadcrumbLinkComponent,
  ZardBreadcrumbPageComponent,
  ZardBreadcrumbSeparatorComponent,
  ZardBreadcrumbEllipsisComponent,
];

@NgModule({
  imports: components,
  exports: components,
})
export class ZardBreadcrumbModule {}
