import { Component } from '@angular/core';

import { ZardIconComponent } from '@ngzard/ui/icon';

import { ZardBreadcrumbModule } from '../breadcrumb.module';

@Component({
  selector: 'z-demo-breadcrumb-separator',
  imports: [ZardBreadcrumbModule, ZardIconComponent],
  standalone: true,
  template: `
    <z-breadcrumb [zSeparator]="customSeparator">
      <z-breadcrumb-item>Home</z-breadcrumb-item>
      <z-breadcrumb-item>Components</z-breadcrumb-item>
      <z-breadcrumb-item>Breadcrumb</z-breadcrumb-item>
    </z-breadcrumb>

    <ng-template #customSeparator>
      <z-icon zType="arrow-right" />
    </ng-template>
  `,
})
export class ZardDemoBreadcrumbSeparatorComponent {}
