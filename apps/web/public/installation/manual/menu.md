

```angular-ts title="menu.component.ts" copyButton showLineNumbers
import { ClassValue } from 'class-variance-authority/dist/types';

import { AfterContentInit, ChangeDetectionStrategy, Component, computed, ContentChildren, input, output, QueryList, signal, ViewEncapsulation } from '@angular/core';

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
  @ContentChildren(ZardMenuItemDirective, { descendants: true }) menuItems!: QueryList<ZardMenuItemDirective>;
  @ContentChildren(ZardSubmenuComponent, { descendants: true }) submenus!: QueryList<ZardSubmenuComponent>;

  readonly zMode = input<ZardMenuVariants['zMode']>('vertical');
  readonly zTheme = input<ZardMenuVariants['zTheme']>('light');
  readonly zInlineCollapsed = input<boolean>(false);
  readonly zSelectable = input<boolean>(true);
  readonly zOpenKeys = input<string[]>([]);
  readonly zSelectedKeys = input<string[]>([]);

  readonly class = input<ClassValue>('');

  readonly zOpenChange = output<string[]>();
  readonly zSelectionChange = output<string[]>();
  readonly zItemClick = output<{ key: string; item: HTMLElement }>();

  readonly openKeys = signal<Set<string>>(new Set());
  readonly selectedKeys = signal<Set<string>>(new Set());

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
    this.initializeKeys();
    this.setupItemHandlers();
    this.setupSubmenuHandlers();
    this.updateSubmenuModes();
  }

  private initializeKeys() {
    this.openKeys.set(new Set(this.zOpenKeys()));
    this.selectedKeys.set(new Set(this.zSelectedKeys()));
  }

  private setupItemHandlers() {
    this.menuItems.changes.subscribe(() => this.bindItemEvents());
    this.bindItemEvents();
  }

  private setupSubmenuHandlers() {
    this.submenus.changes.subscribe(() => this.bindSubmenuEvents());
    this.bindSubmenuEvents();
  }

  private bindItemEvents() {
    this.menuItems.forEach(item => {
      item.itemClick.subscribe((data: { key: string; item: HTMLElement }) => {
        if (this.zSelectable() && !item.zDisabled()) {
          this.handleItemSelection(data.key);
          this.zItemClick.emit(data);
        }
      });
    });
  }

  private bindSubmenuEvents() {
    this.submenus.forEach(submenu => {
      submenu.zOpenChange.subscribe((open: boolean) => {
        this.handleSubmenuToggle(submenu.zKey(), open);
      });
    });
  }

  private handleItemSelection(key: string) {
    const keys = new Set(this.selectedKeys());

    if (this.zMode() === 'inline' || this.zMode() === 'vertical') {
      keys.clear();
      keys.add(key);
    } else {
      if (keys.has(key)) {
        keys.delete(key);
      } else {
        keys.add(key);
      }
    }

    this.selectedKeys.set(keys);
    this.zSelectionChange.emit(Array.from(keys));
    this.updateItemStates();
  }

  private handleSubmenuToggle(key: string, open: boolean) {
    const keys = new Set(this.openKeys());

    if (open) {
      if (this.zMode() === 'inline') {
        keys.add(key);
      } else {
        keys.clear();
        keys.add(key);
      }
    } else {
      keys.delete(key);
    }

    this.openKeys.set(keys);
    this.zOpenChange.emit(Array.from(keys));
    this.updateSubmenuStates();
  }

  private updateItemStates() {
    const selected = this.selectedKeys();
    this.menuItems.forEach(item => {
      item.setSelected(selected.has(item.zKey()));
    });
  }

  private updateSubmenuStates() {
    const open = this.openKeys();
    this.submenus.forEach(submenu => {
      submenu.setOpen(open.has(submenu.zKey()));
    });
  }

  private updateSubmenuModes() {
    const mode = this.zInlineCollapsed() && this.zMode() === 'inline' ? 'vertical' : this.zMode();
    this.submenus.forEach(submenu => {
      submenu.setMode(mode);
      submenu.setCollapsed(this.zInlineCollapsed());
    });
  }

  isItemSelected(key: string): boolean {
    return this.selectedKeys().has(key);
  }

  isSubmenuOpen(key: string): boolean {
    return this.openKeys().has(key);
  }
}

```



```angular-ts title="menu.variants.ts" copyButton showLineNumbers
import { cva, VariantProps } from 'class-variance-authority';

export const menuVariants = cva('z-menu relative flex max-w-max flex-1 items-center justify-center list-none m-0 p-0', {
  variants: {
    zMode: {
      horizontal: 'group flex flex-1 list-none items-center justify-center gap-1',
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

export const menuItemVariants = cva('z-menu-item group inline-flex h-9 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground disabled:pointer-events-none disabled:opacity-50 data-[state=open]:bg-accent/50 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring', {
  variants: {
    zMode: {
      horizontal: 'w-max',
      vertical: 'w-full justify-start',
      inline: 'w-full justify-start',
    },
    zSelected: {
      true: 'bg-accent text-accent-foreground',
      false: '',
    },
    zDisabled: {
      true: 'opacity-50 cursor-not-allowed pointer-events-none',
      false: '',
    },
    zLevel: {
      1: '',
      2: 'pl-8',
      3: 'pl-12',
      4: 'pl-16',
    },
  },
  defaultVariants: {
    zMode: 'vertical',
    zSelected: false,
    zDisabled: false,
    zLevel: 1,
  },
});

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

export const submenuTitleVariants = cva('z-submenu-title group inline-flex h-9 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground disabled:pointer-events-none disabled:opacity-50 data-[state=open]:bg-accent/50 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring', {
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
      2: 'pl-8',
      3: 'pl-12',
      4: 'pl-16',
    },
  },
  defaultVariants: {
    zMode: 'vertical',
    zDisabled: false,
    zLevel: 1,
  },
});

export const submenuContentVariants = cva('z-submenu-content', {
  variants: {
    zMode: {
      horizontal: 'relative mt-1.5 h-auto w-full overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-md data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-90 md:w-auto min-w-[200px]',
      vertical: 'relative mt-1.5 h-auto w-full overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-md data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-90 md:w-auto min-w-[200px]',
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
  ],
  defaultVariants: {
    zMode: 'vertical',
    zOpen: false,
    zCollapsed: false,
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

export const menuDividerVariants = cva('z-menu-divider my-1 border-t border-border', {
  variants: {
    zMode: {
      horizontal: 'mx-2 w-px h-4 border-t-0 border-l',
      vertical: 'mx-0',
      inline: 'mx-0',
    },
  },
  defaultVariants: {
    zMode: 'vertical',
  },
});

export type ZardMenuVariants = VariantProps<typeof menuVariants>;
export type ZardMenuItemVariants = VariantProps<typeof menuItemVariants>;
export type ZardSubmenuVariants = VariantProps<typeof submenuVariants>;
export type ZardMenuGroupVariants = VariantProps<typeof menuGroupVariants>;
export type ZardMenuDividerVariants = VariantProps<typeof menuDividerVariants>;

```



```angular-ts title="menu-divider.directive.ts" copyButton showLineNumbers
import { ClassValue } from 'class-variance-authority/dist/types';

import { Directive, computed, input } from '@angular/core';

import { mergeClasses } from '../../shared/utils/utils';
import { menuDividerVariants, ZardMenuDividerVariants } from './menu.variants';

@Directive({
  selector: '[z-menu-divider]',
  exportAs: 'zMenuDivider',
  standalone: true,
  host: {
    role: 'separator',
    '[class]': 'classes()',
  },
})
export class ZardMenuDividerDirective {
  readonly class = input<ClassValue>('');

  private mode = computed(() => 'vertical' as ZardMenuDividerVariants['zMode']);

  protected readonly classes = computed(() =>
    mergeClasses(
      menuDividerVariants({
        zMode: this.mode(),
      }),
      this.class(),
    ),
  );
}

```



```angular-ts title="menu-group.component.ts" copyButton showLineNumbers
import { ClassValue } from 'class-variance-authority/dist/types';

import { ChangeDetectionStrategy, Component, computed, input, ViewEncapsulation } from '@angular/core';

import { mergeClasses } from '../../shared/utils/utils';
import { menuGroupTitleVariants, menuGroupVariants, ZardMenuGroupVariants } from './menu.variants';

@Component({
  selector: 'z-menu-group',
  exportAs: 'zMenuGroup',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  template: `
    <li [class]="classes()" role="presentation">
      @if (zTitle()) {
        <div [class]="titleClasses()">{{ zTitle() }}</div>
      }
      <ul role="group">
        <ng-content></ng-content>
      </ul>
    </li>
  `,
  host: {
    '[attr.data-menu-group]': 'true',
  },
})
export class ZardMenuGroupComponent {
  readonly zTitle = input<string>('');
  readonly zLevel = input<number>(1);

  readonly class = input<ClassValue>('');

  private mode = computed(() => 'vertical' as ZardMenuGroupVariants['zMode']);

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

import { Directive, ElementRef, HostListener, inject, input, output, computed, signal } from '@angular/core';

import { mergeClasses, transform } from '../../shared/utils/utils';
import { menuItemVariants, ZardMenuItemVariants } from './menu.variants';

@Directive({
  selector: '[z-menu-item]',
  exportAs: 'zMenuItem',
  standalone: true,
  host: {
    role: 'menuitem',
    '[class]': 'classes()',
    '[attr.aria-selected]': 'zSelected()',
    '[attr.aria-disabled]': 'zDisabled()',
    '[attr.data-key]': 'zKey()',
    '[tabindex]': 'tabIndex()',
  },
})
export class ZardMenuItemDirective {
  private elementRef = inject(ElementRef);

  readonly zKey = input<string>('');
  readonly zDisabled = input(false, { transform });
  readonly zSelected = input(false, { transform });
  readonly zTitle = input<string>('');
  readonly zIcon = input<string>('');
  readonly zLevel = input<ZardMenuItemVariants['zLevel']>(1);

  readonly class = input<ClassValue>('');

  readonly itemClick = output<{ key: string; item: HTMLElement }>();

  private selected = signal(false);
  private mode = signal<ZardMenuItemVariants['zMode']>('vertical');

  protected readonly classes = computed(() =>
    mergeClasses(
      menuItemVariants({
        zMode: this.mode(),
        zSelected: this.selected() || this.zSelected(),
        zDisabled: this.zDisabled(),
        zLevel: this.zLevel(),
      }),
      this.class(),
    ),
  );

  protected readonly tabIndex = computed(() => {
    return this.zDisabled() ? -1 : 0;
  });

  @HostListener('click', ['$event'])
  onClick(event: MouseEvent) {
    if (this.zDisabled()) {
      event.preventDefault();
      event.stopPropagation();
      return;
    }

    this.itemClick.emit({
      key: this.zKey(),
      item: this.elementRef.nativeElement,
    });
  }

  @HostListener('keydown.enter', ['$event'])
  @HostListener('keydown.space', ['$event'])
  onKeyDown(event: KeyboardEvent) {
    if (this.zDisabled()) {
      event.preventDefault();
      return;
    }

    event.preventDefault();
    this.onClick(new MouseEvent('click'));
  }

  setSelected(selected: boolean) {
    this.selected.set(selected);
  }

  setMode(mode: ZardMenuItemVariants['zMode']) {
    this.mode.set(mode);
  }

  focus() {
    this.elementRef.nativeElement.focus();
  }

  blur() {
    this.elementRef.nativeElement.blur();
  }
}

```



```angular-ts title="menu.module.ts" copyButton showLineNumbers
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { ZardMenuDividerDirective } from './menu-divider.directive';
import { ZardMenuGroupComponent } from './menu-group.component';
import { ZardMenuItemDirective } from './menu-item.directive';
import { ZardMenuComponent } from './menu.component';
import { ZardSubmenuComponent } from './submenu.component';

const MENU_COMPONENTS = [ZardMenuComponent, ZardMenuItemDirective, ZardSubmenuComponent, ZardMenuGroupComponent, ZardMenuDividerDirective];

@NgModule({
  imports: [CommonModule, ...MENU_COMPONENTS],
  exports: MENU_COMPONENTS,
})
export class ZardMenuModule {}

```



```angular-ts title="submenu.component.ts" copyButton showLineNumbers
import { ClassValue } from 'class-variance-authority/dist/types';

import { ConnectedOverlayPositionChange, ConnectedPosition, OverlayModule } from '@angular/cdk/overlay';
import { CommonModule } from '@angular/common';
import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  ElementRef,
  HostListener,
  inject,
  input,
  output,
  signal,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';

import { mergeClasses, transform } from '../../shared/utils/utils';
import { submenuContentVariants, submenuTitleVariants, submenuVariants, ZardSubmenuVariants } from './menu.variants';
import { ZardSubmenuService } from './submenu.service';

@Component({
  selector: 'ul[z-submenu]',
  exportAs: 'zSubmenu',
  standalone: true,
  imports: [CommonModule, OverlayModule],
  providers: [ZardSubmenuService],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  styleUrls: ['./submenu-levels.css'],
  template: `
    <li [class]="classes()" [attr.data-key]="zKey()">
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
          <span [class]="'icon-' + zIcon() + ' mr-2 h-4 w-4'"></span>
        }
        <span>{{ zTitle() }}</span>
        @if (mode() === 'horizontal') {
          <svg 
            class="relative top-[1px] ml-1 h-3 w-3 transition-transform duration-300 group-data-[state=open]:rotate-180" 
            aria-hidden="true"
            fill="none" 
            height="24" 
            stroke="currentColor" 
            stroke-linecap="round" 
            stroke-linejoin="round" 
            stroke-width="2" 
            viewBox="0 0 24 24" 
            width="24"
          >
            <path d="m6 9 6 6 6-6"></path>
          </svg>
        } @else if (mode() !== 'inline') {
          <svg 
            class="ml-auto h-4 w-4 transition-transform duration-300"
            [class.rotate-90]="isOpen()"
            aria-hidden="true"
            fill="none" 
            height="24" 
            stroke="currentColor" 
            stroke-linecap="round" 
            stroke-linejoin="round" 
            stroke-width="2" 
            viewBox="0 0 24 24" 
            width="24"
          >
            <path d="m9 18 6-6-6-6"></path>
          </svg>
        } @else {
          <svg 
            class="ml-auto h-4 w-4 transition-transform duration-300"
            [class.rotate-90]="isOpen()"
            aria-hidden="true"
            fill="none" 
            height="24" 
            stroke="currentColor" 
            stroke-linecap="round" 
            stroke-linejoin="round" 
            stroke-width="2" 
            viewBox="0 0 24 24" 
            width="24"
          >
            <path d="m9 18 6-6-6-6"></path>
          </svg>
        }
      </div>

      @if (mode() === 'inline') {
        <ul [class]="contentClasses()" role="menu">
          <ng-content></ng-content>
        </ul>
      }

      @if (mode() !== 'inline') {
        <ng-template
          cdkConnectedOverlay
          [cdkConnectedOverlayOrigin]="titleElement"
          [cdkConnectedOverlayOpen]="isOpen()"
          [cdkConnectedOverlayPositions]="overlayPositions()"
          [cdkConnectedOverlayPush]="true"
          [cdkConnectedOverlayMinWidth]="mode() === 'horizontal' ? triggerWidth() || 200 : 200"
          [cdkConnectedOverlayViewportMargin]="8"
          [cdkConnectedOverlayFlexibleDimensions]="true"
          (positionChange)="onPositionChange($event)"
        >
          <ul [class]="contentClasses()" role="menu" (keydown)="onKeydown($event)" (mouseenter)="onSubmenuMouseEnter()" (mouseleave)="onSubmenuMouseLeave()">
            <ng-content></ng-content>
          </ul>
        </ng-template>
      }
    </li>
  `,
  host: {
    '[attr.data-submenu]': 'true',
  },
})
export class ZardSubmenuComponent implements AfterViewInit {
  private elementRef = inject(ElementRef);
  private submenuService = inject(ZardSubmenuService);

  @ViewChild('titleElement', { read: ElementRef, static: false }) titleElement?: ElementRef;

  readonly zKey = input<string>('');
  readonly zTitle = input<string>('');
  readonly zIcon = input<string>('');
  readonly zOpen = input(false, { transform });
  readonly zDisabled = input(false, { transform });
  readonly zPopupOffset = input<[number, number]>([0, 0]);
  readonly zLevel = input<number>(1);

  // Use service level if not explicitly set
  readonly effectiveLevel = computed(() => this.zLevel() || this.submenuService.level());

  readonly class = input<ClassValue>('');

  readonly zOpenChange = output<boolean>();

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
      }),
      // Add position-specific classes for non-inline menus
      this.mode() !== 'inline' ? `z-submenu-placement-${this.overlayPosition()}` : '',
      // Add level-based z-index for nested submenus
      this.mode() !== 'inline' ? `z-submenu-level-${this.effectiveLevel()}` : '',
    ),
  );

  protected readonly tabIndex = computed(() => {
    return this.zDisabled() ? -1 : 0;
  });

  ngAfterViewInit() {
    if (this.zOpen()) {
      this.isOpen.set(true);
    }
  }

  @HostListener('mouseenter')
  onMouseEnter() {
    if (this.mode() !== 'inline' && !this.zDisabled()) {
      this.submenuService.setMouseEnterTitleOrOverlayState(true);
    }
  }

  @HostListener('mouseleave')
  onMouseLeave() {
    if (this.mode() !== 'inline' && !this.zDisabled()) {
      this.submenuService.setMouseEnterTitleOrOverlayState(false);
    }
  }

  toggle(event?: Event) {
    if (event) {
      event.preventDefault();
    }

    if (this.zDisabled()) return;

    this.submenuService.toggleOpen();
    this.zOpenChange.emit(this.isOpen());
  }

  open() {
    if (this.zDisabled()) return;
    this.submenuService.setMouseEnterTitleOrOverlayState(true);
  }

  close() {
    this.submenuService.forceClose();
    // this.zOpenChange.emit(false);
  }

  setOpen(open: boolean) {
    if (open) {
      this.open();
    } else {
      this.close();
    }
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
import { Injectable, signal, inject, DestroyRef } from '@angular/core';
import { Subject, combineLatest } from 'rxjs';
import { map, auditTime, distinctUntilChanged, startWith } from 'rxjs/operators';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ZardMenuVariants } from './menu.variants';

@Injectable()
export class ZardSubmenuService {
  private readonly parentService = inject(ZardSubmenuService, { optional: true, skipSelf: true });
  private readonly destroyRef = inject(DestroyRef);

  // Subjects for RxJS-based state management  
  private readonly mouseEnterTitle$ = new Subject<boolean>();
  private readonly mouseEnterOverlay$ = new Subject<boolean>();
  private readonly childOpen$ = new Subject<boolean>();

  // Signals for basic state
  private readonly _mode = signal<ZardMenuVariants['zMode']>('vertical');
  private readonly _isOpen = signal(false);
  private readonly _level = signal<number>(1);

  // Computed observables following ng-zorro pattern
  private readonly isCurrentSubMenuOpen$ = combineLatest([
    this.mouseEnterTitle$.pipe(startWith(false)),
    this.mouseEnterOverlay$.pipe(startWith(false))
  ]).pipe(
    map(([titleHover, overlayHover]) => titleHover || overlayHover),
    distinctUntilChanged(),
  );

  private readonly isChildSubMenuOpen$ = this.childOpen$.pipe(startWith(false), distinctUntilChanged());

  // Combined state with debouncing like ng-zorro
  readonly shouldOpen$ = combineLatest([this.isChildSubMenuOpen$, this.isCurrentSubMenuOpen$]).pipe(
    map(([isChildOpen, isCurrentOpen]) => isChildOpen || isCurrentOpen),
    auditTime(150), // Debounce like ng-zorro
    distinctUntilChanged(),
    takeUntilDestroyed(this.destroyRef),
  );

  // Read-only signals
  readonly mode = this._mode.asReadonly();
  readonly isOpen = this._isOpen.asReadonly();
  readonly level = this._level.asReadonly();

  constructor() {
    // Set level based on parent service
    if (this.parentService) {
      const parentLevel = this.parentService.level();
      this._level.set(parentLevel + 1);
    } else {
      this._level.set(1);
    }

    // Subscribe to the combined state
    this.shouldOpen$.subscribe(shouldOpen => {
      this._isOpen.set(shouldOpen);
      // Notify parent service
      if (this.parentService) {
        this.parentService.setChildOpen(shouldOpen);
      }
    });
  }

  updateMode(mode: ZardMenuVariants['zMode']): void {
    this._mode.set(mode);
  }

  // Methods following ng-zorro pattern
  setMouseEnterTitleOrOverlayState(value: boolean): void {
    if (this._mode() !== 'inline') {
      this.mouseEnterTitle$.next(value);
    }
  }

  setMouseEnterOverlayState(value: boolean): void {
    if (this._mode() !== 'inline') {
      this.mouseEnterOverlay$.next(value);
    }
  }

  setChildOpen(open: boolean): void {
    this.childOpen$.next(open);
  }

  // Manual open/close for click interactions
  toggleOpen(): void {
    const currentOpen = this._isOpen();
    this._isOpen.set(!currentOpen);
    this.mouseEnterTitle$.next(!currentOpen);
  }

  forceClose(): void {
    this._isOpen.set(false);
    this.mouseEnterTitle$.next(false);
    this.mouseEnterOverlay$.next(false);
  }
}
```

