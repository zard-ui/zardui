import { NgModule } from '@angular/core';

import { ZardBreadcrumbComponent, ZardBreadcrumbEllipsisComponent, ZardBreadcrumbItemComponent, ZardBreadcrumbSeparatorComponent } from './breadcrumb.component';

const components = [ZardBreadcrumbComponent, ZardBreadcrumbItemComponent, ZardBreadcrumbSeparatorComponent, ZardBreadcrumbEllipsisComponent];

@NgModule({
  imports: components,
  exports: components,
})
export class ZardBreadcrumbModule {}
