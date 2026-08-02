import { Component } from '@angular/core';

import { ZardBreadcrumbImports } from '../breadcrumb.imports';

@Component({
  selector: 'z-demo-breadcrumb-default',
  imports: [ZardBreadcrumbImports],
  template: `
    <z-breadcrumb zLabel="Default breadcrumb">
      <z-breadcrumb-item>
        <a z-breadcrumb-link [routerLink]="['/']">Home</a>
      </z-breadcrumb-item>
      <z-breadcrumb-item>
        <a z-breadcrumb-link [routerLink]="['/docs/components']">Components</a>
      </z-breadcrumb-item>
      <z-breadcrumb-item>
        <span z-breadcrumb-page>Breadcrumb</span>
      </z-breadcrumb-item>
    </z-breadcrumb>
  `,
})
export class ZardDemoBreadcrumbDefaultComponent {}
