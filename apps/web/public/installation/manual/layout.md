

```angular-ts title="layout.component.ts" expandable="true" expandableTitle="Expand" copyButton showLineNumbers
import type { ClassValue } from 'clsx';

import { ChangeDetectionStrategy, Component, computed, contentChildren, input, ViewEncapsulation } from '@angular/core';

import { mergeClasses } from '../../shared/utils/utils';
import { layoutVariants, LayoutVariants } from './layout.variants';
import { SidebarComponent } from './sidebar.component';

@Component({
  selector: 'z-layout',
  exportAs: 'zLayout',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: {
    '[class]': 'classes()',
  },
  template: `<ng-content></ng-content>`,
})
export class LayoutComponent {
  readonly class = input<ClassValue>('');
  readonly zDirection = input<LayoutVariants['zDirection']>('auto');

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
        zDirection: this.detectedDirection() as LayoutVariants['zDirection'],
      }),
      this.class(),
    ),
  );
}

```



```angular-ts title="layout.variants.ts" expandable="true" expandableTitle="Expand" copyButton showLineNumbers
import { cva, VariantProps } from 'class-variance-authority';

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
export type LayoutVariants = VariantProps<typeof layoutVariants>;

// Header Variants
export const headerVariants = cva('flex items-center px-4 bg-background border-b border-border shrink-0', {
  variants: {},
});
export type HeaderVariants = VariantProps<typeof headerVariants>;

// Footer Variants
export const footerVariants = cva('flex items-center px-6 bg-background border-t border-border shrink-0', {
  variants: {},
});
export type FooterVariants = VariantProps<typeof footerVariants>;

// Content Variants
export const contentVariants = cva('flex-1 flex flex-col overflow-auto bg-background p-6 min-h-dvh');
export type ContentVariants = VariantProps<typeof contentVariants>;

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
import type { ClassValue } from 'clsx';

import { ChangeDetectionStrategy, Component, computed, input, ViewEncapsulation } from '@angular/core';

import { mergeClasses } from '../../shared/utils/utils';
import { contentVariants } from './layout.variants';

@Component({
  selector: 'z-content',
  exportAs: 'zContent',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  template: `
    <main>
      <ng-content></ng-content>
    </main>
  `,
  host: {
    '[class]': 'classes()',
  },
})
export class ContentComponent {
  readonly class = input<ClassValue>('');

  protected readonly classes = computed(() => mergeClasses(contentVariants(), this.class()));
}

```



```angular-ts title="footer.component.ts" expandable="true" expandableTitle="Expand" copyButton showLineNumbers
import type { ClassValue } from 'clsx';

import { ChangeDetectionStrategy, Component, computed, input, ViewEncapsulation } from '@angular/core';

import { mergeClasses } from '../../shared/utils/utils';
import { footerVariants } from './layout.variants';

@Component({
  selector: 'z-footer',
  exportAs: 'zFooter',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  template: `
    <footer [class]="classes()" [style.height.px]="zHeight()">
      <ng-content></ng-content>
    </footer>
  `,
})
export class FooterComponent {
  readonly class = input<ClassValue>('');
  readonly zHeight = input<number>(64);

  protected readonly classes = computed(() => mergeClasses(footerVariants(), this.class()));
}

```



```angular-ts title="header.component.ts" expandable="true" expandableTitle="Expand" copyButton showLineNumbers
import type { ClassValue } from 'clsx';

import { ChangeDetectionStrategy, Component, computed, input, ViewEncapsulation } from '@angular/core';

import { mergeClasses } from '../../shared/utils/utils';
import { headerVariants } from './layout.variants';

@Component({
  selector: 'z-header',
  exportAs: 'zHeader',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  template: `
    <header [class]="classes()" [style.height.px]="zHeight()">
      <ng-content></ng-content>
    </header>
  `,
})
export class HeaderComponent {
  readonly class = input<ClassValue>('');
  readonly zHeight = input<number>(64);

  protected readonly classes = computed(() => mergeClasses(headerVariants(), this.class()));
}

```



```angular-ts title="layout.module.ts" expandable="true" expandableTitle="Expand" copyButton showLineNumbers
import { NgModule } from '@angular/core';

import { ContentComponent } from './content.component';
import { FooterComponent } from './footer.component';
import { HeaderComponent } from './header.component';
import { LayoutComponent } from './layout.component';
import { SidebarGroupLabelComponent, SidebarGroupComponent, SidebarComponent } from './sidebar.component';

const LAYOUT_COMPONENTS = [LayoutComponent, HeaderComponent, FooterComponent, ContentComponent, SidebarComponent, SidebarGroupComponent, SidebarGroupLabelComponent];

@NgModule({
  imports: [LAYOUT_COMPONENTS],
  exports: [LAYOUT_COMPONENTS],
})
export class LayoutModule {}

```



```angular-ts title="sidebar.component.ts" expandable="true" expandableTitle="Expand" copyButton showLineNumbers
import type { ClassValue } from 'clsx';

import { ChangeDetectionStrategy, Component, computed, effect, input, output, signal, TemplateRef, ViewEncapsulation } from '@angular/core';

import { mergeClasses, transform } from '../../shared/utils/utils';
import { ZardStringTemplateOutletDirective } from '../core/directives/string-template-outlet/string-template-outlet.directive';
import { sidebarGroupLabelVariants, sidebarGroupVariants, sidebarTriggerVariants, sidebarVariants } from './layout.variants';

@Component({
  selector: 'z-sidebar',
  exportAs: 'zSidebar',
  standalone: true,
  imports: [ZardStringTemplateOutletDirective],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  template: `
    <aside [class]="classes()" [style.width.px]="currentWidth()" [attr.data-collapsed]="zCollapsed()">
      <div class="flex-1 overflow-auto">
        <ng-content></ng-content>
      </div>

      @if (zCollapsible() && !zTrigger()) {
        <div
          [class]="triggerClasses()"
          (click)="toggleCollapsed()"
          (keydown.enter)="toggleCollapsed(); $event.preventDefault()"
          (keydown.space)="toggleCollapsed(); $event.preventDefault()"
          tabindex="0"
          role="button"
          [attr.aria-label]="zCollapsed() ? 'Expand sidebar' : 'Collapse sidebar'"
          [attr.aria-expanded]="!zCollapsed()"
        >
          <i [class]="chevronIcon()"></i>
        </div>
      }

      @if (zCollapsible() && zTrigger()) {
        <ng-container *zStringTemplateOutlet="zTrigger()"></ng-container>
      }
    </aside>
  `,
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

  protected readonly chevronIcon = computed(() => {
    const collapsed = this.zCollapsed();
    const reverse = this.zReverseArrow();

    if (reverse) {
      return collapsed ? 'icon-chevron-left text-base' : 'icon-chevron-right text-base';
    }
    return collapsed ? 'icon-chevron-right text-base' : 'icon-chevron-left text-base';
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
  exportAs: 'zSidebarGroup',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  template: `
    <div [class]="classes()">
      <ng-content></ng-content>
    </div>
  `,
})
export class SidebarGroupComponent {
  readonly class = input<ClassValue>('');

  protected readonly classes = computed(() => mergeClasses(sidebarGroupVariants(), this.class()));
}

@Component({
  selector: 'z-sidebar-group-label',
  exportAs: 'zSidebarGroupLabel',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  template: `
    <div [class]="classes()">
      <ng-content></ng-content>
    </div>
  `,
})
export class SidebarGroupLabelComponent {
  readonly class = input<ClassValue>('');

  protected readonly classes = computed(() => mergeClasses(sidebarGroupLabelVariants(), this.class()));
}

```

