```angular-ts showLineNumbers copyButton
import { Component } from '@angular/core';

import { NgIcon, provideIcons } from '@ng-icons/core';

import { zardArrowRightIcon } from '../../icon/icons';
import { ZardBreadcrumbImports } from '../breadcrumb.imports';

@Component({
  selector: 'z-demo-breadcrumb-separator',
  imports: [ZardBreadcrumbImports, NgIcon],
  template: `
    <z-breadcrumb [zSeparator]="customSeparator">
      <z-breadcrumb-item>Home</z-breadcrumb-item>
      <z-breadcrumb-item>Components</z-breadcrumb-item>
      <z-breadcrumb-item>Breadcrumb</z-breadcrumb-item>
    </z-breadcrumb>

    <ng-template #customSeparator>
      <ng-icon name="arrow-right" />
    </ng-template>
  `,
  viewProviders: [provideIcons({ arrowRight: zardArrowRightIcon })],
})
export class ZardDemoBreadcrumbSeparatorComponent {}

```