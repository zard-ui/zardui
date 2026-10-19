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
import { Directionality } from '@angular/cdk/bidi';
import { NgTemplateOutlet } from '@angular/common';
import {
  booleanAttribute,
  ChangeDetectionStrategy,
  Component,
  computed,
  contentChildren,
  inject,
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
import { ZardIdDirective } from '@/shared/core';
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
          [attr.id]="tabId(index)"
          [attr.aria-selected]="activeTabIndex() === index"
          [attr.data-active]="activeTabIndex() === index ? '' : null"
          [attr.tabindex]="activeTabIndex() === index ? 0 : -1"
          [attr.aria-controls]="panelId(index)"
          [disabled]="zDisabled() || tab.zDisabled()"
          (click)="setActiveTab(index)"
          (keydown)="onKeydown($event)"
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
          [attr.id]="panelId(index)"
          [attr.aria-labelledby]="tabId(index)"
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
  hostDirectives: [ZardIdDirective],
  exportAs: 'zTabGroup',
})
export class ZardTabGroupComponent {
  /** Scopes the tab and panel ids, which repeat for every group on the page when built from the index alone. */
  private readonly uniqueId = inject(ZardIdDirective);

  private readonly directionality = inject(Directionality, { optional: true });

  private readonly tabComponents = contentChildren(ZardTabComponent, { descendants: true });

  protected readonly tabs = computed(() => this.tabComponents());
  protected readonly activeTabIndex = signal<number>(0);

  protected tabId(index: number): string {
    return `${this.uniqueId.id()}-tab-${index}`;
  }

  protected panelId(index: number): string {
    return `${this.uniqueId.id()}-tabpanel-${index}`;
  }

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

  /**
   * Roving arrow-key navigation. In a horizontal list the keys follow the visual order, so ArrowRight moves to the
   * previous tab in RTL. Moving focus also activates the tab (automatic activation).
   */
  protected onKeydown(event: KeyboardEvent): void {
    const target = this.nextTabIndex(event.key);
    if (target === undefined) {
      return;
    }

    event.preventDefault();
    this.setActiveTab(target);
    const buttons =
      (event.currentTarget as HTMLElement).parentElement?.querySelectorAll<HTMLButtonElement>(':scope > button') ?? [];
    buttons[target]?.focus();
  }

  private nextTabIndex(key: string): number | undefined {
    const tabs = this.tabs();
    if (this.zDisabled()) {
      return undefined;
    }
    const enabled = tabs.map((_, index) => index).filter(index => !tabs[index].zDisabled());
    if (enabled.length === 0) {
      return undefined;
    }

    if (key === 'Home') {
      return enabled[0];
    }
    if (key === 'End') {
      return enabled[enabled.length - 1];
    }

    const rtl = this.directionality?.value === 'rtl';
    let step = 0;
    if (this.zOrientation() === 'vertical') {
      step = key === 'ArrowDown' ? 1 : key === 'ArrowUp' ? -1 : 0;
    } else if (key === 'ArrowRight') {
      step = rtl ? -1 : 1;
    } else if (key === 'ArrowLeft') {
      step = rtl ? 1 : -1;
    }
    if (step === 0) {
      return undefined;
    }

    const position = enabled.indexOf(this.activeTabIndex());
    const from = position === -1 ? (step > 0 ? -1 : 0) : position;
    return enabled[(from + step + enabled.length) % enabled.length];
  }

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
  'group-data-[orientation=vertical]/tabs:after:inset-y-0 group-data-[orientation=vertical]/tabs:after:-end-1 group-data-[orientation=vertical]/tabs:after:w-0.5',
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
import { ZardTabsImports } from '@/shared/components/tabs/tabs.imports';
```

```angular-html
<z-tab-group>
  <z-tab label="Account">Account content here.</z-tab>
  <z-tab label="Password">Password content here.</z-tab>
</z-tab-group>
```

## Examples

### Line

Use the `zVariant="line"` input on `z-tab-group` for a line style.

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

Set `zDisabled` on a `z-tab` to remove it from the tab order and prevent activation.

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

Set `zIcon` on a `z-tab` to render an `ng-icon` before the label.

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

### Rtl

To enable RTL support in zard/ui, see the [RTL configuration guide](/docs/rtl).

```angular-ts
// You will notice this example is rendered inside a wrapper that sets the dir and data-lang attributes, and
// reads its text from a translations helper. This is because this site is not RTL by default.
// In your application you won't need either: set dir="rtl" on <html> (or use the CDK Dir directive on a subtree)
// and write the text of your own language. See the RTL guide: https://zardui.com/docs/rtl

import { ChangeDetectionStrategy, Component } from '@angular/core';

import { ZardCardImports } from '@/shared/components/card/card.imports';
import { injectRtlTranslation, type ZardRtlTranslations } from '@/shared/demo-utils/rtl-translation';

import { ZardTabComponent, ZardTabGroupComponent } from '../tabs.component';

const translations: ZardRtlTranslations<{
  overview: string;
  analytics: string;
  reports: string;
  overviewText: string;
  analyticsText: string;
  reportsText: string;
}> = {
  en: {
    dir: 'ltr',
    values: {
      overview: 'Overview',
      analytics: 'Analytics',
      reports: 'Reports',
      overviewText: 'You have 12 active projects and 3 pending tasks.',
      analyticsText: 'Page views are up 25% compared to last month.',
      reportsText: 'Your weekly report is ready to download.',
    },
  },
  ar: {
    dir: 'rtl',
    values: {
      overview: 'نظرة عامة',
      analytics: 'التحليلات',
      reports: 'التقارير',
      overviewText: 'لديك 12 مشروعًا نشطًا و3 مهام معلقة.',
      analyticsText: 'ارتفعت مشاهدات الصفحة بنسبة 25٪ مقارنة بالشهر الماضي.',
      reportsText: 'تقريرك الأسبوعي جاهز للتنزيل.',
    },
  },
  he: {
    dir: 'rtl',
    values: {
      overview: 'סקירה',
      analytics: 'ניתוח נתונים',
      reports: 'דוחות',
      overviewText: 'יש לך 12 פרויקטים פעילים ו-3 משימות ממתינות.',
      analyticsText: 'צפיות בדף עלו ב-25% בהשוואה לחודש שעבר.',
      reportsText: 'הדוח השבועי שלך מוכן להורדה.',
    },
  },
};

@Component({
  selector: 'z-demo-tabs-rtl',
  imports: [ZardTabComponent, ZardTabGroupComponent, ZardCardImports],
  template: `
    <z-tab-group class="w-[400px]">
      <z-tab [label]="i18n.t().overview">
        <z-card>
          <z-card-header>
            <z-card-title [zTitle]="i18n.t().overview" />
          </z-card-header>
          <p z-card-content class="text-muted-foreground text-sm">{{ i18n.t().overviewText }}</p>
        </z-card>
      </z-tab>
      <z-tab [label]="i18n.t().analytics">
        <z-card>
          <z-card-header>
            <z-card-title [zTitle]="i18n.t().analytics" />
          </z-card-header>
          <p z-card-content class="text-muted-foreground text-sm">{{ i18n.t().analyticsText }}</p>
        </z-card>
      </z-tab>
      <z-tab [label]="i18n.t().reports">
        <z-card>
          <z-card-header>
            <z-card-title [zTitle]="i18n.t().reports" />
          </z-card-header>
          <p z-card-content class="text-muted-foreground text-sm">{{ i18n.t().reportsText }}</p>
        </z-card>
      </z-tab>
    </z-tab-group>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ZardDemoTabsRtlComponent {
  protected readonly i18n = injectRtlTranslation(translations);
}
```

## API Reference

### z-tab-group

A set of layered sections of content — known as tab panels — displayed one at a time. Arrow keys, Home and End move between enabled tabs; in right-to-left layouts the horizontal arrows follow the visual order (ArrowRight moves to the previous tab).

| Prop | Description | Type | Default |
| --- | --- | --- | --- |
| `[class]` | Custom CSS classes | `ClassValue` | `''` |
| `[zVariant]` | Visual variant of the tab navigation | `'default' \| 'line'` | `'default'` |
| `[zOrientation]` | Layout direction of the tab group | `'horizontal' \| 'vertical'` | `'horizontal'` |
| `[zDisabled]` | Whether the entire tab group is disabled | `boolean` | `false` |
| `(zTabChange)` | Emits when a new tab is selected | `EventEmitter<{ index: number; label: string; tab: ZardTabComponent }>` | `-` |
| `(zDeselect)` | Emits when the current tab is deselected | `EventEmitter<{ index: number; label: string; tab: ZardTabComponent }>` | `-` |

### z-tab

An individual tab. Label is shown in the navigation; projected content becomes the tab panel.

| Prop | Description | Type | Default |
| --- | --- | --- | --- |
| `[label]` | Label displayed in the tab button | `string` | `-` |
| `[zIcon]` | Optional ng-icons name shown before the label | `string` | `-` |
| `[zDisabled]` | Whether this individual tab is disabled | `boolean` | `false` |

---

[Open in browser](https://zardui.com/docs/components/tabs)
