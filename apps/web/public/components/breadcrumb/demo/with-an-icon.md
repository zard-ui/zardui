```angular-ts showLineNumbers copyButton
import { Component } from '@angular/core';

import { ZardIconComponent } from '../../icon/icon.component';
import { ZardBreadcrumbModule } from '../breadcrumb.module';

@Component({
  standalone: true,
  imports: [ZardBreadcrumbModule, ZardIconComponent],
  template: `
    <z-breadcrumb>
      <z-breadcrumb-list zWrap="wrap" zAlign="start">
        <z-breadcrumb-item>
          <z-breadcrumb-link zLink="/">
            <div z-icon zType="house"></div>
            Home
          </z-breadcrumb-link>
        </z-breadcrumb-item>
        <z-breadcrumb-separator />
        <z-breadcrumb-item>
          <z-breadcrumb-link zLink="/components">
            <div z-icon zType="puzzle"></div>
            Components
          </z-breadcrumb-link>
        </z-breadcrumb-item>
        <z-breadcrumb-separator />
        <z-breadcrumb-item>
          <z-breadcrumb-page>
            <div z-icon zType="square-library"></div>
            Breadcrumb
          </z-breadcrumb-page>
        </z-breadcrumb-item>
      </z-breadcrumb-list>
    </z-breadcrumb>
  `,
})
export class ZardDemoBreadcrumbWithAnIconComponent {}

```