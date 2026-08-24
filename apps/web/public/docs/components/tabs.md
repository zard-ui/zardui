---
title: Tabs
description: A set of layered sections of content—known as tab panels—that are displayed one at a time.
---

# Tabs

A set of layered sections of content—known as tab panels—that are displayed one at a time.

## Installation

### CLI

```bash
npx zard-cli@latest add tabs
```

### Manual

```angular-ts
import { NgTemplateOutlet } from '@angular/common';
import {
  booleanAttribute,
  ChangeDetectionStrategy,
  Component,
  computed,
  contentChildren,
  input,
  isDevMode,
  output,
  signal,
  type TemplateRef,
  viewChild,
  ViewEncapsulation,
} from '@angular/core';

import { NgIcon } from '@ng-icons/core';
import type { ClassValue } from 'clsx';

import {
  tabButtonVariants,
  tabContainerVariants,
  tabNavVariants,
  type ZardTabVariants,
} from '@/shared/components/tabs/tabs.variants';
import { mergeClasses } from '@/shared/utils/merge-classes';

@Component({
  selector: 'z-tab',
  template: `
    <ng-template #content>
      <ng-content />
    </ng-template>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: {
    'data-slot': 'tab',
  },
  exportAs: 'zTab',
})
export class ZardTabComponent {
  readonly label = input.required<string>();
  readonly zIcon = input<string | undefined>(undefined);
  readonly zDisabled = input(false, { transform: booleanAttribute });
  readonly contentTemplate = viewChild.required<TemplateRef<unknown>>('content');
}

@Component({
  selector: 'z-tab-group',
  imports: [NgTemplateOutlet, NgIcon],
  template: `
    <nav
      [class]="navClasses()"
      role="tablist"
      [attr.aria-orientation]="zOrientation()"
      [attr.data-variant]="zVariant()"
    >
      @for (tab of tabs(); track $index; let index = $index) {
        <button
          type="button"
          role="tab"
          [attr.id]="'tab-' + index"
          [attr.aria-selected]="activeTabIndex() === index"
          [attr.data-active]="activeTabIndex() === index ? '' : null"
          [attr.tabindex]="activeTabIndex() === index ? 0 : -1"
          [attr.aria-controls]="'tabpanel-' + index"
          [disabled]="zDisabled() || tab.zDisabled()"
          (click)="setActiveTab(index)"
          [class]="buttonClasses()"
        >
          @if (tab.zIcon()) {
            <ng-icon [name]="tab.zIcon()!" />
          }
          {{ tab.label() }}
        </button>
      }
    </nav>

    <div class="flex-1">
      @for (tab of tabs(); track $index; let index = $index) {
        <div
          role="tabpanel"
          [attr.id]="'tabpanel-' + index"
          [attr.aria-labelledby]="'tab-' + index"
          [attr.tabindex]="0"
          [hidden]="activeTabIndex() !== index"
          class="focus-visible:ring-primary/50 outline-none focus-visible:ring-2"
        >
          <ng-container [ngTemplateOutlet]="tab.contentTemplate()" />
        </div>
      }
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: {
    'data-slot': 'tab-group',
    '[class]': 'containerClasses()',
    '[attr.data-orientation]': 'zOrientation()',
  },
  exportAs: 'zTabGroup',
})
export class ZardTabGroupComponent {
  private readonly tabComponents = contentChildren(ZardTabComponent, { descendants: true });

  protected readonly tabs = computed(() => this.tabComponents());
  protected readonly activeTabIndex = signal<number>(0);

  protected readonly zTabChange = output<{
    index: number;
    label: string;
    tab: ZardTabComponent;
  }>();

  protected readonly zDeselect = output<{
    index: number;
    label: string;
    tab: ZardTabComponent;
  }>();

  readonly zVariant = input<ZardTabVariants['zVariant']>('default');
  readonly zOrientation = input<ZardTabVariants['zOrientation']>('horizontal');
  readonly zDisabled = input(false, { transform: booleanAttribute });
  readonly class = input<ClassValue>('');

  protected setActiveTab(index: number) {
    const currentTab = this.tabs()[this.activeTabIndex()];
    if (index !== this.activeTabIndex() && currentTab) {
      this.zDeselect.emit({
        index: this.activeTabIndex(),
        label: currentTab.label(),
        tab: currentTab,
      });
    }

    this.activeTabIndex.set(index);
    const activeTabComponent = this.tabs()[index];
    if (activeTabComponent) {
      this.zTabChange.emit({
        index,
        label: activeTabComponent.label(),
        tab: activeTabComponent,
      });
    }
  }

  protected readonly containerClasses = computed(() =>
    mergeClasses(tabContainerVariants({ zOrientation: this.zOrientation() }), this.class()),
  );

  protected readonly navClasses = computed(() => tabNavVariants({ zVariant: this.zVariant() }));

  protected readonly buttonClasses = computed(() => tabButtonVariants());

  selectTabByIndex(index: number): void {
    if (index >= 0 && index < this.tabs().length) {
      this.setActiveTab(index);
    } else {
      if (isDevMode()) {
        console.warn(`Index ${index} outside the range of available tabs.`);
      }
    }
  }
}
```

```angular-ts
import { cva, type VariantProps } from 'class-variance-authority';

export const tabContainerVariants = cva('group/tabs flex gap-2', {
  variants: {
    zOrientation: {
      horizontal: 'flex-col',
      vertical: 'flex-row',
    },
  },
  defaultVariants: {
    zOrientation: 'horizontal',
  },
});

export const tabNavVariants = cva(
  [
    'group/tabs-list inline-flex w-fit items-center justify-center rounded-lg p-[3px] text-muted-foreground',
    'group-data-[orientation=horizontal]/tabs:h-8 group-data-[orientation=vertical]/tabs:h-fit group-data-[orientation=vertical]/tabs:flex-col',
    'data-[variant=line]:rounded-none',
  ],
  {
    variants: {
      zVariant: {
        default: 'bg-muted',
        line: 'gap-1 bg-transparent',
      },
    },
    defaultVariants: {
      zVariant: 'default',
    },
  },
);

export const tabButtonVariants = cva([
  'relative inline-flex h-[calc(100%-1px)] flex-1 items-center justify-center gap-1.5',
  'rounded-md border border-transparent px-1.5 py-0.5 text-sm font-medium whitespace-nowrap',
  'text-foreground/60 transition-all cursor-pointer',
  'group-data-[orientation=vertical]/tabs:w-full group-data-[orientation=vertical]/tabs:justify-start',
  'hover:text-foreground',
  'focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:outline-1 focus-visible:outline-ring',
  'disabled:pointer-events-none disabled:opacity-50',
  "[&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  'dark:text-muted-foreground dark:hover:text-foreground',
  'group-data-[variant=default]/tabs-list:data-active:shadow-sm group-data-[variant=line]/tabs-list:data-active:shadow-none',
  'group-data-[variant=line]/tabs-list:bg-transparent group-data-[variant=line]/tabs-list:data-active:bg-transparent',
  'dark:group-data-[variant=line]/tabs-list:data-active:border-transparent dark:group-data-[variant=line]/tabs-list:data-active:bg-transparent',
  'data-active:bg-background data-active:text-foreground',
  'dark:data-active:border-input dark:data-active:bg-input/30 dark:data-active:text-foreground',
  'after:absolute after:bg-foreground after:opacity-0 after:transition-opacity',
  'group-data-[orientation=horizontal]/tabs:after:inset-x-0 group-data-[orientation=horizontal]/tabs:after:bottom-[-5px] group-data-[orientation=horizontal]/tabs:after:h-0.5',
  'group-data-[orientation=vertical]/tabs:after:inset-y-0 group-data-[orientation=vertical]/tabs:after:-right-1 group-data-[orientation=vertical]/tabs:after:w-0.5',
  'group-data-[variant=line]/tabs-list:data-active:after:opacity-100',
]);

export type ZardTabVariants = VariantProps<typeof tabContainerVariants> & VariantProps<typeof tabNavVariants>;
```

```angular-ts
export * from './tabs.component';
export * from './tabs.imports';
export * from './tabs.variants';
```

```angular-ts
/*
 * The alias, not a relative path: the Angular compiler re-emits these imports from
 * whichever module spreads the array, and it can only do that for a specifier the
 * consumer can resolve too. A relative path here fails with NG3004.
 */
import { ZardTabComponent, ZardTabGroupComponent } from '@/shared/components/tabs/tabs.component';

/** Every part of the tabs component, for a template that uses more than one. */
export const ZardTabsImports = [ZardTabGroupComponent, ZardTabComponent] as const;
```

## Usage

```angular-ts
import { ZardTabComponent } from '@/shared/components/tabs/tab.component';
import { ZardTabGroupComponent } from '@/shared/components/tabs/tabs.component';
```

```angular-html
<z-tab-group>
  <z-tab label="Account">Account content here.</z-tab>
  <z-tab label="Password">Password content here.</z-tab>
</z-tab-group>
```

## Examples

### Line

Use the `zVariant="line"` prop on `z-tab-group` for a line style.

```angular-ts
import { ChangeDetectionStrategy, Component } from '@angular/core';

import { ZardTabComponent, ZardTabGroupComponent } from '../tabs.component';

@Component({
  selector: 'z-demo-tabs-line',
  imports: [ZardTabComponent, ZardTabGroupComponent],
  template: `
    <z-tab-group zVariant="line">
      <z-tab label="Overview" />
      <z-tab label="Analytics" />
      <z-tab label="Reports" />
    </z-tab-group>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ZardDemoTabsLineComponent {}
```

### Vertical

Use `zOrientation="vertical"` for vertical tabs.

```angular-ts
import { ChangeDetectionStrategy, Component } from '@angular/core';

import { ZardTabComponent, ZardTabGroupComponent } from '../tabs.component';

@Component({
  selector: 'z-demo-tabs-vertical',
  imports: [ZardTabComponent, ZardTabGroupComponent],
  template: `
    <div class="flex w-full max-w-md flex-col gap-6">
      <z-tab-group zOrientation="vertical">
        <z-tab label="Account" />
        <z-tab label="Password" />
        <z-tab label="Notifications" />
      </z-tab-group>

      <z-tab-group zOrientation="vertical" zVariant="line">
        <z-tab label="Account" />
        <z-tab label="Password" />
        <z-tab label="Notifications" />
      </z-tab-group>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ZardDemoTabsVerticalComponent {}
```

### Disabled

```angular-ts
import { ChangeDetectionStrategy, Component } from '@angular/core';

import { ZardTabComponent, ZardTabGroupComponent } from '../tabs.component';

@Component({
  selector: 'z-demo-tabs-disabled',
  imports: [ZardTabComponent, ZardTabGroupComponent],
  template: `
    <div class="w-full max-w-md">
      <z-tab-group>
        <z-tab label="Home" />
        <z-tab label="Disabled" zDisabled />
      </z-tab-group>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ZardDemoTabsDisabledComponent {}
```

### Icons

```angular-ts
import { ChangeDetectionStrategy, Component } from '@angular/core';

import { provideIcons } from '@ng-icons/core';
import { lucideAppWindow, lucideCode } from '@ng-icons/lucide';

import { ZardTabComponent, ZardTabGroupComponent } from '../tabs.component';

@Component({
  selector: 'z-demo-tabs-icons',
  imports: [ZardTabComponent, ZardTabGroupComponent],
  template: `
    <div class="w-full max-w-md">
      <z-tab-group>
        <z-tab label="Preview" zIcon="lucideAppWindow" />
        <z-tab label="Code" zIcon="lucideCode" />
      </z-tab-group>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  viewProviders: [provideIcons({ lucideAppWindow, lucideCode })],
})
export class ZardDemoTabsIconsComponent {}
```

## API Reference

### z-tab-group

A set of layered sections of content — known as tab panels — displayed one at a time.

| Prop | Description | Type | Default |
| --- | --- | --- | --- |
| `[class]` | Custom CSS classes | `ClassValue` | `''` |
| `[zVariant]` | Visual variant of the tab navigation | `'default' \| 'line'` | `'default'` |
| `[zOrientation]` | Layout direction of the tab group | `'horizontal' \| 'vertical'` | `'horizontal'` |
| `[zDisabled]` | Whether the entire tab group is disabled | `boolean` | `false` |
| `(zTabChange)` | Emits when a new tab is selected | `$event` | `-` |
| `(zDeselect)` | Emits when the current tab is deselected | `$event` | `-` |

### z-tab

An individual tab. Label is shown in the navigation; projected content becomes the tab panel.

| Prop | Description | Type | Default |
| --- | --- | --- | --- |
| `[label]` | Label displayed in the tab button | `string` | `-` |
| `[zIcon]` | Optional ng-icons name shown before the label | `string` | `-` |
| `[zDisabled]` | Whether this individual tab is disabled | `boolean` | `false` |

---

[Open in browser](https://zardui.com/docs/components/tabs)
