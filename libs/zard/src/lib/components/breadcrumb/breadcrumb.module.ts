import { NgModule } from '@angular/core';

import { ZardBreadcrumbComponent, ZardBreadcrumbEllipsisComponent, ZardBreadcrumbItemComponent } from './breadcrumb.component';

const components = [ZardBreadcrumbComponent, ZardBreadcrumbItemComponent, ZardBreadcrumbEllipsisComponent];

@NgModule({
  imports: components,
  exports: components,
})
export class ZardBreadcrumbModule {}
