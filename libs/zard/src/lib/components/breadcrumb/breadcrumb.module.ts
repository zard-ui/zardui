import { NgModule } from '@angular/core';
import { ZardBreadcrumbComponent, ZardBreadcrumbItemComponent, ZardBreadcrumbSeparatorComponent } from './breadcrumb.component';

const components = [ZardBreadcrumbComponent, ZardBreadcrumbItemComponent, ZardBreadcrumbSeparatorComponent];

@NgModule({
  imports: components,
  exports: components,
})
export class ZardBreadcrumbModule {}
