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
