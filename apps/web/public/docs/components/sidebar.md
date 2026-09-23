---
title: Sidebar
description: A composable, themeable and customizable sidebar component.
---

# Sidebar

A composable, themeable and customizable sidebar component.

## About

Sidebars are one of the most complex components to build. They are central to any application and often contain a lot of moving parts. This is a solid foundation to build on top of — composable, themeable, customizable.

[Browse the Blocks Library](/blocks/sidebar)

## Installation

### CLI

```bash
npx zard-cli@latest add sidebar
```

### Manual

```angular-ts
import { A11yModule } from '@angular/cdk/a11y';
import { NgTemplateOutlet } from '@angular/common';
import {
  booleanAttribute,
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
  input,
  type OnInit,
  output,
  ViewEncapsulation,
} from '@angular/core';

import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucidePanelLeft } from '@ng-icons/lucide';
import type { ClassValue } from 'clsx';

import { buttonVariants } from '@/shared/components/button/button.variants';
import {
  ZARD_SIDEBAR_WIDTH,
  ZARD_SIDEBAR_WIDTH_ICON,
  ZARD_SIDEBAR_WIDTH_MOBILE,
} from '@/shared/components/sidebar/sidebar.constants';
import { ZardSidebarService } from '@/shared/components/sidebar/sidebar.service';
import {
  sidebarContainerVariants,
  sidebarGapVariants,
  sidebarInnerVariants,
  sidebarInsetVariants,
  sidebarMobileBackdropVariants,
  sidebarMobileVariants,
  sidebarNoneVariants,
  sidebarRailVariants,
  sidebarRootVariants,
  sidebarTriggerVariants,
  sidebarWrapperVariants,
  type ZardSidebarCollapsibleVariants,
  type ZardSidebarSideVariants,
  type ZardSidebarVariantVariants,
} from '@/shared/components/sidebar/sidebar.variants';
import { mergeClasses } from '@/shared/utils/merge-classes';

@Component({
  selector: 'z-sidebar-provider',
  template: `
    <ng-content />
  `,
  providers: [ZardSidebarService],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: {
    'data-slot': 'sidebar-wrapper',
    '[class]': 'classes()',
    '[style]': 'hostStyle()',
    '(document:keydown.control.b)': 'onKeyboardShortcut($event)',
    '(document:keydown.meta.b)': 'onKeyboardShortcut($event)',
  },
  exportAs: 'zSidebarProvider',
})
export class ZardSidebarProviderComponent implements OnInit {
  readonly sidebarService = inject(ZardSidebarService);

  /**
   * Initial open state. Left unset, the persisted cookie decides, falling back to open.
   * Set explicitly, it wins over the cookie — the demos rely on that to stay deterministic.
   */
  readonly zDefaultOpen = input<boolean | undefined, unknown>(undefined, {
    transform: value => (value === undefined ? undefined : booleanAttribute(value)),
  });

  /** When set, the provider is controlled: `setOpen` only reports through `zOpenChange`. */
  readonly zOpen = input<boolean | undefined>(undefined);
  readonly class = input<ClassValue>('');
  /** Extra inline style. Declared after the width variables, so it can override them. */
  readonly style = input<string>('');

  readonly zOpenChange = output<boolean>();

  protected readonly classes = computed(() => mergeClasses(sidebarWrapperVariants(), this.class()));

  // The docs site declares a global `--sidebar-width` for its own navigation, so the variables have
  // to be set inline on this host to win inside the provider's scope.
  protected readonly hostStyle = computed(() =>
    [`--sidebar-width: ${ZARD_SIDEBAR_WIDTH}`, `--sidebar-width-icon: ${ZARD_SIDEBAR_WIDTH_ICON}`, this.style()]
      .filter(Boolean)
      .join('; '),
  );

  constructor() {
    this.sidebarService.onOpenChange = open => this.zOpenChange.emit(open);

    effect(() => {
      this.sidebarService.controlledOpen.set(this.zOpen());
    });
  }

  // Inputs are only bound after construction, so the default has to be read here.
  ngOnInit(): void {
    this.sidebarService.applyDefaultOpen(this.zDefaultOpen());
  }

  protected onKeyboardShortcut(event: Event): void {
    event.preventDefault();
    this.sidebarService.toggleSidebar();
  }
}

@Component({
  selector: 'z-sidebar',
  imports: [A11yModule, NgTemplateOutlet],
  template: `
    <ng-template #projected>
      <ng-content />
    </ng-template>

    @if (zCollapsible() === 'none') {
      <ng-container [ngTemplateOutlet]="projected" />
    } @else if (sidebarService.isMobile()) {
      <!-- Both parts stay mounted so the drawer animates out as well as in. The inert attribute
           takes the closed drawer out of the tab order and the accessibility tree, which removing it
           from the DOM used to do. A button rather than a div: the backdrop is a dismiss control. -->
      <button
        type="button"
        data-slot="sidebar-backdrop"
        tabindex="-1"
        aria-label="Close Sidebar"
        [class]="backdropClasses()"
        [attr.data-state]="mobileState()"
        [attr.inert]="sidebarService.openMobile() ? null : ''"
        (click)="sidebarService.setOpenMobile(false)"
      ></button>

      <div
        data-sidebar="sidebar"
        data-mobile="true"
        role="dialog"
        aria-modal="true"
        aria-label="Sidebar"
        cdkTrapFocusAutoCapture
        [cdkTrapFocus]="sidebarService.openMobile()"
        [attr.data-state]="mobileState()"
        [attr.data-side]="zSide()"
        [attr.inert]="sidebarService.openMobile() ? null : ''"
        [class]="mobileClasses()"
        [style]="mobileStyle"
      >
        <div class="flex size-full flex-col">
          <ng-container [ngTemplateOutlet]="projected" />
        </div>
      </div>
    } @else {
      <div data-slot="sidebar-gap" [class]="gapClasses()"></div>

      <div data-slot="sidebar-container" [class]="containerClasses()">
        <div data-sidebar="sidebar" data-slot="sidebar-inner" [class]="innerClasses()">
          <ng-container [ngTemplateOutlet]="projected" />
        </div>
      </div>
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: {
    'data-slot': 'sidebar',
    '[class]': 'hostClasses()',
    '[attr.dir]': 'dir() ?? null',
    '[attr.data-state]': 'isDesktop() ? sidebarService.state() : null',
    '[attr.data-collapsible]': 'isDesktop() ? desktopCollapsible() : null',
    '[attr.data-variant]': 'isDesktop() ? zVariant() : null',
    '[attr.data-side]': 'isDesktop() ? zSide() : null',
    '(document:keydown.escape)': 'onEscape()',
  },
  exportAs: 'zSidebar',
})
export class ZardSidebarComponent {
  readonly sidebarService = inject(ZardSidebarService);

  readonly zSide = input<ZardSidebarSideVariants>('left');
  readonly zVariant = input<ZardSidebarVariantVariants>('sidebar');
  readonly zCollapsible = input<ZardSidebarCollapsibleVariants>('offcanvas');
  readonly class = input<ClassValue>('');
  readonly dir = input<'ltr' | 'rtl' | undefined>(undefined);

  protected readonly mobileStyle = `--sidebar-width: ${ZARD_SIDEBAR_WIDTH_MOBILE}`;

  protected readonly isDesktop = computed(() => this.zCollapsible() !== 'none' && !this.sidebarService.isMobile());

  /** shadcn keeps this attribute empty while expanded, and every `group-data-[collapsible=…]` class relies on it. */
  protected readonly desktopCollapsible = computed(() =>
    this.sidebarService.state() === 'collapsed' ? this.zCollapsible() : '',
  );

  protected readonly hostClasses = computed(() => {
    if (this.zCollapsible() === 'none') {
      return mergeClasses(sidebarNoneVariants(), this.class());
    }

    // The mobile drawer is positioned fixed, so the host must not introduce a box of its own.
    return this.sidebarService.isMobile() ? 'contents' : sidebarRootVariants();
  });

  protected readonly mobileState = computed(() => (this.sidebarService.openMobile() ? 'open' : 'closed'));

  protected readonly backdropClasses = computed(() => sidebarMobileBackdropVariants());

  protected readonly mobileClasses = computed(() =>
    mergeClasses(sidebarMobileVariants({ zSide: this.zSide() }), this.class()),
  );

  protected readonly gapClasses = computed(() => sidebarGapVariants({ zVariant: this.zVariant() }));

  protected readonly containerClasses = computed(() =>
    mergeClasses(sidebarContainerVariants({ zSide: this.zSide(), zVariant: this.zVariant() }), this.class()),
  );

  protected readonly innerClasses = computed(() => sidebarInnerVariants());

  protected onEscape(): void {
    if (this.sidebarService.openMobile()) {
      this.sidebarService.setOpenMobile(false);
    }
  }
}

@Component({
  selector: 'button[z-sidebar-trigger]',
  imports: [NgIcon],
  template: `
    <ng-icon name="lucidePanelLeft" class="rtl:rotate-180" />
    <span class="sr-only">Toggle Sidebar</span>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  viewProviders: [provideIcons({ lucidePanelLeft })],
  host: {
    'data-slot': 'sidebar-trigger',
    'data-sidebar': 'trigger',
    type: 'button',
    '[class]': 'classes()',
    '(click)': 'sidebarService.toggleSidebar()',
  },
  exportAs: 'zSidebarTrigger',
})
export class ZardSidebarTriggerComponent {
  readonly sidebarService = inject(ZardSidebarService);

  readonly class = input<ClassValue>('');

  protected readonly classes = computed(() =>
    mergeClasses(buttonVariants({ zType: 'ghost', zSize: 'icon-sm' }), sidebarTriggerVariants(), this.class()),
  );
}

@Component({
  selector: 'button[z-sidebar-rail]',
  template: '',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: {
    'data-slot': 'sidebar-rail',
    'data-sidebar': 'rail',
    type: 'button',
    tabindex: '-1',
    'aria-label': 'Toggle Sidebar',
    title: 'Toggle Sidebar',
    '[class]': 'classes()',
    '(click)': 'sidebarService.toggleSidebar()',
  },
  exportAs: 'zSidebarRail',
})
export class ZardSidebarRailComponent {
  readonly sidebarService = inject(ZardSidebarService);

  readonly class = input<ClassValue>('');

  protected readonly classes = computed(() => mergeClasses(sidebarRailVariants(), this.class()));
}

@Component({
  selector: 'z-sidebar-inset, main[z-sidebar-inset]',
  template: `
    <ng-content />
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: {
    'data-slot': 'sidebar-inset',
    '[class]': 'classes()',
  },
  exportAs: 'zSidebarInset',
})
export class ZardSidebarInsetComponent {
  readonly class = input<ClassValue>('');

  protected readonly classes = computed(() => mergeClasses(sidebarInsetVariants(), this.class()));
}
```

```angular-ts
import { cva, type VariantProps } from 'class-variance-authority';

export const sidebarWrapperVariants = cva(
  'group/sidebar-wrapper flex min-h-svh w-full has-data-[variant=inset]:bg-sidebar',
);

/** `collapsible="none"` — a plain, always-visible column. */
export const sidebarNoneVariants = cva('flex h-full w-(--sidebar-width) flex-col bg-sidebar text-sidebar-foreground');

/** The desktop wrapper. Carries `group` and `peer`, so it has to sit on the host element. */
export const sidebarRootVariants = cva('group peer hidden text-sidebar-foreground md:block');

export const sidebarGapVariants = cva(
  'relative w-(--sidebar-width) bg-transparent transition-[width] duration-200 ease-linear group-data-[collapsible=offcanvas]:w-0 group-data-[side=right]:rotate-180',
  {
    variants: {
      zVariant: {
        sidebar: 'group-data-[collapsible=icon]:w-(--sidebar-width-icon)',
        floating: 'group-data-[collapsible=icon]:w-[calc(var(--sidebar-width-icon)+(--spacing(4)))]',
        inset: 'group-data-[collapsible=icon]:w-[calc(var(--sidebar-width-icon)+(--spacing(4)))]',
      },
    },
    defaultVariants: {
      zVariant: 'sidebar',
    },
  },
);

export const sidebarContainerVariants = cva(
  'fixed inset-y-0 z-10 hidden h-svh w-(--sidebar-width) transition-[left,right,width] duration-200 ease-linear md:flex',
  {
    variants: {
      zSide: {
        left: 'left-0 group-data-[collapsible=offcanvas]:-left-(--sidebar-width)',
        right: 'right-0 group-data-[collapsible=offcanvas]:-right-(--sidebar-width)',
      },
      zVariant: {
        sidebar:
          'group-data-[collapsible=icon]:w-(--sidebar-width-icon) group-data-[side=left]:border-r group-data-[side=right]:border-l',
        floating: 'p-2 group-data-[collapsible=icon]:w-[calc(var(--sidebar-width-icon)+(--spacing(4))+2px)]',
        inset: 'p-2 group-data-[collapsible=icon]:w-[calc(var(--sidebar-width-icon)+(--spacing(4))+2px)]',
      },
    },
    defaultVariants: {
      zSide: 'left',
      zVariant: 'sidebar',
    },
  },
);

export const sidebarInnerVariants = cva(
  'flex size-full flex-col bg-sidebar group-data-[variant=floating]:rounded-lg group-data-[variant=floating]:border group-data-[variant=floating]:border-sidebar-border group-data-[variant=floating]:shadow-sm',
);

/**
 * Mobile drawer — replaces shadcn's `Sheet`, which is imperative in Zard. Both parts stay mounted
 * and animate off `data-state`, so the drawer slides out as well as in; `inert` keeps the closed
 * drawer out of the tab order and the accessibility tree.
 */
export const sidebarMobileBackdropVariants = cva(
  'fixed inset-0 z-50 bg-black/50 transition-opacity duration-150 ease-in-out data-closed:pointer-events-none data-closed:opacity-0 data-open:opacity-100',
);

export const sidebarMobileVariants = cva(
  'fixed inset-y-0 z-50 flex h-full w-(--sidebar-width) flex-col bg-sidebar p-0 text-sidebar-foreground shadow-lg transition-transform ease-in-out data-closed:duration-300 data-open:duration-500',
  {
    variants: {
      zSide: {
        left: 'left-0 data-closed:-translate-x-full',
        right: 'right-0 data-closed:translate-x-full',
      },
    },
    defaultVariants: {
      zSide: 'left',
    },
  },
);

/**
 * `buttonVariants` already carries `[&_svg:not([class*='size-'])]:size-4`, but @ng-icons styles the
 * svg it renders with higher specificity, so the icon fell back to the 14px font size — 2px short of
 * shadcn. Targeting `ng-icon` with `!` is the same escape hatch the menu button needs.
 */
export const sidebarTriggerVariants = cva("size-7 [&_ng-icon:not([class*='size-'])]:size-4!");

export const sidebarRailVariants = cva([
  'absolute inset-y-0 z-20 hidden w-4 -translate-x-1/2 transition-all ease-linear group-data-[side=left]:-right-4 group-data-[side=right]:left-0 after:absolute after:inset-y-0 after:left-1/2 after:w-[2px] hover:after:bg-sidebar-border sm:flex',
  'in-data-[side=left]:cursor-w-resize in-data-[side=right]:cursor-e-resize',
  '[[data-side=left][data-state=collapsed]_&]:cursor-e-resize [[data-side=right][data-state=collapsed]_&]:cursor-w-resize',
  'group-data-[collapsible=offcanvas]:translate-x-0 group-data-[collapsible=offcanvas]:after:left-full hover:group-data-[collapsible=offcanvas]:bg-sidebar',
  '[[data-side=left][data-collapsible=offcanvas]_&]:-right-2',
  '[[data-side=right][data-collapsible=offcanvas]_&]:-left-2',
]);

export const sidebarInsetVariants = cva([
  'relative flex w-full flex-1 flex-col bg-background',
  'md:peer-data-[variant=inset]:m-2 md:peer-data-[variant=inset]:ml-0 md:peer-data-[variant=inset]:rounded-xl md:peer-data-[variant=inset]:shadow-sm md:peer-data-[variant=inset]:peer-data-[state=collapsed]:ml-2',
]);

export const sidebarInputVariants = cva('h-8 w-full bg-background shadow-none');

export const sidebarHeaderVariants = cva('flex flex-col gap-2 p-2');

export const sidebarFooterVariants = cva('flex flex-col gap-2 p-2');

export const sidebarSeparatorVariants = cva('mx-2 w-auto bg-sidebar-border');

export const sidebarContentVariants = cva(
  'flex min-h-0 flex-1 flex-col gap-2 overflow-auto group-data-[collapsible=icon]:overflow-hidden',
);

export const sidebarGroupVariants = cva('relative flex w-full min-w-0 flex-col p-2');

export const sidebarGroupLabelVariants = cva([
  "flex h-8 shrink-0 items-center rounded-md px-2 text-xs font-medium text-sidebar-foreground/70 ring-sidebar-ring outline-hidden transition-[margin,opacity] duration-200 ease-linear focus-visible:ring-2 [&_svg]:size-4 [&_svg]:shrink-0 [&>ng-icon]:shrink-0 [&_ng-icon:not([class*='size-'])]:size-4!",
  'group-data-[collapsible=icon]:-mt-8 group-data-[collapsible=icon]:opacity-0',
]);

export const sidebarGroupActionVariants = cva([
  "absolute top-3.5 right-3 flex aspect-square w-5 items-center justify-center rounded-md p-0 text-sidebar-foreground ring-sidebar-ring outline-hidden transition-transform hover:bg-sidebar-accent hover:text-sidebar-accent-foreground focus-visible:ring-2 [&_svg]:size-4 [&_svg]:shrink-0 [&>ng-icon]:shrink-0 [&_ng-icon:not([class*='size-'])]:size-4!",
  // Increases the hit area of the button on mobile.
  'after:absolute after:-inset-2 md:after:hidden',
  'group-data-[collapsible=icon]:hidden',
]);

export const sidebarGroupContentVariants = cva('w-full text-sm');

export const sidebarMenuVariants = cva('flex w-full min-w-0 flex-col gap-1');

export const sidebarMenuItemVariants = cva('group/menu-item relative');

export const sidebarMenuButtonVariants = cva(
  "peer/menu-button flex w-full items-center gap-2 overflow-hidden rounded-md p-2 text-left text-sm ring-sidebar-ring outline-hidden transition-[width,height,padding] group-has-data-[sidebar=menu-action]/menu-item:pr-8 group-data-[collapsible=icon]:size-8! group-data-[collapsible=icon]:p-2! hover:bg-sidebar-accent hover:text-sidebar-accent-foreground focus-visible:ring-2 active:bg-sidebar-accent active:text-sidebar-accent-foreground disabled:pointer-events-none disabled:opacity-50 aria-disabled:pointer-events-none aria-disabled:opacity-50 data-[active=true]:bg-sidebar-accent data-[active=true]:font-medium data-[active=true]:text-sidebar-accent-foreground data-[state=open]:hover:bg-sidebar-accent data-[state=open]:hover:text-sidebar-accent-foreground [&>span:last-child]:truncate [&_svg]:size-4 [&_svg]:shrink-0 [&>ng-icon]:shrink-0 [&_ng-icon:not([class*='size-'])]:size-4!",
  {
    variants: {
      zType: {
        default: 'hover:bg-sidebar-accent hover:text-sidebar-accent-foreground',
        outline:
          'bg-background shadow-[0_0_0_1px_var(--sidebar-border)] hover:bg-sidebar-accent hover:text-sidebar-accent-foreground hover:shadow-[0_0_0_1px_var(--sidebar-accent)]',
      },
      zSize: {
        default: 'h-8 text-sm',
        sm: 'h-7 text-xs',
        lg: 'h-12 text-sm group-data-[collapsible=icon]:p-0!',
      },
    },
    defaultVariants: {
      zType: 'default',
      zSize: 'default',
    },
  },
);

export const sidebarMenuActionVariants = cva(
  [
    "absolute top-1.5 right-1 flex aspect-square w-5 items-center justify-center rounded-md p-0 text-sidebar-foreground ring-sidebar-ring outline-hidden transition-transform peer-hover/menu-button:text-sidebar-accent-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground focus-visible:ring-2 [&_svg]:size-4 [&_svg]:shrink-0 [&>ng-icon]:shrink-0 [&_ng-icon:not([class*='size-'])]:size-4!",
    // Increases the hit area of the button on mobile.
    'after:absolute after:-inset-2 md:after:hidden',
    'peer-data-[size=sm]/menu-button:top-1',
    'peer-data-[size=default]/menu-button:top-1.5',
    'peer-data-[size=lg]/menu-button:top-2.5',
    'group-data-[collapsible=icon]:hidden',
  ],
  {
    variants: {
      zShowOnHover: {
        true: 'group-focus-within/menu-item:opacity-100 group-hover/menu-item:opacity-100 peer-data-[active=true]/menu-button:text-sidebar-accent-foreground data-[state=open]:opacity-100 md:opacity-0',
        false: '',
      },
    },
    defaultVariants: {
      zShowOnHover: false,
    },
  },
);

export const sidebarMenuBadgeVariants = cva([
  'pointer-events-none absolute right-1 flex h-5 min-w-5 items-center justify-center rounded-md px-1 text-xs font-medium text-sidebar-foreground tabular-nums select-none',
  'peer-hover/menu-button:text-sidebar-accent-foreground peer-data-[active=true]/menu-button:text-sidebar-accent-foreground',
  'peer-data-[size=sm]/menu-button:top-1',
  'peer-data-[size=default]/menu-button:top-1.5',
  'peer-data-[size=lg]/menu-button:top-2.5',
  'group-data-[collapsible=icon]:hidden',
]);

export const sidebarMenuSkeletonVariants = cva('flex h-8 items-center gap-2 rounded-md px-2');

export const sidebarMenuSubVariants = cva([
  'mx-3.5 flex min-w-0 translate-x-px flex-col gap-1 border-l border-sidebar-border px-2.5 py-0.5',
  'group-data-[collapsible=icon]:hidden',
]);

export const sidebarMenuSubItemVariants = cva('group/menu-sub-item relative');

export const sidebarMenuSubButtonVariants = cva(
  [
    "flex h-7 min-w-0 -translate-x-px items-center gap-2 overflow-hidden rounded-md px-2 text-sidebar-foreground ring-sidebar-ring outline-hidden hover:bg-sidebar-accent hover:text-sidebar-accent-foreground focus-visible:ring-2 active:bg-sidebar-accent active:text-sidebar-accent-foreground disabled:pointer-events-none disabled:opacity-50 aria-disabled:pointer-events-none aria-disabled:opacity-50 [&>span:last-child]:truncate [&_svg]:size-4 [&_svg]:shrink-0 [&>ng-icon]:shrink-0 [&_ng-icon:not([class*='size-'])]:size-4! [&_svg]:text-sidebar-accent-foreground",
    'data-[active=true]:bg-sidebar-accent data-[active=true]:text-sidebar-accent-foreground',
    'group-data-[collapsible=icon]:hidden',
  ],
  {
    variants: {
      zSize: {
        sm: 'text-xs',
        md: 'text-sm',
      },
    },
    defaultVariants: {
      zSize: 'md',
    },
  },
);

export type ZardSidebarSideVariants = NonNullable<VariantProps<typeof sidebarContainerVariants>['zSide']>;
export type ZardSidebarVariantVariants = NonNullable<VariantProps<typeof sidebarContainerVariants>['zVariant']>;
export type ZardSidebarCollapsibleVariants = 'offcanvas' | 'icon' | 'none';
export type ZardSidebarMenuButtonTypeVariants = NonNullable<VariantProps<typeof sidebarMenuButtonVariants>['zType']>;
export type ZardSidebarMenuButtonSizeVariants = NonNullable<VariantProps<typeof sidebarMenuButtonVariants>['zSize']>;
export type ZardSidebarMenuSubButtonSizeVariants = NonNullable<
  VariantProps<typeof sidebarMenuSubButtonVariants>['zSize']
>;
```

```angular-ts
export * from '@/shared/components/sidebar/sidebar.component';
export * from '@/shared/components/sidebar/sidebar-primitives.component';
export * from '@/shared/components/sidebar/sidebar-menu.component';
export * from '@/shared/components/sidebar/sidebar.constants';
export * from '@/shared/components/sidebar/sidebar.service';
export * from '@/shared/components/sidebar/sidebar.variants';
export * from '@/shared/components/sidebar/sidebar.imports';
```

```angular-ts
import { Overlay, OverlayPositionBuilder, type OverlayRef } from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';
import { isPlatformBrowser } from '@angular/common';
import {
  booleanAttribute,
  ChangeDetectionStrategy,
  Component,
  type ComponentRef,
  computed,
  DestroyRef,
  ElementRef,
  inject,
  input,
  PLATFORM_ID,
  type TemplateRef,
  ViewEncapsulation,
} from '@angular/core';

import type { ClassValue } from 'clsx';

import { ZardSidebarService } from '@/shared/components/sidebar/sidebar.service';
import {
  sidebarMenuActionVariants,
  sidebarMenuBadgeVariants,
  sidebarMenuButtonVariants,
  sidebarMenuItemVariants,
  sidebarMenuSkeletonVariants,
  sidebarMenuSubButtonVariants,
  sidebarMenuSubItemVariants,
  sidebarMenuSubVariants,
  sidebarMenuVariants,
  type ZardSidebarMenuButtonSizeVariants,
  type ZardSidebarMenuButtonTypeVariants,
  type ZardSidebarMenuSubButtonSizeVariants,
} from '@/shared/components/sidebar/sidebar.variants';
import { ZardSkeletonComponent } from '@/shared/components/skeleton/skeleton.component';
import { ZardTooltipComponent } from '@/shared/components/tooltip/tooltip';
import { TOOLTIP_POSITIONS_MAP } from '@/shared/components/tooltip/tooltip-positions';
import { ZardIdDirective } from '@/shared/core';
import { mergeClasses } from '@/shared/utils/merge-classes';

/**
 * shadcn picks a random width between 50% and 90% for every skeleton row. Doing that per render
 * would desynchronise the server and the client, so the width is derived from the element's unique
 * id instead — deterministic, and still varied across rows.
 */
const SKELETON_WIDTHS = ['72%', '58%', '85%', '64%', '78%', '51%', '90%', '67%'];

/** Object form of `zTooltip`, the Zard counterpart of passing `TooltipContent` props in shadcn. */
export interface ZardSidebarMenuButtonTooltip {
  content: string | TemplateRef<void>;
  /** Force the tooltip visible (`false`) or suppressed (`true`), regardless of the sidebar state. */
  hidden?: boolean;
}

@Component({
  selector: 'ul[z-sidebar-menu]',
  template: `
    <ng-content />
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: {
    'data-slot': 'sidebar-menu',
    'data-sidebar': 'menu',
    '[class]': 'classes()',
  },
  exportAs: 'zSidebarMenu',
})
export class ZardSidebarMenuComponent {
  readonly class = input<ClassValue>('');

  protected readonly classes = computed(() => mergeClasses(sidebarMenuVariants(), this.class()));
}

@Component({
  selector: 'li[z-sidebar-menu-item]',
  template: `
    <ng-content />
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: {
    'data-slot': 'sidebar-menu-item',
    'data-sidebar': 'menu-item',
    '[class]': 'classes()',
  },
  exportAs: 'zSidebarMenuItem',
})
export class ZardSidebarMenuItemComponent {
  readonly class = input<ClassValue>('');

  protected readonly classes = computed(() => mergeClasses(sidebarMenuItemVariants(), this.class()));
}

@Component({
  selector: 'button[z-sidebar-menu-button], a[z-sidebar-menu-button]',
  template: `
    <ng-content />
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: {
    'data-slot': 'sidebar-menu-button',
    'data-sidebar': 'menu-button',
    '[class]': 'classes()',
    '[attr.data-size]': 'zSize()',
    '[attr.data-active]': 'zActive()',
    '(mouseenter)': 'showTooltip()',
    '(mouseleave)': 'hideTooltip()',
    '(focus)': 'showTooltip()',
    '(blur)': 'hideTooltip()',
  },
  exportAs: 'zSidebarMenuButton',
})
export class ZardSidebarMenuButtonComponent {
  private readonly sidebarService = inject(ZardSidebarService);
  private readonly elementRef = inject(ElementRef<HTMLElement>);
  private readonly overlay = inject(Overlay);
  private readonly overlayPositionBuilder = inject(OverlayPositionBuilder);
  private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));

  private overlayRef?: OverlayRef;
  private tooltipRef?: ComponentRef<ZardTooltipComponent>;

  readonly zType = input<ZardSidebarMenuButtonTypeVariants>('default');
  readonly zSize = input<ZardSidebarMenuButtonSizeVariants>('default');
  readonly zActive = input(false, { transform: booleanAttribute });
  /**
   * Shown only while the sidebar is collapsed on desktop, mirroring shadcn's hidden TooltipContent.
   * Pass the object form to override that rule — `{ content, hidden: false }` keeps the tooltip on
   * an expanded sidebar, which is what shadcn's `tooltip={{ children, hidden: false }}` does.
   */
  readonly zTooltip = input<string | TemplateRef<void> | ZardSidebarMenuButtonTooltip | null>(null);
  readonly class = input<ClassValue>('');

  protected readonly resolvedTooltip = computed(() => {
    const tooltip = this.zTooltip();
    if (!tooltip) {
      return null;
    }

    const isCollapsed = this.sidebarService.state() === 'collapsed' && !this.sidebarService.isMobile();
    const isTooltipObject = typeof tooltip === 'object' && 'content' in tooltip;
    const hidden = isTooltipObject ? (tooltip.hidden ?? !isCollapsed) : !isCollapsed;

    if (hidden) {
      return null;
    }

    return isTooltipObject ? tooltip.content : tooltip;
  });

  protected readonly classes = computed(() =>
    mergeClasses(sidebarMenuButtonVariants({ zType: this.zType(), zSize: this.zSize() }), this.class()),
  );

  constructor() {
    inject(DestroyRef).onDestroy(() => {
      this.hideTooltip();
      this.overlayRef?.dispose();
    });
  }

  /**
   * shadcn wraps the button in a `<Tooltip>` whose content is `hidden` unless the sidebar is
   * collapsed. `ZardTooltipDirective` cannot be used here: Angular host bindings cannot target the
   * inputs of a `hostDirectives` entry, so the conditional value could never reach it. The overlay is
   * driven here instead, reusing `ZardTooltipComponent` for the rendering.
   */
  protected showTooltip(): void {
    if (!this.isBrowser || this.tooltipRef || !this.resolvedTooltip()) {
      return;
    }

    this.overlayRef ??= this.overlay.create({
      positionStrategy: this.overlayPositionBuilder
        .flexibleConnectedTo(this.elementRef)
        .withPositions([{ ...TOOLTIP_POSITIONS_MAP['right'] }]),
    });

    this.tooltipRef = this.overlayRef.attach(new ComponentPortal(ZardTooltipComponent));
    this.tooltipRef.instance.state.set('open');
    this.tooltipRef.instance.setProps(this.resolvedTooltip(), 'right');
  }

  protected hideTooltip(): void {
    if (!this.tooltipRef) {
      return;
    }

    this.tooltipRef.instance.state.set('closed');
    this.tooltipRef = undefined;
    this.overlayRef?.detach();
  }
}

@Component({
  selector: 'button[z-sidebar-menu-action], a[z-sidebar-menu-action]',
  template: `
    <ng-content />
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: {
    'data-slot': 'sidebar-menu-action',
    'data-sidebar': 'menu-action',
    '[class]': 'classes()',
  },
  exportAs: 'zSidebarMenuAction',
})
export class ZardSidebarMenuActionComponent {
  readonly zShowOnHover = input(false, { transform: booleanAttribute });
  readonly class = input<ClassValue>('');

  protected readonly classes = computed(() =>
    mergeClasses(sidebarMenuActionVariants({ zShowOnHover: this.zShowOnHover() }), this.class()),
  );
}

@Component({
  selector: 'z-sidebar-menu-badge, [z-sidebar-menu-badge]',
  template: `
    <ng-content />
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: {
    'data-slot': 'sidebar-menu-badge',
    'data-sidebar': 'menu-badge',
    '[class]': 'classes()',
  },
  exportAs: 'zSidebarMenuBadge',
})
export class ZardSidebarMenuBadgeComponent {
  readonly class = input<ClassValue>('');

  protected readonly classes = computed(() => mergeClasses(sidebarMenuBadgeVariants(), this.class()));
}

@Component({
  selector: 'z-sidebar-menu-skeleton',
  imports: [ZardSkeletonComponent],
  template: `
    @if (zShowIcon()) {
      <z-skeleton class="size-4 rounded-md" data-sidebar="menu-skeleton-icon" />
    }

    <z-skeleton
      class="h-4 max-w-(--skeleton-width) flex-1"
      data-sidebar="menu-skeleton-text"
      [style.--skeleton-width]="skeletonWidth()"
    />
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: {
    'data-slot': 'sidebar-menu-skeleton',
    'data-sidebar': 'menu-skeleton',
    '[class]': 'classes()',
  },
  hostDirectives: [ZardIdDirective],
  exportAs: 'zSidebarMenuSkeleton',
})
export class ZardSidebarMenuSkeletonComponent {
  private readonly uniqueId = inject(ZardIdDirective);

  readonly zShowIcon = input(false, { transform: booleanAttribute });
  readonly class = input<ClassValue>('');

  protected readonly skeletonWidth = computed(() => {
    const sequence = Number(/(\d+)$/.exec(this.uniqueId.id())?.[1] ?? 0);

    return SKELETON_WIDTHS[sequence % SKELETON_WIDTHS.length];
  });

  protected readonly classes = computed(() => mergeClasses(sidebarMenuSkeletonVariants(), this.class()));
}

@Component({
  selector: 'ul[z-sidebar-menu-sub]',
  template: `
    <ng-content />
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: {
    'data-slot': 'sidebar-menu-sub',
    'data-sidebar': 'menu-sub',
    '[class]': 'classes()',
  },
  exportAs: 'zSidebarMenuSub',
})
export class ZardSidebarMenuSubComponent {
  readonly class = input<ClassValue>('');

  protected readonly classes = computed(() => mergeClasses(sidebarMenuSubVariants(), this.class()));
}

@Component({
  selector: 'li[z-sidebar-menu-sub-item]',
  template: `
    <ng-content />
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: {
    'data-slot': 'sidebar-menu-sub-item',
    'data-sidebar': 'menu-sub-item',
    '[class]': 'classes()',
  },
  exportAs: 'zSidebarMenuSubItem',
})
export class ZardSidebarMenuSubItemComponent {
  readonly class = input<ClassValue>('');

  protected readonly classes = computed(() => mergeClasses(sidebarMenuSubItemVariants(), this.class()));
}

@Component({
  selector: 'a[z-sidebar-menu-sub-button], button[z-sidebar-menu-sub-button]',
  template: `
    <ng-content />
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: {
    'data-slot': 'sidebar-menu-sub-button',
    'data-sidebar': 'menu-sub-button',
    '[class]': 'classes()',
    '[attr.data-size]': 'zSize()',
    '[attr.data-active]': 'zActive()',
  },
  exportAs: 'zSidebarMenuSubButton',
})
export class ZardSidebarMenuSubButtonComponent {
  readonly zSize = input<ZardSidebarMenuSubButtonSizeVariants>('md');
  readonly zActive = input(false, { transform: booleanAttribute });
  readonly class = input<ClassValue>('');

  protected readonly classes = computed(() =>
    mergeClasses(sidebarMenuSubButtonVariants({ zSize: this.zSize() }), this.class()),
  );
}
```

```angular-ts
import { ChangeDetectionStrategy, Component, computed, Directive, input, ViewEncapsulation } from '@angular/core';

import type { ClassValue } from 'clsx';

import { separatorVariants } from '@/shared/components/separator/separator.variants';
import {
  sidebarContentVariants,
  sidebarFooterVariants,
  sidebarGroupActionVariants,
  sidebarGroupContentVariants,
  sidebarGroupLabelVariants,
  sidebarGroupVariants,
  sidebarHeaderVariants,
  sidebarSeparatorVariants,
} from '@/shared/components/sidebar/sidebar.variants';
import { mergeClasses } from '@/shared/utils/merge-classes';

@Component({
  selector: 'z-sidebar-header, [z-sidebar-header]',
  template: `
    <ng-content />
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: {
    'data-slot': 'sidebar-header',
    'data-sidebar': 'header',
    '[class]': 'classes()',
  },
  exportAs: 'zSidebarHeader',
})
export class ZardSidebarHeaderComponent {
  readonly class = input<ClassValue>('');

  protected readonly classes = computed(() => mergeClasses(sidebarHeaderVariants(), this.class()));
}

@Component({
  selector: 'z-sidebar-footer, [z-sidebar-footer]',
  template: `
    <ng-content />
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: {
    'data-slot': 'sidebar-footer',
    'data-sidebar': 'footer',
    '[class]': 'classes()',
  },
  exportAs: 'zSidebarFooter',
})
export class ZardSidebarFooterComponent {
  readonly class = input<ClassValue>('');

  protected readonly classes = computed(() => mergeClasses(sidebarFooterVariants(), this.class()));
}

@Component({
  selector: 'z-sidebar-content, [z-sidebar-content]',
  template: `
    <ng-content />
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: {
    'data-slot': 'sidebar-content',
    'data-sidebar': 'content',
    '[class]': 'classes()',
  },
  exportAs: 'zSidebarContent',
})
export class ZardSidebarContentComponent {
  readonly class = input<ClassValue>('');

  protected readonly classes = computed(() => mergeClasses(sidebarContentVariants(), this.class()));
}

@Component({
  selector: 'z-sidebar-separator',
  template: '',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: {
    'data-slot': 'sidebar-separator',
    'data-sidebar': 'separator',
    'data-orientation': 'horizontal',
    role: 'none',
    '[class]': 'classes()',
  },
  exportAs: 'zSidebarSeparator',
})
export class ZardSidebarSeparatorComponent {
  readonly class = input<ClassValue>('');

  // `block` mirrors ZardSeparatorComponent: shadcn renders a div, Zard a custom element.
  protected readonly classes = computed(() =>
    mergeClasses(separatorVariants(), 'block', sidebarSeparatorVariants(), this.class()),
  );
}

/**
 * Adds the sidebar look to a Zard input. Used as `<input z-input z-sidebar-input />`.
 *
 * The classes are static host classes rather than a `[class]` binding so they cannot be dropped by
 * the `[class]` binding that `input[z-input]` owns on the same element. Both backgrounds are
 * `!important` because they share their utility group with the input's own `bg-transparent` /
 * `dark:bg-input/30`, and across two separate directives there is no `cn()` to resolve the tie.
 * The dark value repeats the input's own so the result matches shadcn, where `cn()` keeps
 * `dark:bg-input/30` alongside `bg-background` and the dark variant wins in dark mode.
 */
@Directive({
  selector: 'input[z-sidebar-input]',
  host: {
    'data-slot': 'sidebar-input',
    'data-sidebar': 'input',
    class: 'h-8 w-full bg-background! shadow-none dark:bg-input/30!',
  },
  exportAs: 'zSidebarInput',
})
export class ZardSidebarInputDirective {}

@Component({
  selector: 'z-sidebar-group, [z-sidebar-group]',
  template: `
    <ng-content />
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: {
    'data-slot': 'sidebar-group',
    'data-sidebar': 'group',
    '[class]': 'classes()',
  },
  exportAs: 'zSidebarGroup',
})
export class ZardSidebarGroupComponent {
  readonly class = input<ClassValue>('');

  protected readonly classes = computed(() => mergeClasses(sidebarGroupVariants(), this.class()));
}

@Component({
  selector: 'z-sidebar-group-label, [z-sidebar-group-label]',
  template: `
    <ng-content />
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: {
    'data-slot': 'sidebar-group-label',
    'data-sidebar': 'group-label',
    '[class]': 'classes()',
  },
  exportAs: 'zSidebarGroupLabel',
})
export class ZardSidebarGroupLabelComponent {
  readonly class = input<ClassValue>('');

  protected readonly classes = computed(() => mergeClasses(sidebarGroupLabelVariants(), this.class()));
}

@Component({
  selector: 'button[z-sidebar-group-action]',
  template: `
    <ng-content />
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: {
    'data-slot': 'sidebar-group-action',
    'data-sidebar': 'group-action',
    type: 'button',
    '[class]': 'classes()',
  },
  exportAs: 'zSidebarGroupAction',
})
export class ZardSidebarGroupActionComponent {
  readonly class = input<ClassValue>('');

  protected readonly classes = computed(() => mergeClasses(sidebarGroupActionVariants(), this.class()));
}

@Component({
  selector: 'z-sidebar-group-content, [z-sidebar-group-content]',
  template: `
    <ng-content />
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: {
    'data-slot': 'sidebar-group-content',
    'data-sidebar': 'group-content',
    '[class]': 'classes()',
  },
  exportAs: 'zSidebarGroupContent',
})
export class ZardSidebarGroupContentComponent {
  readonly class = input<ClassValue>('');

  protected readonly classes = computed(() => mergeClasses(sidebarGroupContentVariants(), this.class()));
}
```

```angular-ts
export const ZARD_SIDEBAR_COOKIE_NAME = 'sidebar_state';
export const ZARD_SIDEBAR_COOKIE_MAX_AGE = 60 * 60 * 24 * 7;
export const ZARD_SIDEBAR_WIDTH = '16rem';
export const ZARD_SIDEBAR_WIDTH_MOBILE = '18rem';
export const ZARD_SIDEBAR_WIDTH_ICON = '3rem';
export const ZARD_SIDEBAR_KEYBOARD_SHORTCUT = 'b';
export const ZARD_SIDEBAR_MOBILE_BREAKPOINT = '(max-width: 767.98px)';
```

```angular-ts
import {
  ZardSidebarMenuActionComponent,
  ZardSidebarMenuBadgeComponent,
  ZardSidebarMenuButtonComponent,
  ZardSidebarMenuComponent,
  ZardSidebarMenuItemComponent,
  ZardSidebarMenuSkeletonComponent,
  ZardSidebarMenuSubButtonComponent,
  ZardSidebarMenuSubComponent,
  ZardSidebarMenuSubItemComponent,
} from '@/shared/components/sidebar/sidebar-menu.component';
import {
  ZardSidebarContentComponent,
  ZardSidebarFooterComponent,
  ZardSidebarGroupActionComponent,
  ZardSidebarGroupComponent,
  ZardSidebarGroupContentComponent,
  ZardSidebarGroupLabelComponent,
  ZardSidebarHeaderComponent,
  ZardSidebarInputDirective,
  ZardSidebarSeparatorComponent,
} from '@/shared/components/sidebar/sidebar-primitives.component';
import {
  ZardSidebarComponent,
  ZardSidebarInsetComponent,
  ZardSidebarProviderComponent,
  ZardSidebarRailComponent,
  ZardSidebarTriggerComponent,
} from '@/shared/components/sidebar/sidebar.component';

export const ZardSidebarImports = [
  ZardSidebarProviderComponent,
  ZardSidebarComponent,
  ZardSidebarTriggerComponent,
  ZardSidebarRailComponent,
  ZardSidebarInsetComponent,
  ZardSidebarInputDirective,
  ZardSidebarHeaderComponent,
  ZardSidebarFooterComponent,
  ZardSidebarSeparatorComponent,
  ZardSidebarContentComponent,
  ZardSidebarGroupComponent,
  ZardSidebarGroupLabelComponent,
  ZardSidebarGroupActionComponent,
  ZardSidebarGroupContentComponent,
  ZardSidebarMenuComponent,
  ZardSidebarMenuItemComponent,
  ZardSidebarMenuButtonComponent,
  ZardSidebarMenuActionComponent,
  ZardSidebarMenuBadgeComponent,
  ZardSidebarMenuSkeletonComponent,
  ZardSidebarMenuSubComponent,
  ZardSidebarMenuSubItemComponent,
  ZardSidebarMenuSubButtonComponent,
] as const;
```

```angular-ts
import { BreakpointObserver } from '@angular/cdk/layout';
import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import { computed, inject, Injectable, PLATFORM_ID, REQUEST, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';

import { map, of } from 'rxjs';

import {
  ZARD_SIDEBAR_COOKIE_MAX_AGE,
  ZARD_SIDEBAR_COOKIE_NAME,
  ZARD_SIDEBAR_MOBILE_BREAKPOINT,
} from '@/shared/components/sidebar/sidebar.constants';

export type ZardSidebarState = 'expanded' | 'collapsed';

/**
 * Controls a single sidebar. The Angular counterpart of shadcn's `useSidebar()` hook.
 *
 * Provided by `ZardSidebarProviderComponent` — never `providedIn: 'root'` — so two providers on the
 * same page keep independent states, exactly like two `SidebarProvider` in React.
 */
@Injectable()
export class ZardSidebarService {
  private readonly breakpointObserver = inject(BreakpointObserver);
  private readonly document = inject(DOCUMENT);
  private readonly request = inject(REQUEST, { optional: true });
  private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));

  /** Persisted state, read from `document.cookie` on the client and from the `Cookie` header on the server. */
  private readonly persistedOpen = this.readPersistedOpen();

  private readonly internalOpen = signal(this.persistedOpen ?? true);
  private readonly internalOpenMobile = signal(false);

  /** Mirrors the provider's `zOpen` input. `undefined` means the provider is uncontrolled. */
  readonly controlledOpen = signal<boolean | undefined>(undefined);

  /** Wired by the provider so `setOpen` can emit its `zOpenChange` output. */
  onOpenChange?: (open: boolean) => void;

  readonly isMobile = toSignal(
    this.isBrowser
      ? this.breakpointObserver.observe(ZARD_SIDEBAR_MOBILE_BREAKPOINT).pipe(map(result => result.matches))
      : of(false),
    { initialValue: false },
  );

  readonly open = computed(() => this.controlledOpen() ?? this.internalOpen());
  readonly openMobile = this.internalOpenMobile.asReadonly();
  readonly state = computed<ZardSidebarState>(() => (this.open() ? 'expanded' : 'collapsed'));

  setOpen(value: boolean | ((open: boolean) => boolean)): void {
    const openState = typeof value === 'function' ? value(this.open()) : value;

    // In controlled mode the consumer owns the state — only report the request.
    if (this.controlledOpen() === undefined) {
      this.internalOpen.set(openState);
    }

    this.onOpenChange?.(openState);
    this.persist(openState);
  }

  setOpenMobile(open: boolean): void {
    this.internalOpenMobile.set(open);
  }

  toggleSidebar(): void {
    if (this.isMobile()) {
      this.internalOpenMobile.update(open => !open);
    } else {
      this.setOpen(open => !open);
    }
  }

  /**
   * Applies the provider's `zDefaultOpen`.
   *
   * shadcn's provider only ever writes the cookie: the app reads it server-side and feeds it back in
   * as `defaultOpen`. Angular has no server component to do that, so the service reads it too — but
   * only as the fallback. An explicit `zDefaultOpen` still wins, which keeps that input meaningful
   * and stops one provider's persisted state from deciding for every other provider on the page.
   */
  applyDefaultOpen(defaultOpen: boolean | undefined): void {
    if (defaultOpen !== undefined) {
      this.internalOpen.set(defaultOpen);
      return;
    }

    if (this.persistedOpen === undefined) {
      this.internalOpen.set(true);
    }
  }

  private persist(open: boolean): void {
    if (!this.isBrowser) {
      return;
    }

    this.document.cookie = `${ZARD_SIDEBAR_COOKIE_NAME}=${open}; path=/; max-age=${ZARD_SIDEBAR_COOKIE_MAX_AGE}`;
  }

  private readPersistedOpen(): boolean | undefined {
    const cookies = this.isBrowser ? this.document.cookie : this.request?.headers?.get('cookie');
    if (!cookies) {
      return undefined;
    }

    const match = new RegExp(`(?:^|;\\s*)${ZARD_SIDEBAR_COOKIE_NAME}=(true|false)`).exec(cookies);
    return match ? match[1] === 'true' : undefined;
  }
}
```

## Usage

```angular-ts
import { ZardSidebarImports } from '@/shared/components/sidebar/sidebar.imports';
```

```angular-html
<z-sidebar-provider>
  <z-sidebar>
    <div z-sidebar-header></div>
    <z-sidebar-content>
      <div z-sidebar-group></div>
    </z-sidebar-content>
    <div z-sidebar-footer></div>
  </z-sidebar>
  <main z-sidebar-inset>
    <button z-sidebar-trigger></button>
  </main>
</z-sidebar-provider>
```

## Composition

```text
z-sidebar-provider
├── z-sidebar
│   ├── [z-sidebar-header]
│   ├── z-sidebar-content
│   │   ├── [z-sidebar-group]
│   │   │   ├── [z-sidebar-group-label]
│   │   │   ├── button[z-sidebar-group-action]
│   │   │   ├── [z-sidebar-group-content]
│   │   │   └── ul[z-sidebar-menu]
│   │   │       ├── li[z-sidebar-menu-item]
│   │   │       │   ├── button[z-sidebar-menu-button]
│   │   │       │   ├── button[z-sidebar-menu-action]
│   │   │       │   └── [z-sidebar-menu-badge]
│   │   │       └── li[z-sidebar-menu-item]
│   │   │           ├── button[z-sidebar-menu-button]
│   │   │           └── ul[z-sidebar-menu-sub]
│   │   │               ├── li[z-sidebar-menu-sub-item]
│   │   │               └── li[z-sidebar-menu-sub-item]
│   │   └── [z-sidebar-group]
│   │       └── ul[z-sidebar-menu]
│   │           ├── li[z-sidebar-menu-item]
│   │           └── li[z-sidebar-menu-item]
│   ├── [z-sidebar-footer]
│   └── button[z-sidebar-rail]
├── main[z-sidebar-inset]
└── button[z-sidebar-trigger]
```

## Examples

### Structure

The regions a sidebar is made of. Every one of them is optional, and they can be composed in any order.

```angular-ts
import { ChangeDetectionStrategy, Component } from '@angular/core';

import { ZardSidebarImports } from '@/shared/components/sidebar/sidebar.imports';

@Component({
  selector: 'z-demo-sidebar-structure',
  imports: [ZardSidebarImports],
  template: `
    <z-sidebar-provider class="relative h-104 min-h-0 transform-gpu overflow-hidden rounded-xl border">
      <z-sidebar zCollapsible="none" class="border-r">
        <div z-sidebar-header class="border-b border-dashed">
          <span class="text-muted-foreground text-xs font-medium">SidebarHeader</span>
        </div>

        <z-sidebar-content>
          <div z-sidebar-group class="border-b border-dashed">
            <div z-sidebar-group-label>SidebarGroup</div>

            <div z-sidebar-group-content>
              <ul z-sidebar-menu>
                <li z-sidebar-menu-item>
                  <button z-sidebar-menu-button>SidebarMenuItem</button>
                </li>
                <li z-sidebar-menu-item>
                  <button z-sidebar-menu-button>SidebarMenuItem</button>
                </li>
              </ul>
            </div>
          </div>

          <div z-sidebar-group class="border-b border-dashed">
            <div z-sidebar-group-label>SidebarGroup</div>

            <div z-sidebar-group-content>
              <ul z-sidebar-menu>
                <li z-sidebar-menu-item>
                  <button z-sidebar-menu-button>SidebarMenuItem</button>
                </li>
              </ul>
            </div>
          </div>
        </z-sidebar-content>

        <div z-sidebar-footer class="border-t border-dashed">
          <span class="text-muted-foreground text-xs font-medium">SidebarFooter</span>
        </div>
      </z-sidebar>

      <main z-sidebar-inset class="p-4">
        <div class="flex h-full items-center justify-center rounded-xl border border-dashed">
          <span class="text-muted-foreground text-xs font-medium">SidebarInset</span>
        </div>
      </main>
    </z-sidebar-provider>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ZardDemoSidebarStructureComponent {}
```

### Custom Width

The provider writes `--sidebar-width` and `--sidebar-width-icon` inline on its own host. Pass `style` to override them for a single provider, without touching the constants.

```angular-ts
import { ChangeDetectionStrategy, Component } from '@angular/core';

import { ZardSidebarImports } from '@/shared/components/sidebar/sidebar.imports';

@Component({
  selector: 'z-demo-sidebar-custom-width',
  imports: [ZardSidebarImports],
  template: `
    <div class="flex w-full flex-col gap-4">
      <z-sidebar-provider class="relative h-40 min-h-0 transform-gpu overflow-hidden rounded-xl border">
        <z-sidebar zCollapsible="none">
          <div z-sidebar-header class="font-medium">Default</div>

          <z-sidebar-content>
            <div z-sidebar-group>
              <div z-sidebar-group-label>16rem wide</div>
            </div>
          </z-sidebar-content>
        </z-sidebar>

        <main z-sidebar-inset class="p-4 text-sm">Uses the default --sidebar-width</main>
      </z-sidebar-provider>

      <z-sidebar-provider
        class="relative h-40 min-h-0 transform-gpu overflow-hidden rounded-xl border"
        style="--sidebar-width: 20rem; --sidebar-width-icon: 4rem"
      >
        <z-sidebar zCollapsible="none">
          <div z-sidebar-header class="font-medium">Wider</div>

          <z-sidebar-content>
            <div z-sidebar-group>
              <div z-sidebar-group-label>20rem wide</div>
            </div>
          </z-sidebar-content>
        </z-sidebar>

        <main z-sidebar-inset class="p-4 text-sm">Overrides it inline, without touching the constants</main>
      </z-sidebar-provider>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ZardDemoSidebarCustomWidthComponent {}
```

**The defaults**

```angular-ts
// The defaults the provider writes onto its own host. Override them per provider through the
// `style` input (see the custom-width example) rather than editing these — the docs site itself
// declares a global `--sidebar-width` for its navigation, and the inline values are what keep the
// two from clashing.
export const ZARD_SIDEBAR_COOKIE_NAME = 'sidebar_state';
export const ZARD_SIDEBAR_COOKIE_MAX_AGE = 60 * 60 * 24 * 7;
export const ZARD_SIDEBAR_WIDTH = '16rem';
export const ZARD_SIDEBAR_WIDTH_MOBILE = '18rem';
export const ZARD_SIDEBAR_WIDTH_ICON = '3rem';
export const ZARD_SIDEBAR_KEYBOARD_SHORTCUT = 'b';
export const ZARD_SIDEBAR_MOBILE_BREAKPOINT = '(max-width: 767.98px)';
```

### Keyboard Shortcut

The provider registers `⌘/Ctrl + B` on the document while it is alive.

```angular-ts
import { ChangeDetectionStrategy, Component } from '@angular/core';

import { ZardKbdGroupComponent } from '@/shared/components/kbd/kbd-group.component';
import { ZardKbdComponent } from '@/shared/components/kbd/kbd.component';
import { ZardSidebarImports } from '@/shared/components/sidebar/sidebar.imports';

@Component({
  selector: 'z-demo-sidebar-keyboard-shortcut',
  imports: [ZardSidebarImports, ZardKbdComponent, ZardKbdGroupComponent],
  template: `
    <z-sidebar-provider
      zDefaultOpen="true"
      #provider="zSidebarProvider"
      class="relative h-72 min-h-0 transform-gpu overflow-hidden rounded-xl border"
    >
      <z-sidebar zCollapsible="icon" class="h-full">
        <z-sidebar-content>
          <div z-sidebar-group>
            <div z-sidebar-group-label>Navigation</div>

            <div z-sidebar-group-content>
              <ul z-sidebar-menu>
                <li z-sidebar-menu-item>
                  <button z-sidebar-menu-button zTooltip="Dashboard">Dashboard</button>
                </li>
                <li z-sidebar-menu-item>
                  <button z-sidebar-menu-button zTooltip="Reports">Reports</button>
                </li>
              </ul>
            </div>
          </div>
        </z-sidebar-content>

        <button z-sidebar-rail aria-label="Toggle Sidebar"></button>
      </z-sidebar>

      <main z-sidebar-inset class="flex flex-col gap-4 p-4">
        <button z-sidebar-trigger class="self-start" aria-label="Toggle Sidebar"></button>

        <p class="flex flex-wrap items-center gap-2 text-sm">
          Press
          <z-kbd-group>
            <z-kbd>⌘</z-kbd>
            <span>+</span>
            <z-kbd>B</z-kbd>
          </z-kbd-group>
          on macOS or
          <z-kbd-group>
            <z-kbd>Ctrl</z-kbd>
            <span>+</span>
            <z-kbd>B</z-kbd>
          </z-kbd-group>
          elsewhere to toggle the sidebar.
        </p>

        <p class="text-muted-foreground text-sm">
          Current state:
          <span class="text-foreground font-medium">{{ provider.sidebarService.state() }}</span>
        </p>
      </main>
    </z-sidebar-provider>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ZardDemoSidebarKeyboardShortcutComponent {}
```

### Side Right

Use `zSide="right"` and declare the inset **before** the sidebar, so the gap the sidebar reserves lands on the correct side.

```angular-ts
import { ChangeDetectionStrategy, Component } from '@angular/core';

import { ZardSidebarImports } from '@/shared/components/sidebar/sidebar.imports';

@Component({
  selector: 'z-demo-sidebar-side-right',
  imports: [ZardSidebarImports],
  template: `
    <z-sidebar-provider
      zDefaultOpen="true"
      class="relative h-72 min-h-0 transform-gpu overflow-hidden rounded-xl border"
    >
      <main z-sidebar-inset class="flex flex-col gap-4 p-4">
        <button z-sidebar-trigger class="self-start" aria-label="Toggle Sidebar"></button>
        <p class="text-muted-foreground text-sm">The inset comes first, so the sidebar docks on the right.</p>
      </main>

      <z-sidebar zSide="right" class="h-full">
        <div z-sidebar-header class="font-medium">Inspector</div>

        <z-sidebar-content>
          <div z-sidebar-group>
            <div z-sidebar-group-label>Properties</div>

            <div z-sidebar-group-content>
              <ul z-sidebar-menu>
                <li z-sidebar-menu-item>
                  <button z-sidebar-menu-button>Appearance</button>
                </li>
                <li z-sidebar-menu-item>
                  <button z-sidebar-menu-button>Layout</button>
                </li>
                <li z-sidebar-menu-item>
                  <button z-sidebar-menu-button>Typography</button>
                </li>
              </ul>
            </div>
          </div>
        </z-sidebar-content>

        <button z-sidebar-rail aria-label="Toggle Sidebar"></button>
      </z-sidebar>
    </z-sidebar-provider>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ZardDemoSidebarSideRightComponent {}
```

### Variant Floating

Use `zVariant="floating"` to detach the panel from the viewport edge.

```angular-ts
import { ChangeDetectionStrategy, Component } from '@angular/core';

import { ZardSidebarImports } from '@/shared/components/sidebar/sidebar.imports';

@Component({
  selector: 'z-demo-sidebar-variant-floating',
  imports: [ZardSidebarImports],
  template: `
    <z-sidebar-provider
      zDefaultOpen="true"
      class="relative h-72 min-h-0 transform-gpu overflow-hidden rounded-xl border"
    >
      <z-sidebar zVariant="floating" zCollapsible="icon" class="h-full">
        <div z-sidebar-header class="font-medium">Floating</div>

        <z-sidebar-content>
          <div z-sidebar-group>
            <div z-sidebar-group-content>
              <ul z-sidebar-menu>
                <li z-sidebar-menu-item>
                  <button z-sidebar-menu-button zTooltip="Overview">Overview</button>
                </li>
                <li z-sidebar-menu-item>
                  <button z-sidebar-menu-button zTooltip="Activity">Activity</button>
                </li>
              </ul>
            </div>
          </div>
        </z-sidebar-content>
      </z-sidebar>

      <main z-sidebar-inset class="flex flex-col gap-4 p-4">
        <button z-sidebar-trigger class="self-start" aria-label="Toggle Sidebar"></button>
        <p class="text-muted-foreground text-sm">The panel is inset by 2 and gets its own border and shadow.</p>
      </main>
    </z-sidebar-provider>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ZardDemoSidebarVariantFloatingComponent {}
```

### Variant Inset

Use `zVariant="inset"` together with `main[z-sidebar-inset]`. The inset wrapper is what paints the sidebar background behind the floating page, so the variant does nothing without it.

```angular-ts
import { ChangeDetectionStrategy, Component } from '@angular/core';

import { ZardSidebarImports } from '@/shared/components/sidebar/sidebar.imports';

@Component({
  selector: 'z-demo-sidebar-variant-inset',
  imports: [ZardSidebarImports],
  template: `
    <z-sidebar-provider
      zDefaultOpen="true"
      class="relative h-72 min-h-0 transform-gpu overflow-hidden rounded-xl border"
    >
      <z-sidebar zVariant="inset" zCollapsible="icon" class="h-full">
        <div z-sidebar-header class="font-medium">Inset</div>

        <z-sidebar-content>
          <div z-sidebar-group>
            <div z-sidebar-group-content>
              <ul z-sidebar-menu>
                <li z-sidebar-menu-item>
                  <button z-sidebar-menu-button zTooltip="Projects">Projects</button>
                </li>
                <li z-sidebar-menu-item>
                  <button z-sidebar-menu-button zTooltip="Members">Members</button>
                </li>
              </ul>
            </div>
          </div>
        </z-sidebar-content>
      </z-sidebar>

      <main z-sidebar-inset class="flex flex-col gap-4 p-4">
        <button z-sidebar-trigger class="self-start" aria-label="Toggle Sidebar"></button>
        <p class="text-muted-foreground text-sm">
          The wrapper paints itself with the sidebar colour and the inset floats above it.
        </p>
      </main>
    </z-sidebar-provider>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ZardDemoSidebarVariantInsetComponent {}
```

### Collapsible Icon

Use `zCollapsible="icon"` to shrink the sidebar down to its icons. Pass `zTooltip` on the menu buttons — the tooltip only shows while collapsed on desktop.

```angular-ts
import { ChangeDetectionStrategy, Component } from '@angular/core';

import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideCalendar, lucideHouse, lucideInbox, lucideSettings } from '@ng-icons/lucide';

import { ZardSidebarImports } from '@/shared/components/sidebar/sidebar.imports';

@Component({
  selector: 'z-demo-sidebar-collapsible-icon',
  imports: [ZardSidebarImports, NgIcon],
  template: `
    <z-sidebar-provider
      zDefaultOpen="true"
      class="relative h-72 min-h-0 transform-gpu overflow-hidden rounded-xl border"
    >
      <z-sidebar zCollapsible="icon" class="h-full">
        <z-sidebar-content>
          <div z-sidebar-group>
            <div z-sidebar-group-label>Platform</div>

            <div z-sidebar-group-content>
              <ul z-sidebar-menu>
                @for (item of navItems; track item.title) {
                  <li z-sidebar-menu-item>
                    <button z-sidebar-menu-button [zTooltip]="item.title">
                      <ng-icon [name]="item.icon" />
                      <span>{{ item.title }}</span>
                    </button>
                  </li>
                }
              </ul>
            </div>
          </div>
        </z-sidebar-content>
      </z-sidebar>

      <main z-sidebar-inset class="flex flex-col gap-4 p-4">
        <button z-sidebar-trigger class="self-start" aria-label="Toggle Sidebar"></button>
        <p class="text-muted-foreground text-sm">
          Collapse the sidebar and hover an icon — the label comes back as a tooltip.
        </p>
      </main>
    </z-sidebar-provider>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  viewProviders: [provideIcons({ lucideCalendar, lucideHouse, lucideInbox, lucideSettings })],
})
export class ZardDemoSidebarCollapsibleIconComponent {
  readonly navItems = [
    { title: 'Home', icon: 'lucideHouse' },
    { title: 'Inbox', icon: 'lucideInbox' },
    { title: 'Calendar', icon: 'lucideCalendar' },
    { title: 'Settings', icon: 'lucideSettings' },
  ];
}
```

### Collapsible Offcanvas

The default. The panel slides fully out of view and the rail brings it back.

```angular-ts
import { ChangeDetectionStrategy, Component } from '@angular/core';

import { ZardSidebarImports } from '@/shared/components/sidebar/sidebar.imports';

@Component({
  selector: 'z-demo-sidebar-collapsible-offcanvas',
  imports: [ZardSidebarImports],
  template: `
    <z-sidebar-provider
      zDefaultOpen="true"
      class="relative h-72 min-h-0 transform-gpu overflow-hidden rounded-xl border"
    >
      <z-sidebar zCollapsible="offcanvas" class="h-full">
        <div z-sidebar-header class="font-medium">Offcanvas</div>

        <z-sidebar-content>
          <div z-sidebar-group>
            <div z-sidebar-group-content>
              <ul z-sidebar-menu>
                <li z-sidebar-menu-item>
                  <button z-sidebar-menu-button>Documents</button>
                </li>
                <li z-sidebar-menu-item>
                  <button z-sidebar-menu-button>Shared with me</button>
                </li>
                <li z-sidebar-menu-item>
                  <button z-sidebar-menu-button>Trash</button>
                </li>
              </ul>
            </div>
          </div>
        </z-sidebar-content>

        <button z-sidebar-rail aria-label="Toggle Sidebar"></button>
      </z-sidebar>

      <main z-sidebar-inset class="flex flex-col gap-4 p-4">
        <button z-sidebar-trigger class="self-start" aria-label="Toggle Sidebar"></button>
        <p class="text-muted-foreground text-sm">
          The default. The whole panel slides out of view, and the rail stays behind as a thin handle to bring it back.
        </p>
      </main>
    </z-sidebar-provider>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ZardDemoSidebarCollapsibleOffcanvasComponent {}
```

### Collapsible None

Use `zCollapsible="none"` for a static column: no gap, no rail, no collapsing.

```angular-ts
import { ChangeDetectionStrategy, Component } from '@angular/core';

import { ZardSidebarImports } from '@/shared/components/sidebar/sidebar.imports';

@Component({
  selector: 'z-demo-sidebar-collapsible-none',
  imports: [ZardSidebarImports],
  template: `
    <z-sidebar-provider class="relative h-72 min-h-0 transform-gpu overflow-hidden rounded-xl border">
      <z-sidebar zCollapsible="none" class="border-r">
        <div z-sidebar-header class="font-medium">Always open</div>

        <z-sidebar-content>
          <div z-sidebar-group>
            <div z-sidebar-group-content>
              <ul z-sidebar-menu>
                <li z-sidebar-menu-item>
                  <button z-sidebar-menu-button zActive>General</button>
                </li>
                <li z-sidebar-menu-item>
                  <button z-sidebar-menu-button>Billing</button>
                </li>
                <li z-sidebar-menu-item>
                  <button z-sidebar-menu-button>Notifications</button>
                </li>
              </ul>
            </div>
          </div>
        </z-sidebar-content>
      </z-sidebar>

      <main z-sidebar-inset class="p-4">
        <p class="text-muted-foreground text-sm">
          No trigger, no rail, no gap — the sidebar is a plain column that never collapses.
        </p>
      </main>
    </z-sidebar-provider>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ZardDemoSidebarCollapsibleNoneComponent {}
```

### Use Sidebar

Inject `ZardSidebarService` from any component inside the provider — the Angular counterpart of shadcn's `useSidebar()` hook.

```angular-ts
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';

import { ZardBadgeComponent } from '@/shared/components/badge/badge.component';
import { ZardButtonComponent } from '@/shared/components/button/button.component';
import { ZardSidebarImports } from '@/shared/components/sidebar/sidebar.imports';
import { ZardSidebarService } from '@/shared/components/sidebar/sidebar.service';

/**
 * Any component rendered inside z-sidebar-provider can inject the service — this is the Angular
 * counterpart of shadcn's useSidebar() hook.
 */
@Component({
  selector: 'z-demo-sidebar-debug-panel',
  imports: [ZardButtonComponent, ZardBadgeComponent],
  template: `
    <div class="flex flex-col items-start gap-3">
      <button z-button zType="outline" zSize="sm" (click)="sidebar.toggleSidebar()">toggleSidebar()</button>

      <dl class="grid grid-cols-[auto_1fr] items-center gap-x-3 gap-y-2 text-sm">
        <dt class="text-muted-foreground">state</dt>
        <dd>
          <z-badge zType="secondary">{{ sidebar.state() }}</z-badge>
        </dd>

        <dt class="text-muted-foreground">open</dt>
        <dd>
          <z-badge zType="secondary">{{ sidebar.open() }}</z-badge>
        </dd>

        <dt class="text-muted-foreground">isMobile</dt>
        <dd>
          <z-badge zType="secondary">{{ sidebar.isMobile() }}</z-badge>
        </dd>

        <dt class="text-muted-foreground">openMobile</dt>
        <dd>
          <z-badge zType="secondary">{{ sidebar.openMobile() }}</z-badge>
        </dd>
      </dl>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ZardDemoSidebarDebugPanelComponent {
  protected readonly sidebar = inject(ZardSidebarService);
}

@Component({
  selector: 'z-demo-sidebar-use-sidebar',
  imports: [ZardSidebarImports, ZardDemoSidebarDebugPanelComponent],
  template: `
    <z-sidebar-provider
      zDefaultOpen="true"
      class="relative h-72 min-h-0 transform-gpu overflow-hidden rounded-xl border"
    >
      <z-sidebar zCollapsible="icon" class="h-full">
        <z-sidebar-content>
          <div z-sidebar-group>
            <div z-sidebar-group-content>
              <ul z-sidebar-menu>
                <li z-sidebar-menu-item>
                  <button z-sidebar-menu-button zTooltip="Overview">Overview</button>
                </li>
                <li z-sidebar-menu-item>
                  <button z-sidebar-menu-button zTooltip="Insights">Insights</button>
                </li>
              </ul>
            </div>
          </div>
        </z-sidebar-content>
      </z-sidebar>

      <main z-sidebar-inset class="p-4">
        <z-demo-sidebar-debug-panel />
      </main>
    </z-sidebar-provider>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ZardDemoSidebarUseSidebarComponent {}
```

### Header

A workspace switcher in `[z-sidebar-header]`, built with `z-dropdown`.

```angular-ts
import { ChangeDetectionStrategy, Component, signal } from '@angular/core';

import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideChevronDown, lucideGalleryVerticalEnd } from '@ng-icons/lucide';

import { ZardDropdownImports } from '@/shared/components/dropdown/dropdown.imports';
import { ZardSidebarImports } from '@/shared/components/sidebar/sidebar.imports';

@Component({
  selector: 'z-demo-sidebar-header',
  imports: [ZardSidebarImports, ZardDropdownImports, NgIcon],
  template: `
    <z-sidebar-provider class="relative h-72 min-h-0 transform-gpu overflow-hidden rounded-xl border">
      <z-sidebar zCollapsible="none">
        <div z-sidebar-header>
          <ul z-sidebar-menu>
            <li z-sidebar-menu-item>
              <button z-sidebar-menu-button zSize="lg" z-dropdown [zDropdownMenu]="workspaces">
                <div
                  class="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg"
                >
                  <ng-icon name="lucideGalleryVerticalEnd" class="size-4" />
                </div>

                <div class="grid flex-1 text-left text-sm/tight">
                  <span class="truncate font-medium">{{ workspace().name }}</span>
                  <span class="text-muted-foreground truncate text-xs">{{ workspace().plan }}</span>
                </div>

                <ng-icon name="lucideChevronDown" class="ml-auto" />
              </button>

              <z-dropdown-menu-content
                #workspaces="zDropdownMenuContent"
                class="w-(--z-dropdown-menu-trigger-width) min-w-56 rounded-lg"
                zAlign="start"
              >
                <z-dropdown-menu-label>Workspaces</z-dropdown-menu-label>
                @for (option of workspaces_; track option.name) {
                  <z-dropdown-menu-item (click)="workspace.set(option)">{{ option.name }}</z-dropdown-menu-item>
                }
              </z-dropdown-menu-content>
            </li>
          </ul>
        </div>

        <z-sidebar-content>
          <div z-sidebar-group>
            <div z-sidebar-group-label>Switching updates the label above</div>
          </div>
        </z-sidebar-content>
      </z-sidebar>

      <main z-sidebar-inset class="p-4">
        <p class="text-muted-foreground text-sm">
          Active workspace:
          <span class="text-foreground font-medium">{{ workspace().name }}</span>
        </p>
      </main>
    </z-sidebar-provider>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  viewProviders: [provideIcons({ lucideChevronDown, lucideGalleryVerticalEnd })],
})
export class ZardDemoSidebarHeaderComponent {
  readonly workspaces_ = [
    { name: 'Acme Inc', plan: 'Enterprise' },
    { name: 'Acme Corp.', plan: 'Startup' },
    { name: 'Evil Corp.', plan: 'Free' },
  ];

  readonly workspace = signal(this.workspaces_[0]);
}
```

### Footer

A user menu in `[z-sidebar-footer]`, built with `z-avatar` and `z-dropdown`.

```angular-ts
import { ChangeDetectionStrategy, Component, signal } from '@angular/core';

import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideChevronsUpDown, lucideLogOut, lucideSettings, lucideUser } from '@ng-icons/lucide';

import { ZardAvatarComponent } from '@/shared/components/avatar/avatar.component';
import { ZardDropdownImports } from '@/shared/components/dropdown/dropdown.imports';
import { ZardSidebarImports } from '@/shared/components/sidebar/sidebar.imports';

@Component({
  selector: 'z-demo-sidebar-footer',
  imports: [ZardSidebarImports, ZardDropdownImports, ZardAvatarComponent, NgIcon],
  template: `
    <z-sidebar-provider class="relative h-72 min-h-0 transform-gpu overflow-hidden rounded-xl border">
      <z-sidebar zCollapsible="none">
        <z-sidebar-content>
          <div z-sidebar-group>
            <div z-sidebar-group-label>The user menu lives in the footer</div>
          </div>
        </z-sidebar-content>

        <div z-sidebar-footer>
          <ul z-sidebar-menu>
            <li z-sidebar-menu-item>
              <button z-sidebar-menu-button zSize="lg" z-dropdown [zDropdownMenu]="account">
                <z-avatar
                  class="size-8 rounded-lg"
                  zSrc="https://github.com/zard-ui.png"
                  zAlt="zard ui"
                  zFallback="ZU"
                />

                <div class="grid flex-1 text-left text-sm/tight">
                  <span class="truncate font-medium">zard ui</span>
                  <span class="text-muted-foreground truncate text-xs">m&#64;example.com</span>
                </div>

                <ng-icon name="lucideChevronsUpDown" class="ml-auto" />
              </button>

              <z-dropdown-menu-content
                #account="zDropdownMenuContent"
                class="w-(--z-dropdown-menu-trigger-width) min-w-56 rounded-lg"
                zSide="right"
                zAlign="end"
              >
                <z-dropdown-menu-item (click)="lastAction.set('Profile')">
                  <ng-icon name="lucideUser" />
                  Profile
                </z-dropdown-menu-item>
                <z-dropdown-menu-item (click)="lastAction.set('Settings')">
                  <ng-icon name="lucideSettings" />
                  Settings
                </z-dropdown-menu-item>
                <z-dropdown-menu-separator />
                <z-dropdown-menu-item (click)="lastAction.set('Logout')">
                  <ng-icon name="lucideLogOut" />
                  Logout
                </z-dropdown-menu-item>
              </z-dropdown-menu-content>
            </li>
          </ul>
        </div>
      </z-sidebar>

      <main z-sidebar-inset class="p-4">
        <p class="text-muted-foreground text-sm">
          Last action:
          <span class="text-foreground font-medium">{{ lastAction() }}</span>
        </p>
      </main>
    </z-sidebar-provider>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  viewProviders: [provideIcons({ lucideChevronsUpDown, lucideLogOut, lucideSettings, lucideUser })],
})
export class ZardDemoSidebarFooterComponent {
  readonly lastAction = signal('none');
}
```

### Group Collapsible

Wrap `[z-sidebar-group]` in `z-collapsible` and use the group label as the trigger. The chevron rotates through `group-data-[state=open]/collapsible:rotate-180`.

```angular-ts
import { ChangeDetectionStrategy, Component } from '@angular/core';

import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideChevronDown } from '@ng-icons/lucide';

import { ZardCollapsibleImports } from '@/shared/components/collapsible/collapsible.imports';
import { ZardSidebarImports } from '@/shared/components/sidebar/sidebar.imports';

@Component({
  selector: 'z-demo-sidebar-group-collapsible',
  imports: [ZardSidebarImports, ZardCollapsibleImports, NgIcon],
  template: `
    <z-sidebar-provider class="relative h-80 min-h-0 transform-gpu overflow-hidden rounded-xl border">
      <z-sidebar zCollapsible="none">
        <z-sidebar-content>
          @for (group of groups; track group.label) {
            <z-collapsible class="group/collapsible" [zOpen]="group.defaultOpen">
              <div z-sidebar-group>
                <button z-collapsible-trigger z-sidebar-group-label class="w-full">
                  {{ group.label }}
                  <ng-icon
                    name="lucideChevronDown"
                    class="ml-auto transition-transform group-data-[state=open]/collapsible:rotate-180"
                  />
                </button>

                <z-collapsible-content>
                  <div z-sidebar-group-content>
                    <ul z-sidebar-menu>
                      @for (item of group.items; track item) {
                        <li z-sidebar-menu-item>
                          <button z-sidebar-menu-button>{{ item }}</button>
                        </li>
                      }
                    </ul>
                  </div>
                </z-collapsible-content>
              </div>
            </z-collapsible>
          }
        </z-sidebar-content>
      </z-sidebar>

      <main z-sidebar-inset class="p-4">
        <p class="text-muted-foreground text-sm">
          A z-sidebar-group wrapped in z-collapsible, using the group label as the trigger.
        </p>
      </main>
    </z-sidebar-provider>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  viewProviders: [provideIcons({ lucideChevronDown })],
})
export class ZardDemoSidebarGroupCollapsibleComponent {
  readonly groups = [
    { label: 'Getting Started', defaultOpen: true, items: ['Installation', 'Project Structure'] },
    { label: 'Building Your Application', defaultOpen: false, items: ['Routing', 'Data Fetching', 'Rendering'] },
    { label: 'API Reference', defaultOpen: false, items: ['Components', 'File Conventions'] },
  ];
}
```

### Group Action

Use `button[z-sidebar-group-action]` for an action pinned to the group heading.

```angular-ts
import { ChangeDetectionStrategy, Component, signal } from '@angular/core';

import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucidePlus } from '@ng-icons/lucide';

import { ZardSidebarImports } from '@/shared/components/sidebar/sidebar.imports';

@Component({
  selector: 'z-demo-sidebar-group-action',
  imports: [ZardSidebarImports, NgIcon],
  template: `
    <z-sidebar-provider class="relative h-72 min-h-0 transform-gpu overflow-hidden rounded-xl border">
      <z-sidebar zCollapsible="none">
        <z-sidebar-content>
          <div z-sidebar-group>
            <div z-sidebar-group-label>Projects</div>

            <button z-sidebar-group-action title="Add Project" (click)="addProject()">
              <ng-icon name="lucidePlus" />
              <span class="sr-only">Add Project</span>
            </button>

            <div z-sidebar-group-content>
              <ul z-sidebar-menu>
                @for (project of projects(); track project) {
                  <li z-sidebar-menu-item>
                    <button z-sidebar-menu-button>{{ project }}</button>
                  </li>
                }
              </ul>
            </div>
          </div>
        </z-sidebar-content>
      </z-sidebar>

      <main z-sidebar-inset class="p-4">
        <p class="text-muted-foreground text-sm">
          The action sits in the top-right corner of the group and hides when the sidebar collapses to icons.
        </p>
      </main>
    </z-sidebar-provider>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  viewProviders: [provideIcons({ lucidePlus })],
})
export class ZardDemoSidebarGroupActionComponent {
  readonly projects = signal(['Design Engineering', 'Sales & Marketing']);

  addProject(): void {
    this.projects.update(projects => [...projects, 'Project ' + (projects.length + 1)]);
  }
}
```

### Menu Action

Use `button[z-sidebar-menu-action]` with `zShowOnHover` for a per-row action.

```angular-ts
import { ChangeDetectionStrategy, Component, signal } from '@angular/core';

import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideMoreHorizontal } from '@ng-icons/lucide';

import { ZardDropdownImports } from '@/shared/components/dropdown/dropdown.imports';
import { ZardSidebarImports } from '@/shared/components/sidebar/sidebar.imports';

@Component({
  selector: 'z-demo-sidebar-menu-action',
  imports: [ZardSidebarImports, ZardDropdownImports, NgIcon],
  template: `
    <z-sidebar-provider class="relative h-72 min-h-0 transform-gpu overflow-hidden rounded-xl border">
      <z-sidebar zCollapsible="none">
        <z-sidebar-content>
          <div z-sidebar-group>
            <div z-sidebar-group-label>Projects</div>

            <div z-sidebar-group-content>
              <ul z-sidebar-menu>
                @for (project of projects; track project) {
                  <li z-sidebar-menu-item>
                    <button z-sidebar-menu-button>{{ project }}</button>

                    <button z-sidebar-menu-action zShowOnHover z-dropdown [zDropdownMenu]="projectMenu">
                      <ng-icon name="lucideMoreHorizontal" />
                      <span class="sr-only">More</span>
                    </button>
                  </li>
                }
              </ul>
            </div>
          </div>
        </z-sidebar-content>
      </z-sidebar>

      <z-dropdown-menu-content #projectMenu="zDropdownMenuContent" class="w-40 rounded-lg" zSide="right" zAlign="start">
        <z-dropdown-menu-item (click)="lastAction.set('Rename')">Rename</z-dropdown-menu-item>
        <z-dropdown-menu-item (click)="lastAction.set('Duplicate')">Duplicate</z-dropdown-menu-item>
        <z-dropdown-menu-item (click)="lastAction.set('Delete')">Delete</z-dropdown-menu-item>
      </z-dropdown-menu-content>

      <main z-sidebar-inset class="p-4">
        <p class="text-muted-foreground text-sm">
          With zShowOnHover the action only appears on hover or keyboard focus. Last action:
          <span class="text-foreground font-medium">{{ lastAction() }}</span>
        </p>
      </main>
    </z-sidebar-provider>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  viewProviders: [provideIcons({ lucideMoreHorizontal })],
})
export class ZardDemoSidebarMenuActionComponent {
  readonly projects = ['Design Engineering', 'Sales & Marketing', 'Travel'];
  readonly lastAction = signal('none');
}
```

### Menu Sub

Use `ul[z-sidebar-menu-sub]` inside a collapsible menu item. Applying `[z-collapsible]` to the `li` is the idiomatic translation of shadcn's `asChild`.

```angular-ts
import { ChangeDetectionStrategy, Component } from '@angular/core';

import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideChevronRight } from '@ng-icons/lucide';

import { ZardCollapsibleImports } from '@/shared/components/collapsible/collapsible.imports';
import { ZardSidebarImports } from '@/shared/components/sidebar/sidebar.imports';

@Component({
  selector: 'z-demo-sidebar-menu-sub',
  imports: [ZardSidebarImports, ZardCollapsibleImports, NgIcon],
  template: `
    <z-sidebar-provider class="relative h-80 min-h-0 transform-gpu overflow-hidden rounded-xl border">
      <z-sidebar zCollapsible="none">
        <z-sidebar-content>
          <div z-sidebar-group>
            <div z-sidebar-group-label>Platform</div>

            <div z-sidebar-group-content>
              <ul z-sidebar-menu>
                @for (item of navItems; track item.title) {
                  <li z-sidebar-menu-item z-collapsible class="group/collapsible" [zOpen]="item.defaultOpen">
                    <button z-collapsible-trigger z-sidebar-menu-button>
                      <span>{{ item.title }}</span>
                      <ng-icon
                        name="lucideChevronRight"
                        class="ml-auto transition-transform group-data-[state=open]/collapsible:rotate-90"
                      />
                    </button>

                    <z-collapsible-content>
                      <ul z-sidebar-menu-sub>
                        @for (child of item.items; track child) {
                          <li z-sidebar-menu-sub-item>
                            <a z-sidebar-menu-sub-button href="#">{{ child }}</a>
                          </li>
                        }
                      </ul>
                    </z-collapsible-content>
                  </li>
                }
              </ul>
            </div>
          </div>
        </z-sidebar-content>
      </z-sidebar>

      <main z-sidebar-inset class="p-4">
        <p class="text-muted-foreground text-sm">
          li[z-sidebar-menu-item] doubles as the collapsible root — the idiomatic translation of shadcn's asChild.
        </p>
      </main>
    </z-sidebar-provider>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  viewProviders: [provideIcons({ lucideChevronRight })],
})
export class ZardDemoSidebarMenuSubComponent {
  readonly navItems = [
    { title: 'Playground', defaultOpen: true, items: ['History', 'Starred', 'Settings'] },
    { title: 'Models', defaultOpen: false, items: ['Genesis', 'Explorer', 'Quantum'] },
    { title: 'Documentation', defaultOpen: false, items: ['Introduction', 'Get Started'] },
  ];
}
```

### Menu Badge

Use `[z-sidebar-menu-badge]` for counters.

```angular-ts
import { ChangeDetectionStrategy, Component } from '@angular/core';

import { ZardSidebarImports } from '@/shared/components/sidebar/sidebar.imports';

@Component({
  selector: 'z-demo-sidebar-menu-badge',
  imports: [ZardSidebarImports],
  template: `
    <z-sidebar-provider class="relative h-72 min-h-0 transform-gpu overflow-hidden rounded-xl border">
      <z-sidebar zCollapsible="none">
        <z-sidebar-content>
          <div z-sidebar-group>
            <div z-sidebar-group-label>Mail</div>

            <div z-sidebar-group-content>
              <ul z-sidebar-menu>
                @for (folder of folders; track folder.title) {
                  <li z-sidebar-menu-item>
                    <button z-sidebar-menu-button [zActive]="folder.title === 'Inbox'">{{ folder.title }}</button>
                    <div z-sidebar-menu-badge>{{ folder.count }}</div>
                  </li>
                }
              </ul>
            </div>
          </div>
        </z-sidebar-content>
      </z-sidebar>

      <main z-sidebar-inset class="p-4">
        <p class="text-muted-foreground text-sm">
          The badge is pointer-events-none and follows the button size through peer-data-[size=…]/menu-button.
        </p>
      </main>
    </z-sidebar-provider>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ZardDemoSidebarMenuBadgeComponent {
  readonly folders = [
    { title: 'Inbox', count: 24 },
    { title: 'Drafts', count: 3 },
    { title: 'Sent', count: 128 },
    { title: 'Spam', count: 9 },
  ];
}
```

### Menu Skeleton

Use `z-sidebar-menu-skeleton` while the menu is loading.

```angular-ts
import { ChangeDetectionStrategy, Component } from '@angular/core';

import { ZardSidebarImports } from '@/shared/components/sidebar/sidebar.imports';

@Component({
  selector: 'z-demo-sidebar-menu-skeleton',
  imports: [ZardSidebarImports],
  template: `
    <z-sidebar-provider class="relative h-72 min-h-0 transform-gpu overflow-hidden rounded-xl border">
      <z-sidebar zCollapsible="none">
        <z-sidebar-content>
          <div z-sidebar-group>
            <div z-sidebar-group-label>Loading projects</div>

            <div z-sidebar-group-content>
              <ul z-sidebar-menu>
                @for (row of rows; track row) {
                  <li z-sidebar-menu-item>
                    <z-sidebar-menu-skeleton zShowIcon />
                  </li>
                }
              </ul>
            </div>
          </div>
        </z-sidebar-content>
      </z-sidebar>

      <main z-sidebar-inset class="p-4">
        <p class="text-muted-foreground text-sm">
          Each row picks its own width. Unlike shadcn, the width is derived from the element id rather than
          Math.random(), so the server and the client agree during hydration.
        </p>
      </main>
    </z-sidebar-provider>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ZardDemoSidebarMenuSkeletonComponent {
  readonly rows = [1, 2, 3, 4, 5];
}
```

### Custom Trigger

Any element can toggle the sidebar — call `toggleSidebar()` on the injected service.

```angular-ts
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';

import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideChevronsLeft, lucideChevronsRight } from '@ng-icons/lucide';

import { ZardButtonComponent } from '@/shared/components/button/button.component';
import { ZardSidebarImports } from '@/shared/components/sidebar/sidebar.imports';
import { ZardSidebarService } from '@/shared/components/sidebar/sidebar.service';

@Component({
  selector: 'z-demo-sidebar-custom-trigger-button',
  imports: [ZardButtonComponent, NgIcon],
  template: `
    <button z-button zType="outline" zSize="sm" (click)="sidebar.toggleSidebar()">
      <ng-icon [name]="sidebar.open() ? 'lucideChevronsLeft' : 'lucideChevronsRight'" />
      {{ sidebar.open() ? 'Collapse' : 'Expand' }}
    </button>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  viewProviders: [provideIcons({ lucideChevronsLeft, lucideChevronsRight })],
})
export class ZardDemoSidebarCustomTriggerButtonComponent {
  protected readonly sidebar = inject(ZardSidebarService);
}

@Component({
  selector: 'z-demo-sidebar-custom-trigger',
  imports: [ZardSidebarImports, ZardDemoSidebarCustomTriggerButtonComponent],
  template: `
    <z-sidebar-provider
      zDefaultOpen="true"
      class="relative h-72 min-h-0 transform-gpu overflow-hidden rounded-xl border"
    >
      <z-sidebar zCollapsible="icon" class="h-full">
        <z-sidebar-content>
          <div z-sidebar-group>
            <div z-sidebar-group-content>
              <ul z-sidebar-menu>
                <li z-sidebar-menu-item>
                  <button z-sidebar-menu-button zTooltip="Library">Library</button>
                </li>
                <li z-sidebar-menu-item>
                  <button z-sidebar-menu-button zTooltip="Downloads">Downloads</button>
                </li>
              </ul>
            </div>
          </div>
        </z-sidebar-content>
      </z-sidebar>

      <main z-sidebar-inset class="flex flex-col items-start gap-4 p-4">
        <z-demo-sidebar-custom-trigger-button />

        <p class="text-muted-foreground text-sm">
          Any button can be a trigger — call toggleSidebar() on the injected service.
        </p>
      </main>
    </z-sidebar-provider>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ZardDemoSidebarCustomTriggerComponent {}
```

### Rail

Use `button[z-sidebar-rail]` for the draggable-looking edge handle.

```angular-ts
import { ChangeDetectionStrategy, Component } from '@angular/core';

import { ZardSidebarImports } from '@/shared/components/sidebar/sidebar.imports';

@Component({
  selector: 'z-demo-sidebar-rail',
  imports: [ZardSidebarImports],
  template: `
    <z-sidebar-provider
      zDefaultOpen="true"
      class="relative h-72 min-h-0 transform-gpu overflow-hidden rounded-xl border"
    >
      <z-sidebar class="h-full">
        <div z-sidebar-header class="font-medium">Drag the edge</div>

        <z-sidebar-content>
          <div z-sidebar-group>
            <div z-sidebar-group-content>
              <ul z-sidebar-menu>
                <li z-sidebar-menu-item>
                  <button z-sidebar-menu-button>Overview</button>
                </li>
                <li z-sidebar-menu-item>
                  <button z-sidebar-menu-button>Analytics</button>
                </li>
              </ul>
            </div>
          </div>
        </z-sidebar-content>

        <button z-sidebar-rail aria-label="Toggle Sidebar"></button>
      </z-sidebar>

      <main z-sidebar-inset class="p-4">
        <p class="text-muted-foreground text-sm">
          The rail is the 4px strip on the sidebar's edge. It shows a resize cursor and toggles the sidebar on click —
          it is tabindex="-1", so it never steals keyboard focus.
        </p>
      </main>
    </z-sidebar-provider>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ZardDemoSidebarRailComponent {}
```

### Controlled

Pass `zOpen` and listen to `zOpenChange` to own the state yourself.

```angular-ts
import { ChangeDetectionStrategy, Component, signal } from '@angular/core';

import { ZardSidebarImports } from '@/shared/components/sidebar/sidebar.imports';
import { ZardSwitchComponent } from '@/shared/components/switch/switch.component';

@Component({
  selector: 'z-demo-sidebar-controlled',
  imports: [ZardSidebarImports, ZardSwitchComponent],
  template: `
    <div class="flex w-full flex-col gap-4">
      <label class="flex items-center gap-2 text-sm">
        <z-switch [zChecked]="open()" (zCheckedChange)="open.set($event)" zId="sidebar-open" />
        Sidebar open
      </label>

      <z-sidebar-provider
        class="relative h-72 min-h-0 transform-gpu overflow-hidden rounded-xl border"
        [zOpen]="open()"
        (zOpenChange)="open.set($event)"
      >
        <z-sidebar zCollapsible="icon" class="h-full">
          <z-sidebar-content>
            <div z-sidebar-group>
              <div z-sidebar-group-content>
                <ul z-sidebar-menu>
                  <li z-sidebar-menu-item>
                    <button z-sidebar-menu-button zTooltip="Dashboard">Dashboard</button>
                  </li>
                  <li z-sidebar-menu-item>
                    <button z-sidebar-menu-button zTooltip="Team">Team</button>
                  </li>
                </ul>
              </div>
            </div>
          </z-sidebar-content>
        </z-sidebar>

        <main z-sidebar-inset class="flex flex-col gap-4 p-4">
          <button z-sidebar-trigger class="self-start" aria-label="Toggle Sidebar"></button>
          <p class="text-muted-foreground text-sm">
            The host owns the state: the trigger only reports through zOpenChange, and the switch stays in sync.
          </p>
        </main>
      </z-sidebar-provider>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ZardDemoSidebarControlledComponent {
  readonly open = signal(true);
}
```

### Theming

The sidebar has its own colour scale so it can sit on a different background than the page it frames.

```css
/* The sidebar has its own colour scale, separate from the rest of the app, so it can sit on a
   different background than the page it frames. Every token is already declared by zard/ui —
   override them to theme the sidebar on its own. */
:root {
  --sidebar: oklch(0.985 0 0);
  --sidebar-foreground: oklch(0.145 0 0);
  --sidebar-primary: oklch(0.205 0 0);
  --sidebar-primary-foreground: oklch(0.985 0 0);
  --sidebar-accent: oklch(0.97 0 0);
  --sidebar-accent-foreground: oklch(0.205 0 0);
  --sidebar-border: oklch(0.922 0 0);
  --sidebar-ring: oklch(0.708 0 0);
}

.dark {
  --sidebar: oklch(0.205 0 0);
  --sidebar-foreground: oklch(0.985 0 0);
  --sidebar-primary: oklch(0.488 0.243 264.376);
  --sidebar-primary-foreground: oklch(0.985 0 0);
  --sidebar-accent: oklch(0.269 0 0);
  --sidebar-accent-foreground: oklch(0.985 0 0);
  --sidebar-border: oklch(1 0 0 / 10%);
  --sidebar-ring: oklch(0.439 0 0);
}

/* The tokens are mapped in `@theme inline`, which is what turns them into the `bg-sidebar`,
   `text-sidebar-foreground`, `border-sidebar-border` and `ring-sidebar-ring` utilities. */
@theme inline {
  --color-sidebar: var(--sidebar);
  --color-sidebar-foreground: var(--sidebar-foreground);
  --color-sidebar-primary: var(--sidebar-primary);
  --color-sidebar-primary-foreground: var(--sidebar-primary-foreground);
  --color-sidebar-accent: var(--sidebar-accent);
  --color-sidebar-accent-foreground: var(--sidebar-accent-foreground);
  --color-sidebar-border: var(--sidebar-border);
  --color-sidebar-ring: var(--sidebar-ring);
}
```

### Styling

The sidebar publishes its state through data attributes, so anything inside it can react with plain Tailwind variants.

```angular-html
<!-- The sidebar publishes its state through data attributes, so anything inside it can react with
     plain Tailwind variants — no extra bindings needed. -->

<!-- 1. Hide an element once the sidebar has collapsed to icons.
        `group` lives on z-sidebar, together with data-collapsible. -->
<div z-sidebar-group class="group-data-[collapsible=icon]:hidden">
  <div z-sidebar-group-label>Projects</div>
</div>

<!-- 2. Style a sibling from the active state of its menu button.
        `peer/menu-button` lives on z-sidebar-menu-button, together with data-active. -->
<li z-sidebar-menu-item>
  <button z-sidebar-menu-button zActive>Inbox</button>
  <div z-sidebar-menu-badge class="opacity-50 peer-data-[active=true]/menu-button:opacity-100">24</div>
</li>
```

### Ssr Cookie

New in the Angular port: the open state is persisted in the `sidebar_state` cookie and read back on the server, so there is no layout flash on hydration.

```angular-ts
// New in the Angular port. ZardSidebarService persists the open state in the `sidebar_state`
// cookie and — this is the part shadcn has no equivalent for — reads it back on the server from
// the incoming request, so the first painted frame already has the right layout and there is no
// flash on hydration. This happens automatically; the code below is what runs inside the service.
import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import { inject, PLATFORM_ID, REQUEST } from '@angular/core';

const document = inject(DOCUMENT);
const request = inject(REQUEST, { optional: true });
const isBrowser = isPlatformBrowser(inject(PLATFORM_ID));

// On the client the cookie comes from `document.cookie`; on the server, from the Cookie header.
const cookies = isBrowser ? document.cookie : request?.headers?.get('cookie');
const match = /(?:^|;\s*)sidebar_state=(true|false)/.exec(cookies ?? '');
const persistedOpen = match ? match[1] === 'true' : undefined;

// `undefined` means "nothing persisted yet", so the provider falls back to open.
// An explicit zDefaultOpen wins over this either way — shadcn feeds the cookie in through it.
```

## API Reference

### z-sidebar-provider

Wraps the sidebar and the page, provides ZardSidebarService and registers the keyboard shortcut.

| Prop | Description | Type | Default |
| --- | --- | --- | --- |
| `[zDefaultOpen]` | Initial open state. Left unset, the persisted sidebar_state cookie decides, falling back to true; set explicitly, it wins over the cookie | `boolean \| undefined` | `undefined` |
| `[zOpen]` | When set, the provider is controlled: the state is owned by the consumer | `boolean \| undefined` | `undefined` |
| `[style]` | Extra inline style, applied after --sidebar-width and --sidebar-width-icon so it can override them | `string` | `''` |
| `[class]` | Additional CSS classes | `ClassValue` | `''` |
| `(zOpenChange)` | Emits whenever the open state is requested, including in controlled mode | `boolean` |  |

### z-sidebar

The sidebar itself. Renders as a fixed panel on desktop, as a drawer on mobile.

| Prop | Description | Type | Default |
| --- | --- | --- | --- |
| `[zSide]` | Which edge the sidebar docks to | `'left' \| 'right'` | `'left'` |
| `[zVariant]` | Visual treatment of the panel | `'sidebar' \| 'floating' \| 'inset'` | `'sidebar'` |
| `[zCollapsible]` | How the sidebar collapses. "none" renders a plain, always-visible column | `'offcanvas' \| 'icon' \| 'none'` | `'offcanvas'` |
| `[dir]` | Writing direction. Mirrors the rail and the trigger icon when set to rtl | `'ltr' \| 'rtl' \| undefined` | `undefined` |
| `[class]` | Additional CSS classes | `ClassValue` | `''` |

### button[z-sidebar-trigger]

Ghost icon button that toggles the sidebar. Renders the panel icon and an sr-only label.

| Prop | Description | Type | Default |
| --- | --- | --- | --- |
| `[class]` | Additional CSS classes | `ClassValue` | `''` |

### button[z-sidebar-rail]

The thin strip on the sidebar edge. Toggles the sidebar, shows a resize cursor and stays out of the tab order.

| Prop | Description | Type | Default |
| --- | --- | --- | --- |
| `[class]` | Additional CSS classes | `ClassValue` | `''` |

### z-sidebar-inset, main[z-sidebar-inset]

The page area next to the sidebar. Required when zVariant is "inset".

| Prop | Description | Type | Default |
| --- | --- | --- | --- |
| `[class]` | Additional CSS classes | `ClassValue` | `''` |

### input[z-sidebar-input]

Adds the sidebar treatment to a Zard input. Use as <input z-input z-sidebar-input />.

### z-sidebar-header, [z-sidebar-header]

Sticky region at the top of the sidebar.

| Prop | Description | Type | Default |
| --- | --- | --- | --- |
| `[class]` | Additional CSS classes | `ClassValue` | `''` |

### z-sidebar-footer, [z-sidebar-footer]

Sticky region at the bottom of the sidebar.

| Prop | Description | Type | Default |
| --- | --- | --- | --- |
| `[class]` | Additional CSS classes | `ClassValue` | `''` |

### z-sidebar-separator

A separator inset to the sidebar padding, painted with --sidebar-border.

| Prop | Description | Type | Default |
| --- | --- | --- | --- |
| `[class]` | Additional CSS classes | `ClassValue` | `''` |

### z-sidebar-content, [z-sidebar-content]

Scrollable area between the header and the footer.

| Prop | Description | Type | Default |
| --- | --- | --- | --- |
| `[class]` | Additional CSS classes | `ClassValue` | `''` |

### z-sidebar-group, [z-sidebar-group]

A section inside the content. Wrap it in z-collapsible to make it collapsible.

| Prop | Description | Type | Default |
| --- | --- | --- | --- |
| `[class]` | Additional CSS classes | `ClassValue` | `''` |

### z-sidebar-group-label, [z-sidebar-group-label]

The group heading. Fades out when the sidebar collapses to icons.

| Prop | Description | Type | Default |
| --- | --- | --- | --- |
| `[class]` | Additional CSS classes | `ClassValue` | `''` |

### button[z-sidebar-group-action]

Action button pinned to the top-right corner of a group.

| Prop | Description | Type | Default |
| --- | --- | --- | --- |
| `[class]` | Additional CSS classes | `ClassValue` | `''` |

### z-sidebar-group-content, [z-sidebar-group-content]

Content wrapper inside a group.

| Prop | Description | Type | Default |
| --- | --- | --- | --- |
| `[class]` | Additional CSS classes | `ClassValue` | `''` |

### ul[z-sidebar-menu]

The list that holds the menu items.

| Prop | Description | Type | Default |
| --- | --- | --- | --- |
| `[class]` | Additional CSS classes | `ClassValue` | `''` |

### li[z-sidebar-menu-item]

A single menu row. Carries group/menu-item, which the action and badge react to.

| Prop | Description | Type | Default |
| --- | --- | --- | --- |
| `[class]` | Additional CSS classes | `ClassValue` | `''` |

### button[z-sidebar-menu-button], a[z-sidebar-menu-button]

The clickable menu row. Use the anchor form with routerLink instead of shadcn's asChild. Carries peer/menu-button.

| Prop | Description | Type | Default |
| --- | --- | --- | --- |
| `[zType]` | Visual treatment | `'default' \| 'outline'` | `'default'` |
| `[zSize]` | Row height | `'default' \| 'sm' \| 'lg'` | `'default'` |
| `[zActive]` | Marks the row as the current one | `boolean` | `false` |
| `[zTooltip]` | Label shown as a tooltip, but only while the sidebar is collapsed on desktop. The object form overrides that rule: `{ content, hidden: false }` keeps the tooltip on an expanded sidebar | `string \| TemplateRef<void> \| { content: string \| TemplateRef<void>; hidden?: boolean } \| null` | `null` |
| `[class]` | Additional CSS classes | `ClassValue` | `''` |

### button[z-sidebar-menu-action], a[z-sidebar-menu-action]

Secondary action pinned to the right of a menu row.

| Prop | Description | Type | Default |
| --- | --- | --- | --- |
| `[zShowOnHover]` | Reveal the action only on hover or keyboard focus | `boolean` | `false` |
| `[class]` | Additional CSS classes | `ClassValue` | `''` |

### z-sidebar-menu-badge, [z-sidebar-menu-badge]

A counter pinned to the right of a menu row. Not interactive.

| Prop | Description | Type | Default |
| --- | --- | --- | --- |
| `[class]` | Additional CSS classes | `ClassValue` | `''` |

### z-sidebar-menu-skeleton

Placeholder row. The text width is derived from the element id rather than Math.random(), so the server and the client agree during hydration.

| Prop | Description | Type | Default |
| --- | --- | --- | --- |
| `[zShowIcon]` | Also render a square icon placeholder | `boolean` | `false` |
| `[class]` | Additional CSS classes | `ClassValue` | `''` |

### ul[z-sidebar-menu-sub]

Nested list under a menu item. Hidden when the sidebar collapses to icons.

| Prop | Description | Type | Default |
| --- | --- | --- | --- |
| `[class]` | Additional CSS classes | `ClassValue` | `''` |

### li[z-sidebar-menu-sub-item]

A row inside a submenu.

| Prop | Description | Type | Default |
| --- | --- | --- | --- |
| `[class]` | Additional CSS classes | `ClassValue` | `''` |

### a[z-sidebar-menu-sub-button], button[z-sidebar-menu-sub-button]

The clickable row inside a submenu.

| Prop | Description | Type | Default |
| --- | --- | --- | --- |
| `[zSize]` | Row text size | `'sm' \| 'md'` | `'md'` |
| `[zActive]` | Marks the row as the current one | `boolean` | `false` |
| `[class]` | Additional CSS classes | `ClassValue` | `''` |

### ZardSidebarService

Injectable service that controls the sidebar. Provided by z-sidebar-provider.

| Prop | Description | Type | Default |
| --- | --- | --- | --- |
| `state` | Current state of the sidebar | `Signal<'expanded' \| 'collapsed'>` |  |
| `open` | Whether the sidebar is open | `Signal<boolean>` |  |
| `setOpen` | Sets the open state of the sidebar | `(open: boolean \| ((open: boolean) => boolean)) => void` |  |
| `openMobile` | Whether the sidebar is open on mobile | `Signal<boolean>` |  |
| `setOpenMobile` | Sets the open state on mobile | `(open: boolean) => void` |  |
| `isMobile` | Whether the viewport is mobile | `Signal<boolean>` |  |
| `toggleSidebar` | Toggles the sidebar on desktop and mobile | `() => void` |  |

---

[Open in browser](https://zardui.com/docs/components/sidebar)
