```angular-ts showLineNumbers copyButton
import { Component } from '@angular/core';

import { ZardBreadcrumbImports } from '@/shared/components/breadcrumb/breadcrumb.imports';
import { ZardMenuImports } from '@/shared/components/menu/menu.imports';

@Component({
  selector: 'z-demo-breadcrumb-ellipsis',
  imports: [ZardBreadcrumbImports, ZardMenuImports],
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