```angular-ts showLineNumbers
import { Component } from '@angular/core';

import { ZardBreadcrumbModule } from '../breadcrumb.module';

@Component({
  standalone: true,
  imports: [ZardBreadcrumbModule],
  template: `
    <z-breadcrumb>
      <z-breadcrumb-list>
        <z-breadcrumb-item>
          <z-breadcrumb-link zLink="/">Home</z-breadcrumb-link>
        </z-breadcrumb-item>
        <z-breadcrumb-separator />
        <z-breadcrumb-item>
          <z-breadcrumb-ellipsis />
        </z-breadcrumb-item>
        <z-breadcrumb-separator />
        <z-breadcrumb-item>
          <z-breadcrumb-link zLink="/components">Components</z-breadcrumb-link>
        </z-breadcrumb-item>
        <z-breadcrumb-separator />
        <z-breadcrumb-item>
          <z-breadcrumb-page>Breadcrumb</z-breadcrumb-page>
        </z-breadcrumb-item>
      </z-breadcrumb-list>
    </z-breadcrumb>
  `,
})
export class ZardDemoBreadcrumbCollapsedComponent {}

```