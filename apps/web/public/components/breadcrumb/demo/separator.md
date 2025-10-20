```angular-ts showLineNumbers copyButton
import { Component } from '@angular/core';

import { ZardBreadcrumbModule } from '../breadcrumb.module';

@Component({
  standalone: true,
  imports: [ZardBreadcrumbModule],
  template: `
    <z-breadcrumb [zSeparator]="customSeparator">
      <z-breadcrumb-item>Home</z-breadcrumb-item>
      <z-breadcrumb-item>Components</z-breadcrumb-item>
      <z-breadcrumb-item>Breadcrumb</z-breadcrumb-item>
    </z-breadcrumb>

    <ng-template #customSeparator>
      <div class="icon-arrow-right"></div>
    </ng-template>
  `,
})
export class ZardDemoBreadcrumbSeparatorComponent {}

```