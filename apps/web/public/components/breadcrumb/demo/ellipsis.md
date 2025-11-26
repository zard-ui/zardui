```angular-ts showLineNumbers copyButton
import { Component } from '@angular/core';

import { ZardBreadcrumbModule } from '@ngzard/ui/breadcrumb';
import { ZardMenuModule } from '@ngzard/ui/menu';

@Component({
  selector: 'z-demo-breadcrumb-ellipsis',
  imports: [ZardBreadcrumbModule, ZardMenuModule],
  standalone: true,
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