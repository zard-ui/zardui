

```angular-ts title="layout.component.ts" copyButton showLineNumbers
import type { ClassValue } from 'clsx';

import {
  AfterContentInit,
  ChangeDetectionStrategy,
  Component,
  computed,
  contentChildren,
  ElementRef,
  input,
  ViewEncapsulation,
} from '@angular/core';

import { mergeClasses } from '../../shared/utils/utils';
import { layoutVariants, LayoutVariants } from './layout.variants';

@Component({
  selector: 'z-layout',
  exportAs: 'zLayout',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  template: `
    <div [class]="classes()">
      <ng-content></ng-content>
    </div>
  `,
})
export class LayoutComponent implements AfterContentInit {
  readonly class = input<ClassValue>('');
  readonly zDirection = input<LayoutVariants['zDirection']>('auto');

  // Query all child elements to detect sider position
  private readonly childElements = contentChildren<ElementRef>(ElementRef, { descendants: false });

  private readonly detectedDirection = computed(() => {
    if (this.zDirection() !== 'auto') {
      return this.zDirection();
    }

    // Auto-detection: Check if first child is a sider
    const children = this.childElements();
    if (children.length === 0) {
      return 'vertical';
    }

    const firstChild = children[0]?.nativeElement;
    if (firstChild?.tagName?.toLowerCase() === 'z-sider') {
      return 'horizontal';
    }

    // Check if any child has z-sider
    const hasSider = children.some(child => child.nativeElement?.tagName?.toLowerCase() === 'z-sider');

    return hasSider ? 'horizontal' : 'vertical';
  });

  protected readonly classes = computed(() =>
    mergeClasses(
      layoutVariants({
        zDirection: this.detectedDirection() as LayoutVariants['zDirection'],
      }),
      this.class()
    )
  );

  ngAfterContentInit(): void {
    // Additional setup if needed
  }
}

```



```angular-ts title="layout.variants.ts" copyButton showLineNumbers
import { cva, VariantProps } from 'class-variance-authority';

export const layoutVariants = cva('flex w-full min-h-screen', {
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

```



```angular-ts title="content.component.ts" copyButton showLineNumbers
import type { ClassValue } from 'clsx';

import { ChangeDetectionStrategy, Component, computed, input, ViewEncapsulation } from '@angular/core';

import { mergeClasses } from '../../shared/utils/utils';
import { contentVariants } from './content.variants';

@Component({
  selector: 'z-content',
  exportAs: 'zContent',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  template: `
    <main [class]="classes()">
      <ng-content></ng-content>
    </main>
  `,
})
export class ContentComponent {
  readonly class = input<ClassValue>('');

  protected readonly classes = computed(() => mergeClasses(contentVariants(), this.class()));
}

```



```angular-ts title="content.variants.ts" copyButton showLineNumbers
import { cva, VariantProps } from 'class-variance-authority';

export const contentVariants = cva('flex-1 flex flex-col overflow-auto bg-background p-6');
export type ContentVariants = VariantProps<typeof contentVariants>;

```



```angular-ts title="footer.component.ts" copyButton showLineNumbers
import type { ClassValue } from 'clsx';

import { ChangeDetectionStrategy, Component, computed, input, ViewEncapsulation } from '@angular/core';

import { mergeClasses } from '../../shared/utils/utils';
import { footerVariants } from './footer.variants';

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



```angular-ts title="footer.variants.ts" copyButton showLineNumbers
import { cva, VariantProps } from 'class-variance-authority';

export const footerVariants = cva('flex items-center px-6 bg-background border-t border-border shrink-0', {
  variants: {},
});
export type FooterVariants = VariantProps<typeof footerVariants>;

```



```angular-ts title="header.component.ts" copyButton showLineNumbers
import type { ClassValue } from 'clsx';

import { ChangeDetectionStrategy, Component, computed, input, ViewEncapsulation } from '@angular/core';

import { mergeClasses } from '../../shared/utils/utils';
import { headerVariants } from './header.variants';

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



```angular-ts title="header.variants.ts" copyButton showLineNumbers
import { cva, VariantProps } from 'class-variance-authority';

export const headerVariants = cva('flex items-center px-6 bg-background border-b border-border shrink-0', {
  variants: {},
});
export type HeaderVariants = VariantProps<typeof headerVariants>;

```



```angular-ts title="sider.component.ts" copyButton showLineNumbers
import type { ClassValue } from 'clsx';

import { ChangeDetectionStrategy, Component, computed, effect, inject, input, output, PLATFORM_ID, signal, TemplateRef, ViewEncapsulation } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

import { mergeClasses, transform } from '../../shared/utils/utils';
import { ZardStringTemplateOutletDirective } from '../core/directives/string-template-outlet/string-template-outlet.directive';
import { siderTriggerVariants, siderVariants, SiderVariants } from './sider.variants';

@Component({
  selector: 'z-sider',
  exportAs: 'zSider',
  standalone: true,
  imports: [ZardStringTemplateOutletDirective],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  template: `
    <aside [class]="classes()" [style.width.px]="currentWidth()" [attr.data-collapsed]="zCollapsed()">
      <!-- Sider Content -->
      <div class="flex-1 overflow-auto">
        <ng-content></ng-content>
      </div>

      <!-- Default Trigger -->
      @if (zCollapsible() && !zTrigger()) {
        <div
          [class]="triggerClasses()"
          (click)="toggleCollapsed()"
          (keydown.enter)="toggleCollapsed(); $event.preventDefault()"
          (keydown.space)="toggleCollapsed(); $event.preventDefault()"
          tabindex="0"
          role="button"
          [attr.aria-label]="zCollapsed() ? 'Expand sidebar' : 'Collapse sidebar'"
          [attr.aria-expanded]="!zCollapsed()">
          @if (shouldShowZeroTrigger()) {
            <!-- Zero Width Trigger -->
            @if (zZeroTrigger()) {
              <ng-container *zStringTemplateOutlet="zZeroTrigger()"></ng-container>
            } @else {
              <i class="icon-menu text-base"></i>
            }
          } @else {
            <!-- Normal Trigger -->
            <i [class]="chevronIcon()"></i>
          }
        </div>
      }

      <!-- Custom Trigger -->
      @if (zCollapsible() && zTrigger()) {
        <ng-container *zStringTemplateOutlet="zTrigger()"></ng-container>
      }
    </aside>
  `,
})
export class SiderComponent {
  private platformId = inject(PLATFORM_ID);

  // Dimensions
  readonly zWidth = input<string | number>(200);
  readonly zCollapsedWidth = input<number>(64);

  // Behavior
  readonly zCollapsible = input(false, { transform });
  readonly zCollapsed = input(false, { transform });
  readonly zReverseArrow = input(false, { transform });

  // Appearance
  readonly zTheme = input<SiderVariants['zTheme']>('light');

  // Custom Templates
  readonly zTrigger = input<TemplateRef<void> | null>(null);
  readonly zZeroTrigger = input<TemplateRef<void> | null>(null);

  // Responsive
  readonly zBreakpoint = input<'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'xxl'>();

  // Styling
  readonly class = input<ClassValue>('');

  // Output
  readonly zCollapsedChange = output<boolean>();

  // Internal state
  private readonly internalCollapsed = signal(false);
  private resizeListener?: () => void;

  constructor() {
    // Sync input with internal state
    effect(() => {
      this.internalCollapsed.set(this.zCollapsed());
    });

    // Setup responsive behavior
    if (isPlatformBrowser(this.platformId)) {
      effect(() => {
        const breakpoint = this.zBreakpoint();
        if (breakpoint) {
          this.setupResponsive(breakpoint);
        }
      });
    }
  }

  protected readonly currentWidth = computed(() => {
    const collapsed = this.zCollapsed();
    if (collapsed) {
      return this.zCollapsedWidth();
    }

    const width = this.zWidth();
    return typeof width === 'number' ? width : parseInt(width, 10);
  });

  protected readonly shouldShowZeroTrigger = computed(() => {
    return this.zCollapsedWidth() === 0 && this.zCollapsed();
  });

  protected readonly chevronIcon = computed(() => {
    const collapsed = this.zCollapsed();
    const reverse = this.zReverseArrow();

    if (reverse) {
      return collapsed ? 'icon-chevron-left text-base' : 'icon-chevron-right text-base';
    }
    return collapsed ? 'icon-chevron-right text-base' : 'icon-chevron-left text-base';
  });

  protected readonly classes = computed(() =>
    mergeClasses(
      siderVariants({
        zTheme: this.zTheme(),
      }),
      this.class(),
    ),
  );

  protected readonly triggerClasses = computed(() => {
    return mergeClasses(siderTriggerVariants({ zSize: this.shouldShowZeroTrigger() ? 'zero' : 'default' }));
  });

  toggleCollapsed(): void {
    const newState = !this.zCollapsed();
    this.internalCollapsed.set(newState);
    this.zCollapsedChange.emit(newState);
  }

  private setupResponsive(breakpoint: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'xxl'): void {
    if (!isPlatformBrowser(this.platformId)) return;

    const breakpoints: Record<string, number> = {
      xs: 480,
      sm: 576,
      md: 768,
      lg: 992,
      xl: 1200,
      xxl: 1600,
    };

    const breakpointWidth = breakpoints[breakpoint];

    // Remove previous listener if exists
    if (this.resizeListener) {
      window.removeEventListener('resize', this.resizeListener);
    }

    // Create new listener
    this.resizeListener = () => {
      const shouldCollapse = window.innerWidth < breakpointWidth;
      if (shouldCollapse !== this.internalCollapsed()) {
        this.internalCollapsed.set(shouldCollapse);
        this.zCollapsedChange.emit(shouldCollapse);
      }
    };

    window.addEventListener('resize', this.resizeListener);

    // Initial check
    this.resizeListener();
  }
}

```



```angular-ts title="sider.variants.ts" copyButton showLineNumbers
import { cva, VariantProps } from 'class-variance-authority';

export const siderVariants = cva('relative flex flex-col h-full transition-all duration-300 ease-in-out border-r shrink-0', {
  variants: {
    zTheme: {
      light: 'bg-background border-border',
      dark: 'bg-zinc-900 dark:bg-zinc-950 border-zinc-800 text-white',
    },
  },
  defaultVariants: {
    zTheme: 'light',
  },
});
export type SiderVariants = VariantProps<typeof siderVariants>;

export const siderTriggerVariants = cva(
  'absolute bottom-4 z-10 flex items-center justify-center cursor-pointer rounded-sm border bg-background hover:bg-accent transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
  {
    variants: {
      zSize: {
        default: 'w-6 h-6 -right-3',
        zero: 'w-8 h-8 right-4',
      },
    },
    defaultVariants: {
      zSize: 'default',
    },
  }
);
export type SiderTriggerVariants = VariantProps<typeof siderTriggerVariants>;

```

