import { Component } from '@angular/core';

import { ZardBreadcrumbModule } from '../breadcrumb.module';

@Component({
  standalone: true,
  imports: [ZardBreadcrumbModule],
  template: `
    <z-breadcrumb zWrap="wrap" zAlign="start">
      <z-breadcrumb-item [routerLink]="['/']">
        <i class="icon-house"></i>
        Home
      </z-breadcrumb-item>
      <z-breadcrumb-separator />
      <z-breadcrumb-item [routerLink]="['/components']">
        <i class="icon-puzzle"></i>
        Components
      </z-breadcrumb-item>
      <z-breadcrumb-separator />
      <z-breadcrumb-item>
        <i class="icon-square-library"></i>
        Breadcrumb
      </z-breadcrumb-item>
    </z-breadcrumb>
  `,
})
export class ZardDemoBreadcrumbWithAnIconComponent {}
