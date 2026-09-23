import { ChangeDetectionStrategy, Component } from '@angular/core';

import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideChevronDown } from '@ng-icons/lucide';

import { ZardBreadcrumbImports } from '@/shared/components/breadcrumb/breadcrumb.imports';
import { ZardNavigationMenuImports } from '@/shared/components/navigation-menu/navigation-menu.imports';

@Component({
  selector: 'z-demo-breadcrumb-dropdown',
  imports: [ZardBreadcrumbImports, ZardNavigationMenuImports, NgIcon],
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
          z-navigation-menu-trigger
          [zNavigationMenuTriggerFor]="componentsMenu"
        >
          Components
          <ng-icon name="lucideChevronDown" class="size-3.5!" aria-hidden="true" />
        </button>

        <ng-template #componentsMenu>
          <div z-navigation-menu-content class="w-48">
            <button type="button" z-navigation-menu-link>Documentation</button>
            <button type="button" z-navigation-menu-link>Themes</button>
            <button type="button" z-navigation-menu-link>Blocks</button>
          </div>
        </ng-template>
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
