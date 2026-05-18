import { Component } from '@angular/core';

import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideDot } from '@ng-icons/lucide';

import { ZardBreadcrumbImports } from '@/shared/components/breadcrumb/breadcrumb.imports';

@Component({
  selector: 'z-demo-breadcrumb-separator',
  imports: [ZardBreadcrumbImports, NgIcon],
  template: `
    <z-breadcrumb zLabel="Breadcrumb with custom separator">
      <z-breadcrumb-item>
        <a z-breadcrumb-link [routerLink]="['/']">Home</a>
      </z-breadcrumb-item>
      <li z-breadcrumb-separator>
        <ng-icon name="lucideDot" />
      </li>
      <z-breadcrumb-item>
        <a z-breadcrumb-link [routerLink]="['/docs/components']">Components</a>
      </z-breadcrumb-item>
      <li z-breadcrumb-separator>
        <ng-icon name="lucideDot" />
      </li>
      <z-breadcrumb-item>
        <span z-breadcrumb-page>Breadcrumb</span>
      </z-breadcrumb-item>
    </z-breadcrumb>
  `,
  viewProviders: [provideIcons({ lucideDot })],
})
export class ZardDemoBreadcrumbSeparatorComponent {}
