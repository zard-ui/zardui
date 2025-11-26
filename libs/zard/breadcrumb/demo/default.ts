import { Component } from '@angular/core';

import { ZardBreadcrumbModule } from '@ngzard/ui/breadcrumb';
import { ZardIconComponent } from '@ngzard/ui/icon';

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
