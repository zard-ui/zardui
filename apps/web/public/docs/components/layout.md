---
title: Layout
description: A set of layout components for creating common page structures with header, footer, sidebar, and content areas.
---

# Layout

A set of layout components for creating common page structures with header, footer, sidebar, and content areas.

## Installation

### CLI

```bash
npx zard-cli@latest add layout
```

### Manual

```angular-ts
import { ChangeDetectionStrategy, Component, computed, contentChildren, input, ViewEncapsulation } from '@angular/core';

import type { ClassValue } from 'clsx';

import { layoutVariants, type LayoutVariants } from '@/shared/components/layout/layout.variants';
import { SidebarComponent } from '@/shared/components/layout/sidebar.component';
import { mergeClasses } from '@/shared/utils/merge-classes';

@Component({
  selector: 'z-layout',
  template: `
    <ng-content />
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: {
    '[class]': 'classes()',
  },
  exportAs: 'zLayout',
})
export class LayoutComponent {
  readonly class = input<ClassValue>('');
  readonly zDirection = input<LayoutVariants>('auto');

  // Query for direct sidebar children to auto-detect layout direction
  private readonly sidebars = contentChildren(SidebarComponent, { descendants: false });

  private readonly detectedDirection = computed(() => {
    if (this.zDirection() !== 'auto') {
      return this.zDirection();
    }

    // Auto-detection: Check if there are any sidebar children
    const hasSidebar = this.sidebars().length > 0;
    return hasSidebar ? 'horizontal' : 'vertical';
  });

  protected readonly classes = computed(() =>
    mergeClasses(
      layoutVariants({
        zDirection: this.detectedDirection(),
      }),
      this.class(),
    ),
  );
}
```

```angular-ts
import { cva, type VariantProps } from 'class-variance-authority';

// Layout Variants
export const layoutVariants = cva('flex w-full min-h-0', {
  variants: {
    zDirection: {
      horizontal: 'flex-row',
      vertical: 'flex-col',
      auto: 'flex-col',
    },
  },
  defaultVariants: {
    zDirection: 'auto',
  },
});
export type LayoutVariants = NonNullable<VariantProps<typeof layoutVariants>['zDirection']>;

// Header Variants
export const headerVariants = cva('flex items-center px-4 bg-background border-b border-border shrink-0', {
  variants: {},
});

// Footer Variants
export const footerVariants = cva('flex items-center px-6 bg-background border-t border-border shrink-0', {
  variants: {},
});

// Content Variants
export const contentVariants = cva('flex-1 flex flex-col overflow-auto bg-background p-6 min-h-dvh');

// Sidebar Variants
export const sidebarVariants = cva(
  'relative flex flex-col h-full transition-all duration-300 ease-in-out border-r shrink-0 p-6 bg-sidebar text-sidebar-foreground border-sidebar-border',
);

export const sidebarTriggerVariants = cva(
  'absolute bottom-4 z-10 flex items-center justify-center cursor-pointer rounded-sm border border-sidebar-border bg-sidebar hover:bg-sidebar-accent transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-sidebar-ring focus-visible:ring-offset-2 size-6 -right-3',
);

// Sidebar Group Variants
export const sidebarGroupVariants = cva('flex flex-col gap-1');

export const sidebarGroupLabelVariants = cva(
  'flex h-8 shrink-0 items-center rounded-md px-2 text-xs font-medium text-sidebar-foreground/70 outline-hidden transition-[margin,opacity] duration-200 ease-linear focus-visible:ring-2 focus-visible:ring-sidebar-ring [&>svg]:size-4 [&>svg]:shrink-0',
);
```

```angular-ts
import { ChangeDetectionStrategy, Component, computed, input, ViewEncapsulation } from '@angular/core';

import type { ClassValue } from 'clsx';

import { contentVariants } from '@/shared/components/layout/layout.variants';
import { mergeClasses } from '@/shared/utils/merge-classes';

@Component({
  selector: 'z-content',
  template: `
    <main>
      <ng-content />
    </main>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: {
    '[class]': 'classes()',
  },
  exportAs: 'zContent',
})
export class ContentComponent {
  readonly class = input<ClassValue>('');

  protected readonly classes = computed(() => mergeClasses(contentVariants(), this.class()));
}
```

```angular-ts
import { ChangeDetectionStrategy, Component, computed, input, ViewEncapsulation } from '@angular/core';

import type { ClassValue } from 'clsx';

import { footerVariants } from '@/shared/components/layout/layout.variants';
import { mergeClasses } from '@/shared/utils/merge-classes';

@Component({
  selector: 'z-footer',
  template: `
    <footer [class]="classes()" [style.height.px]="zHeight()">
      <ng-content />
    </footer>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  exportAs: 'zFooter',
})
export class FooterComponent {
  readonly class = input<ClassValue>('');
  readonly zHeight = input<number>(64);

  protected readonly classes = computed(() => mergeClasses(footerVariants(), this.class()));
}
```

```angular-ts
import { ChangeDetectionStrategy, Component, computed, input, ViewEncapsulation } from '@angular/core';

import type { ClassValue } from 'clsx';

import { headerVariants } from '@/shared/components/layout/layout.variants';
import { mergeClasses } from '@/shared/utils/merge-classes';

@Component({
  selector: 'z-header',
  template: `
    <header [class]="classes()" [style.height.px]="zHeight()">
      <ng-content />
    </header>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  exportAs: 'zHeader',
})
export class HeaderComponent {
  readonly class = input<ClassValue>('');
  readonly zHeight = input<number>(64);

  protected readonly classes = computed(() => mergeClasses(headerVariants(), this.class()));
}
```

```angular-ts
export * from '@/shared/components/layout/layout.component';
export * from '@/shared/components/layout/header.component';
export * from '@/shared/components/layout/footer.component';
export * from '@/shared/components/layout/content.component';
export * from '@/shared/components/layout/sidebar.component';
export * from '@/shared/components/layout/layout.variants';
export * from '@/shared/components/layout/layout.imports';
```

```angular-ts
import { ContentComponent } from '@/shared/components/layout/content.component';
import { FooterComponent } from '@/shared/components/layout/footer.component';
import { HeaderComponent } from '@/shared/components/layout/header.component';
import { LayoutComponent } from '@/shared/components/layout/layout.component';
import {
  SidebarComponent,
  SidebarGroupComponent,
  SidebarGroupLabelComponent,
} from '@/shared/components/layout/sidebar.component';

export const LayoutImports = [
  LayoutComponent,
  HeaderComponent,
  FooterComponent,
  ContentComponent,
  SidebarComponent,
  SidebarGroupComponent,
  SidebarGroupLabelComponent,
] as const;
```

```angular-ts
import {
  booleanAttribute,
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  input,
  output,
  signal,
  ViewEncapsulation,
  type TemplateRef,
} from '@angular/core';

import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideChevronLeft, lucideChevronRight } from '@ng-icons/lucide';
import type { ClassValue } from 'clsx';

import {
  sidebarGroupLabelVariants,
  sidebarGroupVariants,
  sidebarTriggerVariants,
  sidebarVariants,
} from '@/shared/components/layout/layout.variants';
import { ZardStringTemplateOutletDirective } from '@/shared/core/directives/string-template-outlet/string-template-outlet.directive';
import { mergeClasses } from '@/shared/utils/merge-classes';

@Component({
  selector: 'z-sidebar',
  imports: [ZardStringTemplateOutletDirective, NgIcon],
  template: `
    <aside [class]="classes()" [style.width.px]="currentWidth()" [attr.data-collapsed]="zCollapsed()">
      <div class="flex-1 overflow-auto">
        <ng-content />
      </div>

      @if (zCollapsible() && !zTrigger()) {
        <div
          [class]="triggerClasses()"
          (click)="toggleCollapsed()"
          (keydown.{enter,space}.prevent)="toggleCollapsed()"
          tabindex="0"
          role="button"
          [attr.aria-label]="zCollapsed() ? 'Expand sidebar' : 'Collapse sidebar'"
          [attr.aria-expanded]="!zCollapsed()"
        >
          <ng-icon [name]="chevronIcon()" class="pointer-events-none size-4! shrink-0" />
        </div>
      }

      @if (zCollapsible() && zTrigger()) {
        <ng-container *zStringTemplateOutlet="zTrigger()" />
      }
    </aside>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  viewProviders: [provideIcons({ lucideChevronRight, lucideChevronLeft })],
  exportAs: 'zSidebar',
})
export class SidebarComponent {
  readonly zWidth = input<string | number>(200);
  readonly zCollapsedWidth = input<number>(64);
  readonly zCollapsible = input(false, { transform: booleanAttribute });
  readonly zCollapsed = input(false, { transform: booleanAttribute });
  readonly zReverseArrow = input(false, { transform: booleanAttribute });
  readonly zTrigger = input<TemplateRef<void> | null>(null);
  readonly class = input<ClassValue>('');

  readonly zCollapsedChange = output<boolean>();

  private readonly internalCollapsed = signal(false);

  constructor() {
    effect(() => {
      this.internalCollapsed.set(this.zCollapsed());
    });
  }

  protected readonly currentWidth = computed(() => {
    const collapsed = this.zCollapsed();
    if (collapsed) {
      return this.zCollapsedWidth();
    }

    const width = this.zWidth();
    return typeof width === 'number' ? width : parseInt(width, 10);
  });

  protected readonly chevronIcon = computed((): string => {
    const collapsed = this.zCollapsed();
    const reverse = this.zReverseArrow();
    const icons = ['lucideChevronLeft', 'lucideChevronRight'];

    if (reverse) {
      return collapsed ? icons[0] : icons[1];
    }
    return collapsed ? icons[1] : icons[0];
  });

  protected readonly classes = computed(() => mergeClasses(sidebarVariants(), this.class()));

  protected readonly triggerClasses = computed(() => mergeClasses(sidebarTriggerVariants()));

  toggleCollapsed(): void {
    const newState = !this.zCollapsed();
    this.internalCollapsed.set(newState);
    this.zCollapsedChange.emit(newState);
  }
}

@Component({
  selector: 'z-sidebar-group',
  template: `
    <div [class]="classes()">
      <ng-content />
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  exportAs: 'zSidebarGroup',
})
export class SidebarGroupComponent {
  readonly class = input<ClassValue>('');

  protected readonly classes = computed(() => mergeClasses(sidebarGroupVariants(), this.class()));
}

@Component({
  selector: 'z-sidebar-group-label',
  template: `
    <div [class]="classes()">
      <ng-content />
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  exportAs: 'zSidebarGroupLabel',
})
export class SidebarGroupLabelComponent {
  readonly class = input<ClassValue>('');

  protected readonly classes = computed(() => mergeClasses(sidebarGroupLabelVariants(), this.class()));
}
```

## Usage

```angular-ts
import { LayoutImports } from '@/shared/components/layout/layout.imports';
```

```angular-html
<z-layout>
  <z-header>Header</z-header>
  <z-content>Content</z-content>
  <z-footer>Footer</z-footer>
</z-layout>
```

## Examples

### Basic

```angular-ts
import { ChangeDetectionStrategy, Component } from '@angular/core';

import { LayoutImports } from '@/shared/components/layout/layout.imports';

@Component({
  selector: 'z-demo-layout-basic',
  imports: [LayoutImports],
  template: `
    <div class="flex flex-col gap-6 text-center">
      <z-layout class="overflow-hidden rounded-lg">
        <z-header class="h-16 justify-center border-0 bg-[#4096ff] px-12 text-white">Header</z-header>
        <z-content class="min-h-50 bg-[#0958d9] text-white">Content</z-content>
        <z-footer class="h-16 justify-center border-0 bg-[#4096ff] px-12 text-white">Footer</z-footer>
      </z-layout>

      <z-layout class="overflow-hidden rounded-lg">
        <z-header class="h-16 justify-center border-0 bg-[#4096ff] px-12 text-white">Header</z-header>
        <z-layout>
          <z-sidebar class="border-0 bg-[#1677ff] text-white" [zWidth]="120">Sidebar</z-sidebar>
          <z-content class="min-h-50 bg-[#0958d9] text-white">Content</z-content>
        </z-layout>
        <z-footer class="h-16 justify-center border-0 bg-[#4096ff] px-12 text-white">Footer</z-footer>
      </z-layout>

      <z-layout class="overflow-hidden rounded-lg">
        <z-header class="h-16 justify-center border-0 bg-[#4096ff] px-12 text-white">Header</z-header>
        <z-layout>
          <z-content class="min-h-50 bg-[#0958d9] text-white">Content</z-content>
          <z-sidebar class="border-0 bg-[#1677ff] text-white" [zWidth]="120">Sidebar</z-sidebar>
        </z-layout>
        <z-footer class="h-16 justify-center border-0 bg-[#4096ff] px-12 text-white">Footer</z-footer>
      </z-layout>

      <z-layout class="overflow-hidden rounded-lg">
        <z-sidebar class="border-0 bg-[#1677ff] text-white" [zWidth]="120">Sidebar</z-sidebar>
        <z-layout>
          <z-header class="h-16 justify-center border-0 bg-[#4096ff] px-12 text-white">Header</z-header>
          <z-content class="min-h-50 bg-[#0958d9] text-white">Content</z-content>
          <z-footer class="h-16 justify-center border-0 bg-[#4096ff] px-12 text-white">Footer</z-footer>
        </z-layout>
      </z-layout>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LayoutDemoBasicComponent {}
```

### Sidebar

```angular-ts
import { Component, signal } from '@angular/core';

import { NgIcon, provideIcons, type IconName } from '@ng-icons/core';
import {
  lucideCalendar,
  lucideChevronRight,
  lucideChevronsUpDown,
  lucideFolder,
  lucideHouse,
  lucideInbox,
  lucideLogOut,
  lucidePanelLeft,
  lucideSearch,
  lucideSettings,
  lucideUser,
} from '@ng-icons/lucide';

import { ZardAvatarComponent } from '@/shared/components/avatar';
import { ZardBreadcrumbImports } from '@/shared/components/breadcrumb/breadcrumb.imports';
import { ZardButtonComponent } from '@/shared/components/button';
import { LayoutImports } from '@/shared/components/layout/layout.imports';
import { ZardNavigationMenuImports } from '@/shared/components/navigation-menu/navigation-menu.imports';
import { ZardSeparatorComponent } from '@/shared/components/separator';
import { ZardSkeletonComponent } from '@/shared/components/skeleton';
import { ZardTooltipImports } from '@/shared/components/tooltip';

interface MenuItem {
  icon: IconName;
  label: string;
  submenu?: { label: string }[];
}

@Component({
  selector: 'z-demo-layout-collapsible',
  imports: [
    LayoutImports,
    ZardButtonComponent,
    ZardBreadcrumbImports,
    ZardNavigationMenuImports,
    ZardSkeletonComponent,
    ZardTooltipImports,
    ZardSeparatorComponent,
    ZardAvatarComponent,
    NgIcon,
  ],
  template: `
    <!-- border and rounded-md are just for the demo purpose -->
    <z-layout class="overflow-hidden rounded-md border">
      <z-sidebar
        [zWidth]="250"
        [zCollapsible]="true"
        [zCollapsed]="sidebarCollapsed()"
        [zCollapsedWidth]="70"
        (zCollapsedChange)="onCollapsedChange($event)"
        class="p-0!"
      >
        <nav [class]="'flex h-full flex-col overflow-hidden ' + (sidebarCollapsed() ? 'gap-1 p-1 pt-4' : 'gap-4 p-4')">
          <z-sidebar-group>
            @if (!sidebarCollapsed()) {
              <z-sidebar-group-label>Main</z-sidebar-group-label>
            }
            @for (item of mainMenuItems; track item.label) {
              <button
                type="button"
                z-button
                zType="ghost"
                [class]="sidebarCollapsed() ? 'justify-center' : 'justify-start'"
                [zTooltip]="sidebarCollapsed() ? item.label : ''"
                zPosition="right"
              >
                <ng-icon [name]="item.icon" [class]="sidebarCollapsed() ? '' : 'mr-2'" />
                @if (!sidebarCollapsed()) {
                  <span>{{ item.label }}</span>
                }
              </button>
            }
          </z-sidebar-group>

          <z-sidebar-group>
            @if (!sidebarCollapsed()) {
              <z-sidebar-group-label>Workspace</z-sidebar-group-label>
            }
            @for (item of workspaceMenuItems; track item.label) {
              @if (item.submenu) {
                <button
                  type="button"
                  z-button
                  zType="ghost"
                  z-navigation-menu-trigger
                  [zNavigationMenuTriggerFor]="submenu"
                  zPlacement="rightTop"
                  [class]="sidebarCollapsed() ? 'justify-center' : 'justify-start'"
                  [zTooltip]="sidebarCollapsed() ? item.label : null"
                  zPosition="right"
                >
                  <ng-icon [name]="item.icon" [class]="sidebarCollapsed() ? '' : 'mr-2'" />
                  @if (!sidebarCollapsed()) {
                    <span class="flex-1 text-left">{{ item.label }}</span>
                    <ng-icon name="lucideChevronRight" />
                  }
                </button>

                <ng-template #submenu>
                  <div z-navigation-menu-content class="w-48">
                    @for (subitem of item.submenu; track subitem.label) {
                      <button type="button" z-navigation-menu-link>{{ subitem.label }}</button>
                    }
                  </div>
                </ng-template>
              } @else {
                <button
                  type="button"
                  z-button
                  zType="ghost"
                  [class]="sidebarCollapsed() ? 'justify-center' : 'justify-start'"
                  [zTooltip]="sidebarCollapsed() ? item.label : ''"
                  zPosition="right"
                >
                  <ng-icon [name]="item.icon" [class]="sidebarCollapsed() ? '' : 'mr-2'" />
                  @if (!sidebarCollapsed()) {
                    <span>{{ item.label }}</span>
                  }
                </button>
              }
            }
          </z-sidebar-group>

          <div class="mt-auto">
            <div
              z-navigation-menu-trigger
              [zNavigationMenuTriggerFor]="userMenu"
              zPlacement="rightBottom"
              [class]="
                'hover:bg-accent flex cursor-pointer items-center justify-center gap-2 rounded-md ' +
                (sidebarCollapsed() ? 'm-2 p-0' : 'p-2')
              "
            >
              <z-avatar zSrc="https://zardui.com/images/avatar/imgs/avatar_image.jpg" zAlt="Zard UI" />

              @if (!sidebarCollapsed()) {
                <div>
                  <span class="font-medium">zardui</span>
                  <div class="text-xs">test&#64;zardui.com</div>
                </div>

                <ng-icon name="lucideChevronsUpDown" class="ml-auto" />
              }
            </div>

            <ng-template #userMenu>
              <div z-navigation-menu-content class="w-48">
                <button type="button" z-navigation-menu-link>
                  <ng-icon name="lucideUser" class="mr-2" />
                  Profile
                </button>
                <button type="button" z-navigation-menu-link>
                  <ng-icon name="lucideSettings" class="mr-2" />
                  Settings
                </button>
                <z-separator class="my-2" />
                <button type="button" z-navigation-menu-link>
                  <ng-icon name="lucideLogOut" class="mr-2" />
                  Logout
                </button>
              </div>
            </ng-template>
          </div>
        </nav>
      </z-sidebar>

      <!-- min-h-[200px] is just for the demo purpose to have a minimum height -->
      <z-content class="min-h-50">
        <div class="flex items-center">
          <button type="button" z-button zType="ghost" zSize="sm" class="-ml-2" (click)="toggleSidebar()">
            <ng-icon name="lucidePanelLeft" />
          </button>

          <z-separator zOrientation="vertical" class="ml-2 h-4 self-center!" />

          <z-breadcrumb zWrap="wrap" zAlign="start">
            <z-breadcrumb-item [routerLink]="['/docs/components/layout']">Home</z-breadcrumb-item>
            <z-breadcrumb-item>
              <span aria-current="page">Components</span>
            </z-breadcrumb-item>
          </z-breadcrumb>
        </div>

        <div class="space-y-4 py-4">
          <z-skeleton class="h-80 w-full" />
          <z-skeleton class="h-16 w-full" />
        </div>
      </z-content>
    </z-layout>
  `,
  viewProviders: [
    provideIcons({
      lucideHouse,
      lucideInbox,
      lucideFolder,
      lucideChevronRight,
      lucideChevronsUpDown,
      lucideUser,
      lucideSettings,
      lucideLogOut,
      lucidePanelLeft,
      lucideCalendar,
      lucideSearch,
    }),
  ],
})
export class LayoutDemoSidebarComponent {
  readonly sidebarCollapsed = signal(false);

  mainMenuItems: MenuItem[] = [
    { icon: 'lucideHouse', label: 'Home' },
    { icon: 'lucideInbox', label: 'Inbox' },
  ];

  workspaceMenuItems: MenuItem[] = [
    {
      icon: 'lucideFolder',
      label: 'Projects',
      submenu: [{ label: 'Design System' }, { label: 'Mobile App' }, { label: 'Website' }],
    },
    { icon: 'lucideCalendar', label: 'Calendar' },
    { icon: 'lucideSearch', label: 'Search' },
  ];

  toggleSidebar() {
    this.sidebarCollapsed.update(collapsed => !collapsed);
  }

  onCollapsedChange(collapsed: boolean) {
    this.sidebarCollapsed.set(collapsed);
  }
}
```

### Full Layout

```angular-ts
import { NgOptimizedImage } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';

import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideBell, lucideHouse, lucideLayers, lucideSearch, lucideUsers } from '@ng-icons/lucide';

import { ZardButtonComponent } from '@/shared/components/button';
import { LayoutImports } from '@/shared/components/layout/layout.imports';
import { ZardSkeletonComponent } from '@/shared/components/skeleton';

@Component({
  selector: 'z-demo-layout-full',
  imports: [LayoutImports, ZardButtonComponent, ZardSkeletonComponent, NgOptimizedImage, NgIcon],
  template: `
    <z-layout class="min-h-150 overflow-hidden rounded-md border">
      <z-header>
        <div class="flex w-full items-center justify-between">
          <div class="flex items-center text-lg font-semibold">
            <img ngSrc="images/zard.svg" class="dark:invert" alt="Logo" width="24" height="24" />
            <span class="ml-2">ZardUI</span>
          </div>
          <div class="flex items-center gap-2">
            <button type="button" z-button zType="ghost" zSize="sm">
              <ng-icon name="lucideSearch" />
            </button>
            <button type="button" z-button zType="ghost" zSize="sm">
              <ng-icon name="lucideBell" />
            </button>
          </div>
        </div>
      </z-header>

      <z-layout>
        <z-sidebar [zWidth]="200" class="p-0!">
          <nav class="flex h-full flex-col gap-2 p-4">
            <z-sidebar-group>
              <z-sidebar-group-label>Menu</z-sidebar-group-label>
              <button type="button" z-button zType="secondary" class="justify-start">
                <ng-icon name="lucideHouse" class="mr-2" />
                Dashboard
              </button>
              <button type="button" z-button zType="ghost" class="justify-start">
                <ng-icon name="lucideLayers" class="mr-2" />
                Projects
              </button>
              <button type="button" z-button zType="ghost" class="justify-start">
                <ng-icon name="lucideUsers" class="mr-2" />
                Team
              </button>
            </z-sidebar-group>
          </nav>
        </z-sidebar>

        <z-layout>
          <z-content class="min-h-50">
            <div class="space-y-4">
              <z-skeleton class="h-32 w-full" />
              <z-skeleton class="h-48 w-full" />
              <z-skeleton class="h-24 w-full" />
            </div>
          </z-content>

          <z-footer>
            <div class="text-muted-foreground flex w-full items-center justify-center text-sm">© {{ year }} ZardUI</div>
          </z-footer>
        </z-layout>
      </z-layout>
    </z-layout>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  viewProviders: [
    provideIcons({
      lucideSearch,
      lucideBell,
      lucideHouse,
      lucideLayers,
      lucideUsers,
    }),
  ],
})
export class LayoutDemoFullComponent {
  year = new Date().getFullYear();
}
```

## API Reference

### z-layout

Root layout container with flex direction support.

| Prop | Description | Type | Default |
| --- | --- | --- | --- |
| `[class]` | Additional CSS classes | `ClassValue` | `''` |
| `[zDirection]` | Flex direction (auto-detects based on children) | `'horizontal' \| 'vertical' \| 'auto'` | `'auto'` |

### z-header

Header area of the layout.

| Prop | Description | Type | Default |
| --- | --- | --- | --- |
| `[class]` | Additional CSS classes | `ClassValue` | `''` |
| `[zHeight]` | Header height in pixels | `number` | `64` |

### z-footer

Footer area of the layout.

| Prop | Description | Type | Default |
| --- | --- | --- | --- |
| `[class]` | Additional CSS classes | `ClassValue` | `''` |
| `[zHeight]` | Footer height in pixels | `number` | `64` |

### z-content

Main content area of the layout.

| Prop | Description | Type | Default |
| --- | --- | --- | --- |
| `[class]` | Additional CSS classes | `ClassValue` | `''` |

### z-sidebar

Sidebar area with optional collapse functionality.

| Prop | Description | Type | Default |
| --- | --- | --- | --- |
| `[class]` | Additional CSS classes | `ClassValue` | `''` |
| `[zWidth]` | Sidebar width when expanded (px or string) | `string \| number` | `200` |
| `[zCollapsedWidth]` | Sidebar width when collapsed (px) | `number` | `64` |
| `[zCollapsible]` | Enable collapse functionality | `boolean` | `false` |
| `[zCollapsed]` | Collapsed state (supports two-way binding) | `boolean` | `false` |
| `[zReverseArrow]` | Reverse trigger arrow direction | `boolean` | `false` |
| `[zTrigger]` | Custom trigger template | `TemplateRef<void> \| null` | `null` |
| `(zCollapsedChange)` | Emitted when collapsed state changes | `EventEmitter<boolean>` |  |

### z-sidebar-group

Groups items within the sidebar.

| Prop | Description | Type | Default |
| --- | --- | --- | --- |
| `[class]` | Additional CSS classes | `ClassValue` | `''` |

### z-sidebar-group-label

Label for a sidebar group.

| Prop | Description | Type | Default |
| --- | --- | --- | --- |
| `[class]` | Additional CSS classes | `ClassValue` | `''` |

---

[Open in browser](https://zardui.com/docs/components/layout)
