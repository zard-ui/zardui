```angular-ts showLineNumbers copyButton
import { Component } from '@angular/core';

import { ZardIconComponent } from '../../icon/icon.component';
import { ZardBreadcrumbModule } from '../breadcrumb.module';

@Component({
  standalone: true,
  imports: [ZardBreadcrumbModule, ZardIconComponent],
  template: `
    <z-breadcrumb>
      <z-breadcrumb-list>
        <z-breadcrumb-item>
          <z-breadcrumb-link zLink="/">Home</z-breadcrumb-link>
        </z-breadcrumb-item>
        <z-breadcrumb-separator>
          <div z-icon zType="move-right"></div>
        </z-breadcrumb-separator>
        <z-breadcrumb-item>
          <z-breadcrumb-link zLink="/components">Components</z-breadcrumb-link>
        </z-breadcrumb-item>
        <z-breadcrumb-separator>
          <div z-icon zType="move-right"></div>
        </z-breadcrumb-separator>
        <z-breadcrumb-item>
          <z-breadcrumb-page>Breadcrumb</z-breadcrumb-page>
        </z-breadcrumb-item>
      </z-breadcrumb-list>
    </z-breadcrumb>
  `,
})
export class ZardDemoBreadcrumbCustomSeparatorComponent {}

```