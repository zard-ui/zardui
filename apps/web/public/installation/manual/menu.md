

```angular-ts title="menu.component.ts" copyButton showLineNumbers
import { ClassValue } from 'class-variance-authority/dist/types';

import { AfterContentInit, ChangeDetectionStrategy, Component, computed, ContentChildren, input, QueryList, ViewEncapsulation } from '@angular/core';

import { mergeClasses } from '../../shared/utils/utils';
import { ZardMenuItemDirective } from './menu-item.directive';
import { menuVariants, ZardMenuVariants } from './menu.variants';
import { ZardSubmenuComponent } from './submenu.component';

@Component({
  selector: 'ul[z-menu]',
  exportAs: 'zMenu',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  template: `
    <ul [class]="classes()" role="menu" [attr.data-mode]="zMode()" [attr.data-theme]="zTheme()">
      <ng-content></ng-content>
    </ul>
  `,
  host: {
    '[class]': 'hostClasses()',
    '[attr.data-collapsed]': 'zInlineCollapsed()',
  },
})
export class ZardMenuComponent implements AfterContentInit {
  @ContentChildren(ZardMenuItemDirective, { descendants: true }) private menuItems!: QueryList<ZardMenuItemDirective>;
  @ContentChildren(ZardSubmenuComponent, { descendants: true }) private submenus!: QueryList<ZardSubmenuComponent>;

  readonly zMode = input<ZardMenuVariants['zMode']>('vertical');
  readonly zTheme = input<ZardMenuVariants['zTheme']>('light');
  readonly zInlineCollapsed = input<boolean>(false);
  readonly class = input<ClassValue>('');

  protected readonly classes = computed(() => {
    const mode = this.zInlineCollapsed() && this.zMode() === 'inline' ? 'vertical' : this.zMode();
    return mergeClasses(
      menuVariants({
        zMode: mode,
        zTheme: this.zTheme(),
        zCollapsed: this.zInlineCollapsed(),
      }),
      this.class(),
    );
  });

  protected readonly hostClasses = computed(() => {
    return mergeClasses('z-menu-wrapper', this.zInlineCollapsed() ? 'z-menu-collapsed' : '');
  });

  ngAfterContentInit() {
    this.updateComponentModes();
    this.menuItems.changes.subscribe(() => this.updateComponentModes());
    this.submenus.changes.subscribe(() => this.updateComponentModes());
  }

  private updateComponentModes() {
    const mode = this.zInlineCollapsed() && this.zMode() === 'inline' ? 'vertical' : this.zMode();

    // Set mode for top-level menu items only
    // Items inside submenus will be handled by their submenu component
    this.menuItems.forEach(item => {
      item.setMode(mode);
    });

    // Set mode for submenus - they will handle their content items internally
    this.submenus.forEach(submenu => {
      submenu.setMode(mode);
      submenu.setCollapsed(this.zInlineCollapsed());
    });
  }
}

```



```angular-ts title="menu.variants.ts" copyButton showLineNumbers
import { cva, VariantProps } from 'class-variance-authority';

export const menuVariants = cva('z-menu relative flex max-w-max flex-1 items-center justify-center list-none m-0 p-0', {
  variants: {
    zMode: {
      horizontal: 'group flex flex-1 list-none items-center justify-start gap-1 p-1',
      vertical: 'flex flex-col w-full space-y-1 p-1',
      inline: 'flex flex-col w-full space-y-1 p-1',
    },
    zTheme: {
      light: 'bg-background text-foreground',
      dark: 'bg-neutral-900 text-neutral-100',
    },
    zCollapsed: {
      true: 'w-20',
      false: '',
    },
  },
  defaultVariants: {
    zMode: 'vertical',
    zTheme: 'light',
    zCollapsed: false,
  },
});

export const menuItemVariants = cva(
  'z-menu-item group inline-flex min-h-9 w-max items-center justify-center rounded-md bg-background p-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground disabled:pointer-events-none disabled:opacity-50 focus-visible:outline-none cursor-pointer',
  {
    variants: {
      zMode: {
        horizontal: 'w-max',
        vertical: 'w-full justify-start',
        inline: 'w-full justify-start',
      },
      zDisabled: {
        true: 'opacity-50 cursor-not-allowed pointer-events-none',
        false: '',
      },
      zLevel: {
        1: '',
        2: '',
        3: '',
        4: '',
      },
    },
    compoundVariants: [
      // Only apply level padding in inline mode
      {
        zMode: 'inline',
        zLevel: 2,
        class: 'pl-8',
      },
      {
        zMode: 'inline',
        zLevel: 3,
        class: 'pl-12',
      },
      {
        zMode: 'inline',
        zLevel: 4,
        class: 'pl-16',
      },
    ],
    defaultVariants: {
      zMode: 'vertical',
      zDisabled: false,
      zLevel: 1,
    },
  },
);

export const submenuVariants = cva('z-submenu relative', {
  variants: {
    zMode: {
      horizontal: 'inline-block',
      vertical: 'w-full',
      inline: 'w-full',
    },
    zOpen: {
      true: '',
      false: '',
    },
  },
  defaultVariants: {
    zMode: 'vertical',
    zOpen: false,
  },
});

export const submenuTitleVariants = cva(
  'z-submenu-title group inline-flex min-h-9 w-max items-center justify-center rounded-md bg-background px-3 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground disabled:pointer-events-none disabled:opacity-50 data-[state=open]:bg-accent/50 focus-visible:outline-none cursor-pointer',
  {
    variants: {
      zMode: {
        horizontal: 'w-max',
        vertical: 'w-full justify-start',
        inline: 'w-full justify-start',
      },
      zDisabled: {
        true: 'opacity-50 cursor-not-allowed pointer-events-none',
        false: '',
      },
      zLevel: {
        1: '',
        2: '',
        3: '',
        4: '',
      },
    },
    compoundVariants: [
      {
        zMode: 'inline',
        zLevel: 2,
        class: 'pl-8',
      },
      {
        zMode: 'inline',
        zLevel: 3,
        class: 'pl-12',
      },
      {
        zMode: 'inline',
        zLevel: 4,
        class: 'pl-16',
      },
    ],
    defaultVariants: {
      zMode: 'vertical',
      zDisabled: false,
      zLevel: 1,
    },
  },
);

export const submenuContentVariants = cva('z-submenu-content [&_li[z-menu-item]]:w-full [&_li[z-menu-item]]:justify-start [&_li[z-menu-item]]:!inline-flex', {
  variants: {
    zMode: {
      horizontal:
        'relative mt-1.5 h-auto min-w-[8rem] w-auto flex flex-col space-y-1 overflow-hidden rounded-md border bg-popover p-2 text-popover-foreground shadow-md data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-90',
      vertical:
        'relative mt-1.5 h-auto min-w-[4rem] w-auto flex flex-col space-y-1 overflow-hidden rounded-md border bg-popover p-2 text-popover-foreground shadow-md data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-90',
      inline: 'overflow-hidden transition-all duration-200 space-y-1 pl-4',
    },
    zOpen: {
      true: '',
      false: 'hidden',
    },
    zCollapsed: {
      true: '',
      false: '',
    },
    zLevel: {
      1: '',
      2: '',
      3: '',
      4: '',
    },
  },
  compoundVariants: [
    {
      zMode: 'inline',
      zOpen: true,
      class: 'max-h-[1000px] opacity-100',
    },
    {
      zMode: 'inline',
      zOpen: false,
      class: 'max-h-0 opacity-0',
    },
    // Z-index management for nested submenus
    {
      zMode: ['horizontal', 'vertical'],
      class: 'z-50',
    },
    {
      zMode: ['horizontal', 'vertical'],
      zLevel: 1,
      class: 'z-50',
    },
    {
      zMode: ['horizontal', 'vertical'],
      zLevel: 2,
      class: 'z-51',
    },
    {
      zMode: ['horizontal', 'vertical'],
      zLevel: 3,
      class: 'z-52',
    },
    {
      zMode: ['horizontal', 'vertical'],
      zLevel: 4,
      class: 'z-53',
    },
  ],
  defaultVariants: {
    zMode: 'vertical',
    zOpen: false,
    zCollapsed: false,
    zLevel: 1,
  },
});

export const menuGroupVariants = cva('z-menu-group', {
  variants: {
    zMode: {
      horizontal: 'inline-block',
      vertical: 'w-full',
      inline: 'w-full',
    },
  },
  defaultVariants: {
    zMode: 'vertical',
  },
});

export const menuGroupTitleVariants = cva('z-menu-group-title px-2 py-1.5 text-xs font-semibold text-muted-foreground', {
  variants: {
    zLevel: {
      1: '',
      2: 'pl-8',
      3: 'pl-12',
      4: 'pl-16',
    },
  },
  defaultVariants: {
    zLevel: 1,
  },
});

export type ZardMenuVariants = VariantProps<typeof menuVariants>;
export type ZardMenuItemVariants = VariantProps<typeof menuItemVariants>;
export type ZardSubmenuVariants = VariantProps<typeof submenuVariants>;
export type ZardMenuGroupVariants = VariantProps<typeof menuGroupVariants>;

```



```angular-ts title="menu-group.component.ts" copyButton showLineNumbers
import { ClassValue } from 'class-variance-authority/dist/types';

import { ChangeDetectionStrategy, Component, computed, input, ViewEncapsulation } from '@angular/core';

import { mergeClasses } from '../../shared/utils/utils';
import { menuGroupTitleVariants, menuGroupVariants, ZardMenuGroupVariants } from './menu.variants';

@Component({
  selector: 'li[z-menu-group]',
  exportAs: 'zMenuGroup',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  template: `
    @if (zTitle()) {
      <div [class]="titleClasses()">{{ zTitle() }}</div>
    }
    <ng-content></ng-content>
  `,
  host: {
    '[class]': 'classes()',
    role: 'presentation',
  },
})
export class ZardMenuGroupComponent {
  readonly zTitle = input<string>('');
  readonly zLevel = input<number>(1);
  readonly class = input<ClassValue>('');

  private readonly mode = computed(() => 'vertical' as ZardMenuGroupVariants['zMode']);

  protected readonly classes = computed(() =>
    mergeClasses(
      menuGroupVariants({
        zMode: this.mode(),
      }),
      this.class(),
    ),
  );

  protected readonly titleClasses = computed(() =>
    mergeClasses(
      menuGroupTitleVariants({
        zLevel: this.zLevel() as 1 | 2 | 3 | 4,
      }),
    ),
  );
}

```



```angular-ts title="menu-item.directive.ts" copyButton showLineNumbers
import { ClassValue } from 'class-variance-authority/dist/types';

import { Directive, computed, input, signal } from '@angular/core';

import { mergeClasses, transform } from '../../shared/utils/utils';
import { menuItemVariants, ZardMenuItemVariants } from './menu.variants';

@Directive({
  selector: '[z-menu-item]',
  exportAs: 'zMenuItem',
  standalone: true,
  host: {
    role: 'menuitem',
    '[class]': 'classes()',
    '[attr.aria-disabled]': 'zDisabled()',
    '[tabindex]': 'tabIndex()',
  },
})
export class ZardMenuItemDirective {
  readonly zDisabled = input(false, { transform });
  readonly zLevel = input<ZardMenuItemVariants['zLevel']>(1);

  readonly class = input<ClassValue>('');

  private mode = signal<ZardMenuItemVariants['zMode']>('vertical');

  protected readonly classes = computed(() =>
    mergeClasses(
      menuItemVariants({
        zMode: this.mode(),
        zDisabled: this.zDisabled(),
        zLevel: this.zLevel(),
      }),
      this.class(),
    ),
  );

  protected readonly tabIndex = computed(() => {
    return this.zDisabled() ? -1 : 0;
  });

  setMode(mode: ZardMenuItemVariants['zMode']) {
    this.mode.set(mode);
  }
}

```



```angular-ts title="menu.module.ts" copyButton showLineNumbers
import { NgModule } from '@angular/core';

import { ZardDividerComponent } from '../divider/divider.component';
import { ZardMenuGroupComponent } from './menu-group.component';
import { ZardMenuItemDirective } from './menu-item.directive';
import { ZardMenuComponent } from './menu.component';
import { ZardSubmenuComponent } from './submenu.component';

const MENU_COMPONENTS = [ZardMenuComponent, ZardMenuItemDirective, ZardSubmenuComponent, ZardMenuGroupComponent, ZardDividerComponent];

@NgModule({
  imports: [...MENU_COMPONENTS],
  exports: MENU_COMPONENTS,
})
export class ZardMenuModule {}

```



```angular-ts title="submenu.component.ts" copyButton showLineNumbers
import { ClassValue } from 'class-variance-authority/dist/types';

import { ConnectedOverlayPositionChange, ConnectedPosition, OverlayModule } from '@angular/cdk/overlay';
import {
    ChangeDetectionStrategy,
    Component,
    computed,
    effect,
    ElementRef,
    HostListener,
    inject,
    input,
    signal,
    ViewChild,
    ViewEncapsulation
} from '@angular/core';

import { mergeClasses, transform } from '../../shared/utils/utils';
import { submenuContentVariants, submenuTitleVariants, submenuVariants, ZardSubmenuVariants } from './menu.variants';
import { ZardSubmenuService } from './submenu.service';

@Component({
  selector: 'li[z-submenu]',
  exportAs: 'zSubmenu',
  standalone: true,
  imports: [OverlayModule],
  providers: [ZardSubmenuService],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  template: `
    <div
      #titleElement
      [class]="titleClasses()"
      (click)="toggle()"
      (keydown)="onTitleKeydown($event)"
      [attr.aria-expanded]="isOpen()"
      [attr.aria-haspopup]="true"
      [attr.aria-disabled]="zDisabled()"
      [tabindex]="tabIndex()"
      role="menuitem"
    >
      @if (zIcon()) {
        <span [class]="'icon-' + zIcon() + ' mr-2'"></span>
      }
      <span>{{ zTitle() }}</span>
      @if (mode() === 'horizontal') {
        <i class="icon-chevron-down ml-1 transition-transform duration-300 group-data-[state=open]:rotate-180"></i>
      } @else if (mode() !== 'inline') {
        <i class="icon-chevron-right ml-auto transition-transform duration-300" [class.rotate-90]="isOpen()"></i>
      } @else {
        <i class="icon-chevron-right ml-auto transition-transform duration-300" [class.rotate-90]="isOpen()"></i>
      }
    </div>

    @if (mode() === 'inline') {
      <div [class]="contentClasses()" role="menu">
        <ng-content></ng-content>
      </div>
    }

    @if (mode() !== 'inline') {
      <ng-template
        cdkConnectedOverlay
        [cdkConnectedOverlayOrigin]="titleElement"
        [cdkConnectedOverlayOpen]="isOpen()"
        [cdkConnectedOverlayPositions]="overlayPositions()"
        [cdkConnectedOverlayPush]="true"
        [cdkConnectedOverlayViewportMargin]="8"
        (positionChange)="onPositionChange($event)"
      >
        <div [class]="contentClasses()" role="menu" (keydown)="onKeydown($event)" (mouseenter)="onSubmenuMouseEnter()" (mouseleave)="onSubmenuMouseLeave()">
          <ng-content></ng-content>
        </div>
      </ng-template>
    }
  `,
  host: {
    '[attr.data-submenu]': 'true',
    '[class]': 'classes()',
  },
})
export class ZardSubmenuComponent {
  private elementRef = inject(ElementRef);
  private submenuService = inject(ZardSubmenuService);

  @ViewChild('titleElement', { read: ElementRef, static: false }) titleElement?: ElementRef;

  readonly zTitle = input<string>('');
  readonly zIcon = input<string>('');
  readonly zDisabled = input(false, { transform });
  readonly zPopupOffset = input<[number, number]>([0, 0]);
  readonly zLevel = input<number>(1);

  // Use service level if not explicitly set
  readonly effectiveLevel = computed(() => this.zLevel() || this.submenuService.level());

  readonly class = input<ClassValue>('');

  readonly isOpen = signal(false);
  readonly mode = signal<ZardSubmenuVariants['zMode']>('vertical');
  readonly collapsed = signal(false);
  readonly overlayPosition = signal<'top' | 'bottom' | 'left' | 'right'>('bottom');
  readonly triggerWidth = signal<number>(0);

  constructor() {
    // Sync service state with component state using effects
    effect(() => {
      this.submenuService.updateMode(this.mode());
    });

    effect(() => {
      const serviceOpen = this.submenuService.isOpen();
      this.isOpen.set(serviceOpen);
    });
  }


  readonly overlayPositions = computed<ConnectedPosition[]>(() => {
    const [offsetX, offsetY] = this.zPopupOffset();

    if (this.mode() === 'horizontal') {
      return this.getHorizontalPositions(offsetX, offsetY);
    } else {
      return this.getVerticalPositions(offsetX, offsetY);
    }
  });

  protected readonly classes = computed(() =>
    mergeClasses(
      submenuVariants({
        zMode: this.mode(),
        zOpen: this.isOpen(),
      }),
      this.class(),
    ),
  );

  protected readonly titleClasses = computed(() =>
    mergeClasses(
      submenuTitleVariants({
        zMode: this.mode(),
        zDisabled: this.zDisabled(),
        zLevel: this.effectiveLevel() as 1 | 2 | 3 | 4,
      }),
    ),
  );

  protected readonly contentClasses = computed(() =>
    mergeClasses(
      submenuContentVariants({
        zMode: this.mode(),
        zOpen: this.isOpen(),
        zCollapsed: this.collapsed(),
        zLevel: this.effectiveLevel() as 1 | 2 | 3 | 4,
      }),
    ),
  );

  protected readonly tabIndex = computed(() => {
    return this.zDisabled() ? -1 : 0;
  });

  @HostListener('mouseenter')
  onMouseEnter() {
    if (this.mode() !== 'inline' && !this.zDisabled()) {
      this.submenuService.setMouseEnterTitleState(true);
    }
  }

  @HostListener('mouseleave')
  onMouseLeave() {
    if (this.mode() !== 'inline' && !this.zDisabled()) {
      this.submenuService.setMouseEnterTitleState(false);
    }
  }

  toggle(event?: Event) {
    if (event) {
      event.preventDefault();
    }

    if (this.zDisabled()) return;

    this.submenuService.toggleOpen();
  }

  open() {
    if (this.zDisabled()) return;
    this.submenuService.setMouseEnterTitleState(true);
  }

  close() {
    this.submenuService.forceClose();
  }

  setMode(mode: ZardSubmenuVariants['zMode']) {
    this.mode.set(mode);
    if (mode === 'inline') {
      this.close();
    }
  }

  setCollapsed(collapsed: boolean) {
    this.collapsed.set(collapsed);
    if (collapsed && this.mode() === 'inline') {
      this.close();
    }
  }

  onTitleKeydown(event: KeyboardEvent) {
    switch (event.key) {
      case 'Enter':
      case ' ':
        event.preventDefault();
        this.toggle();
        break;
      case 'ArrowRight':
        if (this.mode() !== 'inline' && !this.isOpen()) {
          event.preventDefault();
          this.open();
        }
        break;
      case 'ArrowLeft':
        if (this.mode() !== 'inline' && this.isOpen()) {
          event.preventDefault();
          this.close();
        }
        break;
    }
  }

  onKeydown(event: KeyboardEvent) {
    if (event.key === 'Escape') {
      event.preventDefault();
      this.close();
      this.elementRef.nativeElement.querySelector('[role="menuitem"]')?.focus();
    }
  }

  onSubmenuMouseEnter() {
    if (this.mode() !== 'inline' && !this.zDisabled()) {
      this.submenuService.setMouseEnterOverlayState(true);
    }
  }

  onSubmenuMouseLeave() {
    if (this.mode() !== 'inline' && !this.zDisabled()) {
      this.submenuService.setMouseEnterOverlayState(false);
    }
  }

  private getHorizontalPositions(offsetX: number, offsetY: number): ConnectedPosition[] {
    return [
      // Bottom placement (preferred)
      {
        originX: 'start',
        originY: 'bottom',
        overlayX: 'start',
        overlayY: 'top',
        offsetY: offsetY || 4,
        offsetX: offsetX || 0,
      },
      // Top placement (fallback)
      {
        originX: 'start',
        originY: 'top',
        overlayX: 'start',
        overlayY: 'bottom',
        offsetY: -(offsetY || 4),
        offsetX: offsetX || 0,
      },
      // Right alignment bottom
      {
        originX: 'end',
        originY: 'bottom',
        overlayX: 'end',
        overlayY: 'top',
        offsetY: offsetY || 4,
        offsetX: offsetX || 0,
      },
      // Right alignment top
      {
        originX: 'end',
        originY: 'top',
        overlayX: 'end',
        overlayY: 'bottom',
        offsetY: -(offsetY || 4),
        offsetX: offsetX || 0,
      },
    ];
  }

  private getVerticalPositions(offsetX: number, offsetY: number): ConnectedPosition[] {
    return [
      // Right placement (preferred for LTR)
      {
        originX: 'end',
        originY: 'top',
        overlayX: 'start',
        overlayY: 'top',
        offsetX: offsetX || 4,
        offsetY: offsetY || 0,
      },
      // Left placement (fallback)
      {
        originX: 'start',
        originY: 'top',
        overlayX: 'end',
        overlayY: 'top',
        offsetX: -(offsetX || 4),
        offsetY: offsetY || 0,
      },
      // Right placement center-aligned
      {
        originX: 'end',
        originY: 'center',
        overlayX: 'start',
        overlayY: 'center',
        offsetX: offsetX || 4,
        offsetY: offsetY || 0,
      },
      // Left placement center-aligned
      {
        originX: 'start',
        originY: 'center',
        overlayX: 'end',
        overlayY: 'center',
        offsetX: -(offsetX || 4),
        offsetY: offsetY || 0,
      },
      // Right placement bottom-aligned
      {
        originX: 'end',
        originY: 'bottom',
        overlayX: 'start',
        overlayY: 'bottom',
        offsetX: offsetX || 4,
        offsetY: offsetY || 0,
      },
      // Left placement bottom-aligned
      {
        originX: 'start',
        originY: 'bottom',
        overlayX: 'end',
        overlayY: 'bottom',
        offsetX: -(offsetX || 4),
        offsetY: offsetY || 0,
      },
    ];
  }

  onPositionChange(position: ConnectedOverlayPositionChange): void {
    // Determine the actual position based on overlay placement
    const connectionPair = position.connectionPair;

    if (this.mode() === 'horizontal') {
      if (connectionPair.originY === 'bottom') {
        this.overlayPosition.set('bottom');
      } else {
        this.overlayPosition.set('top');
      }
    } else {
      if (connectionPair.originX === 'end') {
        this.overlayPosition.set('right');
      } else {
        this.overlayPosition.set('left');
      }
    }

    // Update trigger width for horizontal menus
    if (this.mode() === 'horizontal' && this.titleElement) {
      this.setTriggerWidth();
    }
  }

  private setTriggerWidth(): void {
    if (this.titleElement?.nativeElement) {
      const width = this.titleElement.nativeElement.offsetWidth;
      this.triggerWidth.set(width);
    }
  }
}

```



```angular-ts title="submenu.service.ts" copyButton showLineNumbers
import { Injectable, signal, inject, computed, effect } from '@angular/core';
import { ZardMenuVariants } from './menu.variants';

@Injectable()
export class ZardSubmenuService {
  private readonly parentService = inject(ZardSubmenuService, { optional: true, skipSelf: true });

  // Core state signals
  private readonly _mode = signal<ZardMenuVariants['zMode']>('vertical');
  private readonly _isOpen = signal(false);
  private readonly _level = signal<number>(1);
  private readonly _mouseEnterTitle = signal(false);
  private readonly _mouseEnterOverlay = signal(false);
  private readonly _childOpen = signal(false);
  private readonly _manualOpen = signal(false);

  // Read-only signals
  readonly mode = this._mode.asReadonly();
  readonly level = this._level.asReadonly();

  // Computed state for determining if submenu should be open
  readonly isOpen = computed(() => {
    if (this._mode() === 'inline') {
      return this._manualOpen();
    }
    return this._mouseEnterTitle() || this._mouseEnterOverlay() || this._childOpen() || this._manualOpen();
  });

  constructor() {
    // Set level based on parent service
    if (this.parentService) {
      const parentLevel = this.parentService.level();
      this._level.set(parentLevel + 1);
    } else {
      this._level.set(1);
    }

    // Effect to notify parent when this submenu's state changes
    effect(() => {
      const isOpen = this.isOpen();
      if (this.parentService) {
        this.parentService.setChildOpen(isOpen);
      }
    });
  }

  updateMode(mode: ZardMenuVariants['zMode']): void {
    this._mode.set(mode);
    if (mode === 'inline') {
      this._mouseEnterTitle.set(false);
      this._mouseEnterOverlay.set(false);
    }
  }

  setMouseEnterTitleState(value: boolean): void {
    if (this._mode() !== 'inline') {
      this._mouseEnterTitle.set(value);
    }
  }

  setMouseEnterOverlayState(value: boolean): void {
    if (this._mode() !== 'inline') {
      this._mouseEnterOverlay.set(value);
    }
  }

  setChildOpen(open: boolean): void {
    this._childOpen.set(open);
  }

  toggleOpen(): void {
    const currentOpen = this._manualOpen();
    this._manualOpen.set(!currentOpen);
  }

  forceClose(): void {
    this._isOpen.set(false);
    this._manualOpen.set(false);
    this._mouseEnterTitle.set(false);
    this._mouseEnterOverlay.set(false);
  }
}

```

