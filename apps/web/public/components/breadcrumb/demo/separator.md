```angular-ts showLineNumbers copyButton
import { Component } from '@angular/core';

import { ZardIconComponent } from '../../icon/icon.component';
import { ZardBreadcrumbImports } from '../breadcrumb.imports';

@Component({
  selector: 'z-demo-breadcrumb-separator',
  imports: [ZardBreadcrumbImports, ZardIconComponent],
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

```