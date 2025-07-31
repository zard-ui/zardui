```angular-ts showLineNumbers
import { RouterLink } from '@angular/router';
import { Component } from '@angular/core';

import { ZardBreadcrumbModule } from '../breadcrumb.module';

@Component({
  standalone: true,
  imports: [ZardBreadcrumbModule, RouterLink],
  template: `
    <z-breadcrumb>
      <z-breadcrumb-list>
        <z-breadcrumb-item>
          <a [routerLink]="['../../']">Home</a>
        </z-breadcrumb-item>
        <z-breadcrumb-separator />
        <z-breadcrumb-item>
          <a [routerLink]="['../']">Component</a>
        </z-breadcrumb-item>
        <z-breadcrumb-separator />
        <z-breadcrumb-item>
          <z-breadcrumb-page>Breadcrumb</z-breadcrumb-page>
        </z-breadcrumb-item>
      </z-breadcrumb-list>
    </z-breadcrumb>
  `,
})
export class ZardDemoBreadcrumbRouterLinkComponent {}

```