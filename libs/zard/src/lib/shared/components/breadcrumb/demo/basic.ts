import { ChangeDetectionStrategy, Component } from '@angular/core';

import { ZardBreadcrumbImports } from '../breadcrumb.imports';

@Component({
  selector: 'z-demo-breadcrumb-basic',
  imports: [ZardBreadcrumbImports],
  template: `
    <z-breadcrumb zLabel="Basic breadcrumb">
      <z-breadcrumb-item>
        <a z-breadcrumb-link href="/">Home</a>
      </z-breadcrumb-item>
      <z-breadcrumb-item>
        <a z-breadcrumb-link href="/docs/components">Components</a>
      </z-breadcrumb-item>
      <z-breadcrumb-item>
        <span z-breadcrumb-page>Breadcrumb</span>
      </z-breadcrumb-item>
    </z-breadcrumb>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ZardDemoBreadcrumbBasicComponent {}
