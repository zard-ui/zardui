import { Component } from '@angular/core';
import { ZardBreadcrumbModule } from '../breadcrumb.module';
import { RouterLink } from '@angular/router';

@Component({
  standalone: true,
  imports: [ZardBreadcrumbModule, RouterLink],
  template: `
    <z-breadcrumb>
      <z-breadcrumb-item>
        <a [routerLink]="['../../']">Home</a>
      </z-breadcrumb-item>
      <z-breadcrumb-item>
        <a [routerLink]="['../../']">Component</a>
      </z-breadcrumb-item>
      <z-breadcrumb-item>Breadcrumb</z-breadcrumb-item>
    </z-breadcrumb>
  `,
})
export class ZardDemoBreadcrumbRouterLinkComponent {}
