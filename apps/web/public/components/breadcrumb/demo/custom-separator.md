```angular-ts showLineNumbers copyButton
import { Component } from '@angular/core';

import { ZardBreadcrumbModule } from '../breadcrumb.module';

@Component({
  standalone: true,
  imports: [ZardBreadcrumbModule],
  template: `
    <z-breadcrumb>
      <z-breadcrumb-item [routerLink]="['/']">Home</z-breadcrumb-item>
      <z-breadcrumb-separator>
        <div class="icon-move-right"></div>
      </z-breadcrumb-separator>
      <z-breadcrumb-item [routerLink]="['/components']">Components</z-breadcrumb-item>
      <z-breadcrumb-separator>
        <div class="icon-move-right"></div>
      </z-breadcrumb-separator>
      <z-breadcrumb-item>
        <span aria-current="page">Breadcrumb</span>
      </z-breadcrumb-item>
    </z-breadcrumb>
  `,
})
export class ZardDemoBreadcrumbCustomSeparatorComponent {}

```