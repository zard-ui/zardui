```angular-ts showLineNumbers copyButton
import { Component } from '@angular/core';

import { NgIcon, provideIcons } from '@ng-icons/core';

import { ZardIconRegistry } from '@/shared/core';

import { ZardBreadcrumbImports } from '../breadcrumb.imports';

@Component({
  selector: 'z-demo-breadcrumb-default',
  imports: [ZardBreadcrumbImports, NgIcon],
  template: `
    <z-breadcrumb zWrap="wrap" zAlign="start">
      <z-breadcrumb-item [routerLink]="['/']">
        <ng-icon name="house" />
        Home
      </z-breadcrumb-item>
      <z-breadcrumb-item [routerLink]="['/docs/components']">Components</z-breadcrumb-item>
      <z-breadcrumb-item>Breadcrumb</z-breadcrumb-item>
    </z-breadcrumb>
  `,
  viewProviders: [provideIcons({ house: ZardIconRegistry.house })],
})
export class ZardDemoBreadcrumbDefaultComponent {}

```