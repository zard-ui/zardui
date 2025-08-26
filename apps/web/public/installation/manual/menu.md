

```angular-ts title="menu.variants.ts" copyButton showLineNumbers
import { cva, VariantProps } from 'class-variance-authority';

export const menuVariants = cva('flex flex-col space-y-1 p-1');

export const menuContentVariants = cva(
  'z-50 min-w-[8rem] overflow-hidden rounded-md border bg-popover p-2 text-popover-foreground shadow-lg animate-in data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2',
);

export const menuItemVariants = cva(
  'relative flex w-full cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50 text-left',
  {
    variants: {
      inset: {
        true: 'pl-8',
        false: '',
      },
    },
    defaultVariants: {
      inset: false,
    },
  },
);

export const menuGroupVariants = cva('');

export const menuLabelVariants = cva('px-2 py-1.5 text-sm font-semibold', {
  variants: {
    inset: {
      true: 'pl-8',
      false: '',
    },
  },
  defaultVariants: {
    inset: false,
  },
});

export const menuSeparatorVariants = cva('-mx-1 my-1 h-px bg-muted');

export const menuShortcutVariants = cva('ml-auto text-xs tracking-widest text-muted-foreground');

export const menuCheckboxItemVariants = cva(
  'relative flex cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50',
);

export const menuRadioItemVariants = cva(
  'relative flex cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50',
);

export const menuSubContentVariants = cva(
  'z-50 min-w-[8rem] overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-lg data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2',
);

export const menuSubTriggerVariants = cva('flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none focus:bg-accent data-[state=open]:bg-accent', {
  variants: {
    inset: {
      true: 'pl-8',
      false: '',
    },
  },
  defaultVariants: {
    inset: false,
  },
});

export type ZardMenuVariants = VariantProps<typeof menuVariants>;
export type ZardMenuContentVariants = VariantProps<typeof menuContentVariants>;
export type ZardMenuItemVariants = VariantProps<typeof menuItemVariants>;
export type ZardMenuLabelVariants = VariantProps<typeof menuLabelVariants>;
export type ZardMenuSubTriggerVariants = VariantProps<typeof menuSubTriggerVariants>;

```



```angular-ts title="menu-directive.ts" copyButton showLineNumbers
import { ClassValue } from 'class-variance-authority/dist/types';

import { CdkMenu, CdkMenuGroup } from '@angular/cdk/menu';
import { computed, Directive, input } from '@angular/core';

import { mergeClasses } from '../../shared/utils/utils';
import { menuContentVariants, menuGroupVariants, menuVariants } from './menu.variants';

@Directive({
  selector: '[z-menu-content]',
  standalone: true,
  hostDirectives: [CdkMenu],
  host: {
    role: 'menu',
    '[attr.aria-orientation]': '"vertical"',
    '[class]': 'classes()',
  },
})
export class ZardMenuContentDirective {
  readonly class = input<ClassValue>('');

  protected readonly classes = computed(() => mergeClasses(menuContentVariants(), this.class()));
}

@Directive({
  selector: '[z-menu-group]',
  standalone: true,
  hostDirectives: [CdkMenuGroup],
  host: {
    role: 'group',
    '[class]': 'classes()',
  },
})
export class ZardMenuGroupDirective {
  readonly class = input<ClassValue>('');

  protected readonly classes = computed(() => mergeClasses(menuGroupVariants(), this.class()));
}

@Directive({
  selector: 'z-menu, [z-menu],[z-submenu]',
  standalone: true,
  hostDirectives: [CdkMenu],
  host: {
    '[class]': 'classes()',
  },
})
export class ZardMenuDirective {
  readonly class = input<ClassValue>('');

  protected readonly classes = computed(() => mergeClasses(menuVariants(), this.class()));
}

```



```angular-ts title="menu-item.directive.ts" copyButton showLineNumbers
import { BooleanInput } from '@angular/cdk/coercion';
import { CdkMenuItem } from '@angular/cdk/menu';
import { booleanAttribute, computed, Directive, effect, inject, input, signal } from '@angular/core';
import { ClassValue } from 'class-variance-authority/dist/types';
import { mergeClasses } from '../../shared/utils/utils';
import { menuItemVariants, ZardMenuItemVariants } from './menu.variants';

@Directive({
  selector: 'button[z-menu-item], [z-menu-item]',
  standalone: true,
  hostDirectives: [
    {
      directive: CdkMenuItem,
      outputs: ['cdkMenuItemTriggered: menuItemTriggered'],
    },
  ],
  host: {
    role: 'menuitem',
    tabindex: '-1',
    '[class]': 'classes()',
    '[attr.data-orientation]': "'horizontal'",
    '[attr.data-state]': 'isOpenState()',
    '[attr.aria-disabled]': "disabledState() ? '' : undefined",
    '[attr.data-disabled]': "disabledState() ? '' : undefined",
    '[attr.data-highlighted]': "highlightedState() ? '' : undefined",

    '(focus)': 'onFocus()',
    '(blur)': 'onBlur()',
    '(pointermove)': 'onPointerMove($event)',
  },
})
export class ZardMenuItemDirective {
  private readonly cdkMenuItem = inject(CdkMenuItem, { host: true });

  readonly disabled = input<boolean, BooleanInput>(false, { transform: booleanAttribute });
  readonly inset = input<ZardMenuItemVariants['inset']>(false);
  readonly class = input<ClassValue>('');

  // readonly onSelect = outputFromObservable(this.cdkMenuItem.triggered);

  private readonly isFocused = signal(false);

  protected readonly disabledState = computed(() => this.disabled());

  protected readonly isOpenState = signal(false);

  protected readonly highlightedState = computed(() => this.isFocused());

  protected readonly classes = computed(() =>
    mergeClasses(
      menuItemVariants({
        inset: this.inset(),
      }),
      this.class(),
    ),
  );

  constructor() {
    effect(() => {
      this.cdkMenuItem.disabled = this.disabled();
      this.isOpenState.set(this.cdkMenuItem.isMenuOpen());
    });
  }

  onFocus(): void {
    if (!this.disabled()) {
      this.isFocused.set(true);
    }
  }

  onBlur(): void {
    this.isFocused.set(false);
  }

  onPointerMove(event: PointerEvent) {
    if (event.defaultPrevented) return;

    if (!(event.pointerType === 'mouse')) return;

    if (!this.disabled()) {
      const item = event.currentTarget;
      (item as HTMLElement)?.focus({ preventScroll: true });
    }
  }
}

```



```angular-ts title="menu-trigger.directive.ts" copyButton showLineNumbers
import { BooleanInput, NumberInput } from '@angular/cdk/coercion';
import { CdkMenuTrigger } from '@angular/cdk/menu';
import { booleanAttribute, computed, Directive, effect, inject, input, numberAttribute, SimpleChange, untracked } from '@angular/core';

export type ZardMenuAlign = 'start' | 'center' | 'end';
export type ZardMenuSide = 'top' | 'right' | 'bottom' | 'left';

@Directive({
  selector: '[zMenuTrigger]',
  standalone: true,
  hostDirectives: [
    {
      directive: CdkMenuTrigger,
      inputs: ['cdkMenuTriggerFor: menuTriggerFor', 'cdkMenuPosition: menuPosition'],
    },
  ],
  host: {
    role: 'menuitem',
    '[attr.aria-haspopup]': "'menu'",
    '[attr.aria-expanded]': 'cdkTrigger.isOpen()',
    '[attr.data-state]': "cdkTrigger.isOpen() ? 'open': 'closed'",
    '[attr.data-disabled]': "disabled() ? '' : undefined",

    '(pointerdown)': 'onPointerDown($event)',
  },
})
export class ZardMenuTriggerDirective {
  protected readonly cdkTrigger = inject(CdkMenuTrigger, { host: true });

  readonly zMenuTriggerFor = input.required();

  readonly side = input<ZardMenuSide>();
  readonly align = input<ZardMenuAlign>();
  readonly sideOffset = input<number, NumberInput>(NaN, {
    transform: numberAttribute,
  });

  readonly alignOffset = input<number, NumberInput>(NaN, {
    transform: numberAttribute,
  });

  readonly disabled = input<boolean, BooleanInput>(false, {
    transform: booleanAttribute,
  });

  private enablePositions = false;

  // TODO
  private readonly positions = computed(() => this.computePositions());

  private computePositions() {
    if (this.align() || this.sideOffset() || this.alignOffset() || this.side()) {
      this.enablePositions = true;
    }

    const side = this.side() || 'bottom';
    const align = this.align() || 'center';
    const sideOffset = this.sideOffset() || 0;
    const alignOffset = this.alignOffset() || 0;

    let originX: 'start' | 'center' | 'end' = 'center';
    let originY: 'top' | 'center' | 'bottom' = 'center';
    let overlayX: 'start' | 'center' | 'end' = 'center';
    let overlayY: 'top' | 'center' | 'bottom' = 'center';
    let offsetX = 0;
    let offsetY = 0;

    switch (side) {
      case 'top':
        originY = 'top';
        overlayY = 'bottom';
        offsetY = -sideOffset;
        break;
      case 'bottom':
        originY = 'bottom';
        overlayY = 'top';
        offsetY = sideOffset;
        break;
      case 'left':
        originX = 'start';
        overlayX = 'end';
        offsetX = -sideOffset;
        break;
      case 'right':
        originX = 'end';
        overlayX = 'start';
        offsetX = sideOffset;
        break;
    }

    switch (align) {
      case 'start':
        if (side === 'top' || side === 'bottom') {
          originX = 'start';
          overlayX = 'start';
          offsetX = alignOffset;
        } else {
          originY = 'top';
          overlayY = 'top';
          offsetY = alignOffset;
        }
        break;
      case 'end':
        if (side === 'top' || side === 'bottom') {
          originX = 'end';
          overlayX = 'end';
          offsetX = -alignOffset;
        } else {
          originY = 'bottom';
          overlayY = 'bottom';
          offsetY = -alignOffset;
        }
        break;
      case 'center':
      default:
        if (side === 'top' || side === 'bottom') {
          originX = 'center';
          overlayX = 'center';
        } else {
          originY = 'center';
          overlayY = 'center';
        }
        break;
    }

    return {
      originX,
      originY,
      overlayX,
      overlayY,
      offsetX,
      offsetY,
    };
  }

  constructor() {
    this.onMenuPositionEffect();
  }

  /** @ignore */
  onPointerDown($event: MouseEvent) {
    // only call handler if it's the left button (mousedown gets triggered by all mouse buttons)
    // but not when the control key is pressed (avoiding MacOS right click)
    if (!this.disabled() && $event.button === 0 && !$event.ctrlKey) {
      /* empty */
      if (!this.cdkTrigger.isOpen()) {
        // prevent trigger focusing when opening
        // this allows the content to be given focus without competition
        $event.preventDefault();
      }
    }
  }

  private onMenuPositionEffect() {
    effect(() => {
      const positions = this.positions();

      untracked(() => {
        if (this.enablePositions) {
          this.setMenuPositions([positions]);
        }
      });
    });
  }

  private setMenuPositions(positions: CdkMenuTrigger['menuPosition']) {
    const prevMenuPosition = this.cdkTrigger.menuPosition;
    this.cdkTrigger.menuPosition = positions;
    this.fireNgOnChanges('menuPosition', this.cdkTrigger.menuPosition, prevMenuPosition);
  }

  private fireNgOnChanges<K extends keyof CdkMenuTrigger, V extends CdkMenuTrigger[K]>(input: K, currentValue: V, previousValue: V, firstChange = false) {
    this.cdkTrigger.ngOnChanges({
      [input]: new SimpleChange(previousValue, currentValue, firstChange),
    });
  }
}

```



```angular-ts title="menu.module.ts" copyButton showLineNumbers
import { NgModule } from '@angular/core';

import { ZardMenuContentDirective, ZardMenuDirective, ZardMenuGroupDirective } from './menu-directive';
import { ZardMenuItemDirective } from './menu-item.directive';
import { ZardMenuTriggerDirective } from './menu-trigger.directive';

const MENU_COMPONENTS = [ZardMenuDirective, ZardMenuGroupDirective, ZardMenuContentDirective, ZardMenuItemDirective, ZardMenuTriggerDirective];

@NgModule({
  imports: [MENU_COMPONENTS],
  exports: [MENU_COMPONENTS],
})
export class ZardMenuModule {}

```

