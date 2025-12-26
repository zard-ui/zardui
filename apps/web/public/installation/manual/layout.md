

```angular-ts title="layout.component.ts" expandable="true" expandableTitle="Expand" copyButton showLineNumbers
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



```angular-ts title="layout.variants.ts" expandable="true" expandableTitle="Expand" copyButton showLineNumbers
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
  'absolute bottom-4 z-10 flex items-center justify-center cursor-pointer rounded-sm border border-sidebar-border bg-sidebar hover:bg-sidebar-accent transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-sidebar-ring focus-visible:ring-offset-2 w-6 h-6 -right-3',
);

// Sidebar Group Variants
export const sidebarGroupVariants = cva('flex flex-col gap-1');

export const sidebarGroupLabelVariants = cva(
  'flex h-8 shrink-0 items-center rounded-md px-2 text-xs font-medium text-sidebar-foreground/70 outline-hidden transition-[margin,opacity] duration-200 ease-linear focus-visible:ring-2 focus-visible:ring-sidebar-ring [&>svg]:size-4 [&>svg]:shrink-0',
);

```



```angular-ts title="content.component.ts" expandable="true" expandableTitle="Expand" copyButton showLineNumbers
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



```angular-ts title="footer.component.ts" expandable="true" expandableTitle="Expand" copyButton showLineNumbers
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



```angular-ts title="header.component.ts" expandable="true" expandableTitle="Expand" copyButton showLineNumbers
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



```angular-ts title="index.ts" expandable="true" expandableTitle="Expand" copyButton showLineNumbers
export * from '@/shared/components/layout/layout.component';
export * from '@/shared/components/layout/header.component';
export * from '@/shared/components/layout/footer.component';
export * from '@/shared/components/layout/content.component';
export * from '@/shared/components/layout/sidebar.component';
export * from '@/shared/components/layout/layout.variants';
export * from '@/shared/components/layout/layout.imports';

```



```angular-ts title="layout.imports.ts" expandable="true" expandableTitle="Expand" copyButton showLineNumbers
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



```angular-ts title="sidebar.component.ts" expandable="true" expandableTitle="Expand" copyButton showLineNumbers
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  input,
  output,
  signal,
  type TemplateRef,
  ViewEncapsulation,
} from '@angular/core';

import type { ClassValue } from 'clsx';

import { ZardIconComponent, type ZardIcon } from '@/shared/components/icon';
import {
  sidebarGroupLabelVariants,
  sidebarGroupVariants,
  sidebarTriggerVariants,
  sidebarVariants,
} from '@/shared/components/layout/layout.variants';
import { ZardStringTemplateOutletDirective } from '@/shared/core/directives/string-template-outlet/string-template-outlet.directive';
import { mergeClasses, transform } from '@/shared/utils/merge-classes';

@Component({
  selector: 'z-sidebar',
  imports: [ZardStringTemplateOutletDirective, ZardIconComponent],
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
          <z-icon [zType]="chevronIcon()" />
        </div>
      }

      @if (zCollapsible() && zTrigger()) {
        <ng-container *zStringTemplateOutlet="zTrigger()" />
      }
    </aside>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  exportAs: 'zSidebar',
})
export class SidebarComponent {
  readonly zWidth = input<string | number>(200);
  readonly zCollapsedWidth = input<number>(64);
  readonly zCollapsible = input(false, { transform });
  readonly zCollapsed = input(false, { transform });
  readonly zReverseArrow = input(false, { transform });
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

  protected readonly chevronIcon = computed((): ZardIcon => {
    const collapsed = this.zCollapsed();
    const reverse = this.zReverseArrow();

    if (reverse) {
      return collapsed ? 'chevron-left' : 'chevron-right';
    }
    return collapsed ? 'chevron-right' : 'chevron-left';
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

