```angular-ts showLineNumbers copyButton
import { Component } from '@angular/core';

import { ZardBreadcrumbModule } from '@ngzard/ui/breadcrumb';
import { ZardIconComponent } from '@ngzard/ui/icon';

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

```