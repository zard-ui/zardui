import { Component } from '@angular/core';

import { ZardBreadcrumbModule } from '../breadcrumb.module';

@Component({
  standalone: true,
  imports: [ZardBreadcrumbModule],
  template: `
    <z-breadcrumb>
      <z-breadcrumb-list zWrap="wrap" zAlign="start">
        <z-breadcrumb-item>
          <z-breadcrumb-link zLink="/">
            <div class="icon-house"></div>
            Home
          </z-breadcrumb-link>
        </z-breadcrumb-item>
        <z-breadcrumb-separator />
        <z-breadcrumb-item>
          <z-breadcrumb-link zLink="/components">
            <div class="icon-puzzle"></div>
            Components
          </z-breadcrumb-link>
        </z-breadcrumb-item>
        <z-breadcrumb-separator />
        <z-breadcrumb-item>
          <z-breadcrumb-page>
            <div class="icon-square-library"></div>
            Breadcrumb
          </z-breadcrumb-page>
        </z-breadcrumb-item>
      </z-breadcrumb-list>
    </z-breadcrumb>
  `,
})
export class ZardDemoBreadcrumbWithAnIconComponent {}
