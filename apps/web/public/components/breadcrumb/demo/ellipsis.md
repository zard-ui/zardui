```angular-ts showLineNumbers copyButton
import { Component } from '@angular/core';

import { ZardMenuModule } from '../../menu/menu.module';
import { ZardBreadcrumbModule } from '../breadcrumb.module';

@Component({
  selector: 'z-demo-breadcrumb-ellipsis',
  standalone: true,
  imports: [ZardBreadcrumbModule, ZardMenuModule],
  template: `
    <z-breadcrumb>
      <z-breadcrumb-item [routerLink]="['/']">Home</z-breadcrumb-item>
      <z-breadcrumb-item>
        <z-breadcrumb-ellipsis z-menu [zMenuTriggerFor]="ellipsisMenu" />

        <ng-template #ellipsisMenu>
          <div z-menu-content class="w-48">
            <button type="button" z-menu-item>Getting Started</button>
            <button type="button" z-menu-item>Installation</button>
          </div>
        </ng-template>
      </z-breadcrumb-item>
      <z-breadcrumb-item>Components</z-breadcrumb-item>
      <z-breadcrumb-item>Breadcrumb</z-breadcrumb-item>
    </z-breadcrumb>
  `,
})
export class ZardDemoBreadcrumbEllipsisComponent {}

```