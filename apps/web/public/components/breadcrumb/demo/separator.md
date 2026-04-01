```angular-ts showLineNumbers copyButton
import { Component } from '@angular/core';

import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideArrowRight } from '@ng-icons/lucide';

import { ZardBreadcrumbImports } from '@/shared/components/breadcrumb/breadcrumb.imports';

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
      <ng-icon name="lucideArrowRight" />
    </ng-template>
  `,
  viewProviders: [provideIcons({ lucideArrowRight })],
})
export class ZardDemoBreadcrumbSeparatorComponent {}

```