import { Component } from '@angular/core';

import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideHouse } from '@ng-icons/lucide';

import { ZardBreadcrumbImports } from '../breadcrumb.imports';

@Component({
  selector: 'z-demo-breadcrumb-default',
  imports: [ZardBreadcrumbImports, NgIcon],
  template: `
    <z-breadcrumb zWrap="wrap" zAlign="start">
      <z-breadcrumb-item [routerLink]="['/']">
        <ng-icon name="lucideHouse" />
        Home
      </z-breadcrumb-item>
      <z-breadcrumb-item [routerLink]="['/docs/components']">Components</z-breadcrumb-item>
      <z-breadcrumb-item>Breadcrumb</z-breadcrumb-item>
    </z-breadcrumb>
  `,
  viewProviders: [provideIcons({ lucideHouse })],
})
export class ZardDemoBreadcrumbDefaultComponent {}
