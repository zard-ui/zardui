import { ChangeDetectionStrategy, Component } from '@angular/core';

import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideChevronDown } from '@ng-icons/lucide';

import { ZardBreadcrumbImports } from '@/shared/components/breadcrumb/breadcrumb.imports';
import { ZardDropdownImports } from '@/shared/components/dropdown/dropdown.imports';

@Component({
  selector: 'z-demo-breadcrumb-dropdown',
  imports: [ZardBreadcrumbImports, ZardDropdownImports, NgIcon],
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
          z-dropdown
          [zDropdownMenu]="componentsMenu"
        >
          Components
          <ng-icon name="lucideChevronDown" class="size-3.5!" aria-hidden="true" />
        </button>

        <z-dropdown-menu-content #componentsMenu="zDropdownMenuContent" class="w-48">
          <z-dropdown-menu-item>Documentation</z-dropdown-menu-item>
          <z-dropdown-menu-item>Themes</z-dropdown-menu-item>
          <z-dropdown-menu-item>GitHub</z-dropdown-menu-item>
        </z-dropdown-menu-content>
      </z-breadcrumb-item>
      <z-breadcrumb-item>
        <span z-breadcrumb-page>Breadcrumb</span>
      </z-breadcrumb-item>
    </z-breadcrumb>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  viewProviders: [provideIcons({ lucideChevronDown })],
})
export class ZardDemoBreadcrumbDropdownComponent {}
