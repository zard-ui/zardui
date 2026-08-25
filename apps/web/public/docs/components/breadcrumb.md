---
title: Breadcrumb
description: Displays the path to the current resource using a hierarchy of links.
---

# Breadcrumb

Displays the path to the current resource using a hierarchy of links.

## Installation

### CLI

```bash
npx zard-cli@latest add breadcrumb
```

### Manual

```angular-ts
import { LocationStrategy } from '@angular/common';
import {
  booleanAttribute,
  ChangeDetectionStrategy,
  Component,
  computed,
  contentChild,
  contentChildren,
  ElementRef,
  inject,
  input,
  TemplateRef,
  ViewEncapsulation,
} from '@angular/core';
import {
  ActivatedRoute,
  type NavigationBehaviorOptions,
  type Params,
  type QueryParamsHandling,
  Router,
  UrlTree,
} from '@angular/router';

import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideChevronRight, lucideEllipsis } from '@ng-icons/lucide';
import type { ClassValue } from 'clsx';

import {
  breadcrumbEllipsisVariants,
  breadcrumbItemVariants,
  breadcrumbLinkVariants,
  breadcrumbListVariants,
  breadcrumbPageVariants,
  breadcrumbSeparatorVariants,
  breadcrumbVariants,
  type ZardBreadcrumbAlignVariants,
  type ZardBreadcrumbEllipsisColorVariants,
  type ZardBreadcrumbSizeVariants,
  type ZardBreadcrumbWrapVariants,
} from '@/shared/components/breadcrumb/breadcrumb.variants';
import { ZardStringTemplateOutletDirective } from '@/shared/core/directives/string-template-outlet/string-template-outlet.directive';
import { mergeClasses } from '@/shared/utils/merge-classes';

type BreadcrumbRouterLink = string | readonly unknown[] | UrlTree | null | undefined;

@Component({
  selector: 'z-breadcrumb-ellipsis, [z-breadcrumb-ellipsis]',
  imports: [NgIcon],
  template: `
    <ng-icon name="lucideEllipsis" class="size-4!" aria-hidden="true" />
    @if (zLabel()) {
      <span class="sr-only">{{ zLabel() }}</span>
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  viewProviders: [provideIcons({ lucideEllipsis })],
  host: {
    'data-slot': 'breadcrumb-ellipsis',
    '[class]': 'classes()',
  },
  exportAs: 'zBreadcrumbEllipsis',
})
export class ZardBreadcrumbEllipsisComponent {
  readonly zColor = input<ZardBreadcrumbEllipsisColorVariants>('muted');
  readonly zLabel = input('More breadcrumbs');

  readonly class = input<ClassValue>('');
  protected readonly classes = computed(() =>
    mergeClasses(breadcrumbEllipsisVariants({ zColor: this.zColor() }), this.class()),
  );
}

@Component({
  selector: 'z-breadcrumb-page, [z-breadcrumb-page]',
  template: '<ng-content />',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: {
    'data-slot': 'breadcrumb-page',
    'aria-current': 'page',
    '[class]': 'classes()',
  },
  exportAs: 'zBreadcrumbPage',
})
export class ZardBreadcrumbPageComponent {
  readonly class = input<ClassValue>('');

  protected readonly classes = computed(() => mergeClasses(breadcrumbPageVariants(), this.class()));
}

@Component({
  selector: 'z-breadcrumb-link, [z-breadcrumb-link]',
  template: '<ng-content />',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: {
    'data-slot': 'breadcrumb-link',
    '[attr.role]': 'role()',
    '[attr.tabindex]': 'tabIndex()',
    '[attr.href]': 'resolvedHref()',
    '[class]': 'classes()',
    '(click)': 'navigate($event)',
    '(keydown)': 'activateFromKeyboard($event)',
  },
  exportAs: 'zBreadcrumbLink',
})
export class ZardBreadcrumbLinkComponent {
  private readonly elementRef = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly router = inject(Router, { optional: true });
  private readonly activatedRoute = inject(ActivatedRoute, { optional: true });
  private readonly locationStrategy = inject(LocationStrategy, { optional: true });

  readonly routerLink = input<BreadcrumbRouterLink>(null);
  readonly queryParams = input<Params | null | undefined>();
  readonly fragment = input<string | undefined>();
  readonly queryParamsHandling = input<QueryParamsHandling | null | undefined>();
  readonly state = input<NavigationBehaviorOptions['state']>();
  readonly info = input<NavigationBehaviorOptions['info']>();
  readonly relativeTo = input<ActivatedRoute | null | undefined>();
  readonly preserveFragment = input(false, { transform: booleanAttribute });
  readonly skipLocationChange = input(false, { transform: booleanAttribute });
  readonly replaceUrl = input(false, { transform: booleanAttribute });
  readonly linkHref = input<string | null | undefined>(undefined, { alias: 'href' });

  readonly class = input<ClassValue>('');

  private readonly urlTree = computed(() => {
    const commands = this.routerLink();

    if (!this.router || commands === null || commands === undefined) {
      return null;
    }

    if (commands instanceof UrlTree) {
      return commands;
    }

    return this.router.createUrlTree(Array.isArray(commands) ? commands : [commands], {
      relativeTo: this.relativeTo() === undefined ? this.activatedRoute : this.relativeTo(),
      queryParams: this.queryParams(),
      fragment: this.fragment(),
      queryParamsHandling: this.queryParamsHandling(),
      preserveFragment: this.preserveFragment(),
    });
  });

  protected readonly resolvedHref = computed(() => {
    if (this.isButtonElement()) {
      return null;
    }

    const urlTree = this.urlTree();

    if (!urlTree || !this.router) {
      return this.linkHref();
    }

    const href = this.router.serializeUrl(urlTree);

    return this.locationStrategy ? this.locationStrategy.prepareExternalUrl(href) : href;
  });

  protected readonly role = computed(() => (this.isNativeInteractiveElement() ? null : 'link'));
  protected readonly tabIndex = computed(() =>
    this.isNativeInteractiveElement() || !this.hasNavigationTarget() ? null : 0,
  );

  protected readonly classes = computed(() => mergeClasses(breadcrumbLinkVariants(), this.class()));

  protected navigate(event: MouseEvent): boolean {
    const urlTree = this.urlTree();

    if (this.shouldIgnoreMouseEvent(event)) {
      return true;
    }

    if (this.router && urlTree) {
      event.preventDefault();
      this.navigateToUrlTree(urlTree);

      return false;
    }

    const href = this.linkHref();

    if (href && !this.isNativeInteractiveElement()) {
      event.preventDefault();
      this.navigateToHref(href);

      return false;
    }

    return true;
  }

  protected activateFromKeyboard(event: KeyboardEvent): boolean {
    if (this.isNativeInteractiveElement() || event.key !== 'Enter' || !this.hasNavigationTarget()) {
      return true;
    }

    event.preventDefault();

    const urlTree = this.urlTree();

    if (this.router && urlTree) {
      this.navigateToUrlTree(urlTree);

      return false;
    }

    const href = this.linkHref();

    if (href) {
      this.navigateToHref(href);

      return false;
    }

    return true;
  }

  private navigateToUrlTree(urlTree: UrlTree): void {
    if (!this.router) {
      return;
    }

    void this.router.navigateByUrl(urlTree, {
      skipLocationChange: this.skipLocationChange(),
      replaceUrl: this.replaceUrl(),
      state: this.state(),
      info: this.info(),
    });
  }

  private navigateToHref(href: string): void {
    this.elementRef.nativeElement.ownerDocument.defaultView?.location.assign(href);
  }

  private shouldIgnoreMouseEvent(event: MouseEvent): boolean {
    if (
      event.defaultPrevented ||
      event.button !== 0 ||
      event.ctrlKey ||
      event.shiftKey ||
      event.altKey ||
      event.metaKey
    ) {
      return true;
    }

    const target = (event.currentTarget as HTMLElement | null)?.getAttribute('target');

    return Boolean(target && target !== '_self');
  }

  private hasNavigationTarget(): boolean {
    return this.urlTree() !== null || Boolean(this.linkHref());
  }

  private isNativeInteractiveElement(): boolean {
    return this.isAnchorElement() || this.isButtonElement();
  }

  private isAnchorElement(): boolean {
    return this.elementRef.nativeElement.tagName.toLowerCase() === 'a';
  }

  private isButtonElement(): boolean {
    return this.elementRef.nativeElement.tagName.toLowerCase() === 'button';
  }
}

@Component({
  selector: 'z-breadcrumb-separator, [z-breadcrumb-separator]',
  imports: [NgIcon],
  template: `
    <ng-content>
      <ng-icon name="lucideChevronRight" />
    </ng-content>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  viewProviders: [provideIcons({ lucideChevronRight })],
  host: {
    'data-slot': 'breadcrumb-separator',
    '[class]': 'classes()',
    'aria-hidden': 'true',
    role: 'presentation',
  },
  exportAs: 'zBreadcrumbSeparator',
})
export class ZardBreadcrumbSeparatorComponent {
  readonly class = input<ClassValue>('');

  protected readonly classes = computed(() => mergeClasses(breadcrumbSeparatorVariants(), this.class()));
}

@Component({
  selector: 'z-breadcrumb-item, [z-breadcrumb-item]',
  imports: [
    ZardStringTemplateOutletDirective,
    NgIcon,
    ZardBreadcrumbLinkComponent,
    ZardBreadcrumbPageComponent,
    ZardBreadcrumbSeparatorComponent,
  ],
  template: `
    <ng-template #itemContent><ng-content /></ng-template>

    @if (hasComposedContent()) {
      <ng-container *zStringTemplateOutlet="itemContent" />
    } @else if (isLast()) {
      <span z-breadcrumb-page>
        <ng-container *zStringTemplateOutlet="itemContent" />
      </span>
    } @else {
      <a
        z-breadcrumb-link
        class="flex items-center gap-1.5"
        [routerLink]="routerLink()"
        [queryParams]="queryParams()"
        [fragment]="fragment()"
        [queryParamsHandling]="queryParamsHandling()"
        [state]="state()"
        [info]="info()"
        [relativeTo]="relativeTo()"
        [preserveFragment]="preserveFragment()"
        [skipLocationChange]="skipLocationChange()"
        [replaceUrl]="replaceUrl()"
      >
        <ng-container *zStringTemplateOutlet="itemContent" />
      </a>
    }

    @if (shouldRenderSeparator()) {
      <span z-breadcrumb-separator>
        @if (isTemplate(separator())) {
          <ng-container *zStringTemplateOutlet="separator()" />
        } @else if (separator()) {
          {{ separator() }}
        } @else {
          <ng-icon name="lucideChevronRight" />
        }
      </span>
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  viewProviders: [provideIcons({ lucideChevronRight })],
  host: {
    'data-slot': 'breadcrumb-item',
    role: 'listitem',
    '[class]': 'classes()',
  },
  exportAs: 'zBreadcrumbItem',
})
export class ZardBreadcrumbItemComponent {
  private readonly breadcrumbComponent = inject(ZardBreadcrumbComponent);

  private readonly ellipsis = contentChild(ZardBreadcrumbEllipsisComponent);
  private readonly link = contentChild(ZardBreadcrumbLinkComponent);
  private readonly page = contentChild(ZardBreadcrumbPageComponent);
  readonly routerLink = input<BreadcrumbRouterLink>([]);
  readonly queryParams = input<Params | null | undefined>();
  readonly fragment = input<string | undefined>();
  readonly queryParamsHandling = input<QueryParamsHandling | null | undefined>();
  readonly state = input<NavigationBehaviorOptions['state']>();
  readonly info = input<NavigationBehaviorOptions['info']>();
  readonly relativeTo = input<ActivatedRoute | null | undefined>();
  readonly preserveFragment = input(false, { transform: booleanAttribute });
  readonly skipLocationChange = input(false, { transform: booleanAttribute });
  readonly replaceUrl = input(false, { transform: booleanAttribute });

  readonly class = input<ClassValue>('');

  protected readonly separator = computed(() => this.breadcrumbComponent.zSeparator());
  protected readonly isLast = computed<boolean>(() => this === this.breadcrumbComponent.items().at(-1));
  protected readonly hasComposedContent = computed<boolean>(
    () => this.ellipsis() !== undefined || this.link() !== undefined || this.page() !== undefined,
  );

  protected readonly shouldRenderSeparator = computed<boolean>(
    () => !this.isLast() && !this.breadcrumbComponent.hasManualSeparators(),
  );

  protected readonly classes = computed(() => mergeClasses(breadcrumbItemVariants(), this.class()));

  protected isTemplate(value: string | TemplateRef<void>): value is TemplateRef<void> {
    return value instanceof TemplateRef;
  }
}

@Component({
  selector: 'z-breadcrumb, [z-breadcrumb]',
  template: `
    <nav [attr.aria-label]="zLabel()" [class]="navClasses()">
      <ol [class]="listClasses()">
        <ng-content />
      </ol>
    </nav>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  exportAs: 'zBreadcrumb',
})
export class ZardBreadcrumbComponent {
  readonly zLabel = input('breadcrumb');
  readonly zSize = input<ZardBreadcrumbSizeVariants>('md');
  readonly zAlign = input<ZardBreadcrumbAlignVariants>('start');
  readonly zWrap = input<ZardBreadcrumbWrapVariants>('wrap');
  readonly zSeparator = input<string | TemplateRef<void>>('');

  readonly class = input<ClassValue>('');

  readonly items = contentChildren(ZardBreadcrumbItemComponent);
  readonly separators = contentChildren(ZardBreadcrumbSeparatorComponent);

  readonly hasManualSeparators = computed(() => this.separators().length > 0);

  protected readonly navClasses = computed(() =>
    mergeClasses(breadcrumbVariants({ zSize: this.zSize() }), this.class()),
  );

  protected readonly listClasses = computed(() =>
    breadcrumbListVariants({ zAlign: this.zAlign(), zWrap: this.zWrap() }),
  );
}
```

```angular-ts
import { cva, type VariantProps } from 'class-variance-authority';

export const breadcrumbVariants = cva('w-full', {
  variants: {
    zSize: {
      sm: 'text-xs',
      md: 'text-sm',
      lg: 'text-base',
    },
  },
  defaultVariants: {
    zSize: 'md',
  },
});
export type ZardBreadcrumbSizeVariants = NonNullable<VariantProps<typeof breadcrumbVariants>['zSize']>;

export const breadcrumbListVariants = cva(
  'text-muted-foreground flex flex-wrap items-center gap-1.5 wrap-break-word sm:gap-2.5',
  {
    variants: {
      zAlign: {
        start: 'justify-start',
        center: 'justify-center',
        end: 'justify-end',
      },
      zWrap: {
        wrap: 'flex-wrap',
        nowrap: 'flex-nowrap',
      },
    },
    defaultVariants: {
      zAlign: 'start',
      zWrap: 'wrap',
    },
  },
);
export type ZardBreadcrumbAlignVariants = NonNullable<VariantProps<typeof breadcrumbListVariants>['zAlign']>;
export type ZardBreadcrumbWrapVariants = NonNullable<VariantProps<typeof breadcrumbListVariants>['zWrap']>;

export const breadcrumbItemVariants = cva('inline-flex items-center gap-1.5');
export type ZardBreadcrumbItemVariants = VariantProps<typeof breadcrumbItemVariants>;

export const breadcrumbLinkVariants = cva('transition-colors hover:text-foreground');
export type ZardBreadcrumbLinkVariants = VariantProps<typeof breadcrumbLinkVariants>;

export const breadcrumbPageVariants = cva('font-normal text-foreground');
export type ZardBreadcrumbPageVariants = VariantProps<typeof breadcrumbPageVariants>;

export const breadcrumbSeparatorVariants = cva(
  'text-muted-foreground [&_svg]:size-3.5 [&_ng-icon]:flex! [&_ng-icon]:items-center! [&_ng-icon]:size-3.5!',
);
export type ZardBreadcrumbSeparatorVariants = VariantProps<typeof breadcrumbSeparatorVariants>;

export const breadcrumbEllipsisVariants = cva('flex size-9 items-center justify-center', {
  variants: {
    zColor: {
      muted: 'text-muted-foreground',
      strong: 'text-foreground',
    },
  },
  defaultVariants: {
    zColor: 'muted',
  },
});
export type ZardBreadcrumbEllipsisColorVariants = NonNullable<
  VariantProps<typeof breadcrumbEllipsisVariants>['zColor']
>;
```

```angular-ts
import {
  ZardBreadcrumbComponent,
  ZardBreadcrumbEllipsisComponent,
  ZardBreadcrumbItemComponent,
  ZardBreadcrumbLinkComponent,
  ZardBreadcrumbPageComponent,
  ZardBreadcrumbSeparatorComponent,
} from '@/shared/components/breadcrumb/breadcrumb.component';

export const ZardBreadcrumbImports = [
  ZardBreadcrumbComponent,
  ZardBreadcrumbItemComponent,
  ZardBreadcrumbLinkComponent,
  ZardBreadcrumbPageComponent,
  ZardBreadcrumbSeparatorComponent,
  ZardBreadcrumbEllipsisComponent,
] as const;
```

```angular-ts
export * from './breadcrumb.component';
export * from './breadcrumb.variants';
```

## Usage

```angular-ts
import { ZardBreadcrumbImports } from '@/shared/components/breadcrumb/breadcrumb.imports';
```

```angular-html
<z-breadcrumb>
  <z-breadcrumb-item>
    <a z-breadcrumb-link routerLink="/">Home</a>
  </z-breadcrumb-item>
  <z-breadcrumb-item>
    <a z-breadcrumb-link routerLink="/docs/components">Components</a>
  </z-breadcrumb-item>
  <z-breadcrumb-item>
    <span z-breadcrumb-page>Breadcrumb</span>
  </z-breadcrumb-item>
</z-breadcrumb>
```

## Examples

### Default

```angular-ts
import { ChangeDetectionStrategy, Component } from '@angular/core';

import { ZardBreadcrumbImports } from '../breadcrumb.imports';

@Component({
  selector: 'z-demo-breadcrumb-default',
  imports: [ZardBreadcrumbImports],
  template: `
    <z-breadcrumb zLabel="Default breadcrumb">
      <z-breadcrumb-item>
        <a z-breadcrumb-link [routerLink]="['/']">Home</a>
      </z-breadcrumb-item>
      <z-breadcrumb-item>
        <a z-breadcrumb-link [routerLink]="['/docs/components']">Components</a>
      </z-breadcrumb-item>
      <z-breadcrumb-item>
        <span z-breadcrumb-page>Breadcrumb</span>
      </z-breadcrumb-item>
    </z-breadcrumb>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ZardDemoBreadcrumbDefaultComponent {}
```

### Separator

```angular-ts
import { ChangeDetectionStrategy, Component } from '@angular/core';

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
  changeDetection: ChangeDetectionStrategy.OnPush,
  viewProviders: [provideIcons({ lucideDot })],
})
export class ZardDemoBreadcrumbSeparatorComponent {}
```

### Dropdown

```angular-ts
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
```

### Ellipsis

```angular-ts
import { ChangeDetectionStrategy, Component } from '@angular/core';

import { ZardBreadcrumbImports } from '@/shared/components/breadcrumb/breadcrumb.imports';

@Component({
  selector: 'z-demo-breadcrumb-ellipsis',
  imports: [ZardBreadcrumbImports],
  template: `
    <z-breadcrumb zLabel="Collapsed breadcrumb">
      <z-breadcrumb-item>
        <a z-breadcrumb-link [routerLink]="['/']">Home</a>
      </z-breadcrumb-item>
      <z-breadcrumb-item>
        <z-breadcrumb-ellipsis />
      </z-breadcrumb-item>
      <z-breadcrumb-item>
        <a z-breadcrumb-link [routerLink]="['/docs/components']">Components</a>
      </z-breadcrumb-item>
      <z-breadcrumb-item>
        <span z-breadcrumb-page>Breadcrumb</span>
      </z-breadcrumb-item>
    </z-breadcrumb>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ZardDemoBreadcrumbEllipsisComponent {}
```

### Link

```angular-ts
import { ChangeDetectionStrategy, Component } from '@angular/core';

import { ZardBreadcrumbImports } from '@/shared/components/breadcrumb/breadcrumb.imports';

@Component({
  selector: 'z-demo-breadcrumb-link',
  imports: [ZardBreadcrumbImports],
  template: `
    <z-breadcrumb zLabel="Router breadcrumb">
      <z-breadcrumb-item>
        <a z-breadcrumb-link routerLink="/">Home</a>
      </z-breadcrumb-item>
      <z-breadcrumb-item>
        <a z-breadcrumb-link routerLink="/docs/components">Components</a>
      </z-breadcrumb-item>
      <z-breadcrumb-item>
        <span z-breadcrumb-page>Breadcrumb</span>
      </z-breadcrumb-item>
    </z-breadcrumb>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ZardDemoBreadcrumbLinkComponent {}
```

## API Reference

### z-breadcrumb

Displays the path to the current resource using a hierarchy of links. Separators render automatically unless explicit separators are projected.

| Prop | Description | Type | Default |
| --- | --- | --- | --- |
| `[class]` | Custom CSS classes | `string` | `''` |
| `[zLabel]` | Accessible label for the breadcrumb navigation | `string` | `'breadcrumb'` |
| `[zSize]` | Breadcrumb size | `'sm' \| 'md' \| 'lg'` | `'md'` |
| `[zAlign]` | Horizontal alignment | `'start' \| 'center' \| 'end'` | `'start'` |
| `[zWrap]` | Wrapping behavior | `'wrap' \| 'nowrap'` | `'wrap'` |
| `[zSeparator]` | Custom separator for auto-rendered item separators | `string \| TemplateRef<void>` | `''` |

### z-breadcrumb-item, [z-breadcrumb-item]

An individual breadcrumb item. When no composed primitive is projected, it renders a link for non-current items and a page for the current item.

| Prop | Description | Type | Default |
| --- | --- | --- | --- |
| `[class]` | Custom CSS classes | `string` | `''` |
| `[routerLink]` | Router-compatible inputs are forwarded to the generated breadcrumb link | `string \| any[]` | `-` |

### z-breadcrumb-link, [z-breadcrumb-link]

A clickable breadcrumb link. Supports Router-compatible inputs and plain href links; prefer native anchors or buttons when composing interactive controls.

| Prop | Description | Type | Default |
| --- | --- | --- | --- |
| `[class]` | Custom CSS classes | `string` | `''` |
| `[routerLink]` | Router-compatible inputs used to build the link URL and navigate on click | `string \| any[]` | `-` |
| `[href]` | Plain link URL when routerLink is not provided | `string` | `-` |

### z-breadcrumb-page, [z-breadcrumb-page]

The current page in the breadcrumb trail. Renders non-clickable content with aria-current="page".

| Prop | Description | Type | Default |
| --- | --- | --- | --- |
| `[class]` | Custom CSS classes | `string` | `''` |

### z-breadcrumb-separator, [z-breadcrumb-separator]

A decorative separator between breadcrumb items. Project custom content to override the default chevron.

| Prop | Description | Type | Default |
| --- | --- | --- | --- |
| `[class]` | Custom CSS classes | `string` | `''` |

### z-breadcrumb-ellipsis, [z-breadcrumb-ellipsis]

An ellipsis element for truncating long breadcrumb trails.

| Prop | Description | Type | Default |
| --- | --- | --- | --- |
| `[class]` | Custom CSS classes | `string` | `''` |
| `[zColor]` | Ellipsis color | `'muted' \| 'strong'` | `'muted'` |
| `[zLabel]` | Screen-reader label for the collapsed breadcrumb control | `string` | `'More breadcrumbs'` |

---

[Open in browser](https://zardui.com/docs/components/breadcrumb)
