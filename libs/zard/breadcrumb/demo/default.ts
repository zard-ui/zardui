import { Component } from '@angular/core';

import { ZardIconComponent } from '@ngzard/ui/icon';

import { ZardBreadcrumbModule } from '../breadcrumb.module';

@Component({
  selector: 'z-demo-breadcrumb-default',
  imports: [ZardBreadcrumbModule, ZardIconComponent],
  standalone: true,
  template: `
    <z-breadcrumb zWrap="wrap" zAlign="start">
      <z-breadcrumb-item [routerLink]="['/']">
        <z-icon zType="house" />
        Home
      </z-breadcrumb-item>
      <z-breadcrumb-item [routerLink]="['/docs/components']">Components</z-breadcrumb-item>
      <z-breadcrumb-item>Breadcrumb</z-breadcrumb-item>
    </z-breadcrumb>
  `,
})
export class ZardDemoBreadcrumbDefaultComponent {}
