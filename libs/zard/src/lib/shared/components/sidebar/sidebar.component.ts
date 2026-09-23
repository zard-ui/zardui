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
