import { Component } from '@angular/core';

import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideChevronDown } from '@ng-icons/lucide';

import { ZardBreadcrumbImports } from '@/shared/components/breadcrumb/breadcrumb.imports';
import { ZardMenuImports } from '@/shared/components/menu/menu.imports';

@Component({
  selector: 'z-demo-breadcrumb-dropdown',
  imports: [ZardBreadcrumbImports, ZardMenuImports, NgIcon],
  template: `
    <z-breadcrumb zLabel="Breadcrumb with dropdown">
      <z-breadcrumb-item>
        <a z-breadcrumb-link [routerLink]="['/']">Home</a>
      </z-breadcrumb-item>
      <z-breadcrumb-item>
        <button
          z-breadcrumb-link
          type="button"
          class="flex items-center gap-1.5 border-0 bg-transparent p-0 text-inherit"
          z-menu
          [zMenuTriggerFor]="componentsMenu"
        >
          Components
          <ng-icon name="lucideChevronDown" class="size-3.5!" aria-hidden="true" />
        </button>

        <ng-template #componentsMenu>
          <div z-menu-content class="w-48">
            <button type="button" z-menu-item>Documentation</button>
            <button type="button" z-menu-item>Themes</button>
            <button type="button" z-menu-item>Blocks</button>
          </div>
        </ng-template>
      </z-breadcrumb-item>
      <z-breadcrumb-item>
        <span z-breadcrumb-page>Breadcrumb</span>
      </z-breadcrumb-item>
    </z-breadcrumb>
  `,
  viewProviders: [provideIcons({ lucideChevronDown })],
})
export class ZardDemoBreadcrumbDropdownComponent {}
