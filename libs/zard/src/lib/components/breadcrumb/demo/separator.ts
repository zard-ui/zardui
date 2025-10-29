import { Component } from '@angular/core';

import { ZardIconComponent } from '../../icon/icon.component';
import { ZardBreadcrumbModule } from '../breadcrumb.module';

@Component({
  selector: 'z-demo-breadcrumb-separator',
  standalone: true,
  imports: [ZardBreadcrumbModule, ZardIconComponent],
  template: `
    <z-breadcrumb [zSeparator]="customSeparator">
      <z-breadcrumb-item>Home</z-breadcrumb-item>
      <z-breadcrumb-item>Components</z-breadcrumb-item>
      <z-breadcrumb-item>Breadcrumb</z-breadcrumb-item>
    </z-breadcrumb>

    <ng-template #customSeparator>
      <z-icon zType="arrow-right"></z-icon>
    </ng-template>
  `,
})
export class ZardDemoBreadcrumbSeparatorComponent {}
