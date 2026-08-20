---
title: Dropdown
description: Displays a menu to the user — such as a set of actions or functions — triggered by a button.
---

# Dropdown

Displays a menu to the user — such as a set of actions or functions — triggered by a button.

## Installation

### CLI

```bash
npx zard-cli@latest add dropdown
```

### Manual

```angular-ts
import { Overlay, OverlayModule, OverlayPositionBuilder, type OverlayRef } from '@angular/cdk/overlay';
import { TemplatePortal } from '@angular/cdk/portal';
import { isPlatformBrowser } from '@angular/common';
import {
  booleanAttribute,
  ChangeDetectionStrategy,
  Component,
  computed,
  ElementRef,
  inject,
  input,
  type OnDestroy,
  output,
  PLATFORM_ID,
  signal,
  type TemplateRef,
  viewChild,
  ViewContainerRef,
  ViewEncapsulation,
} from '@angular/core';

import type { ClassValue } from 'clsx';

import { ZardIdDirective } from '@/shared/core/directives/id.directive';
import { mergeClasses } from '@/shared/utils/merge-classes';

import { dropdownContentVariants } from './dropdown.variants';

@Component({
  selector: 'z-dropdown-menu',
  imports: [OverlayModule, ZardIdDirective],
  template: `
    <!-- Dropdown Trigger -->
    <div
      #triggerContainer
      zardId="dropdown-trigger"
      #zId="zardId"
      [id]="zId.id()"
      data-slot="dropdown-menu-trigger"
      (click)="toggle()"
      (keydown.{enter,space}.prevent)="toggle()"
      [attr.aria-haspopup]="'menu'"
      [attr.aria-expanded]="isOpen()"
      [attr.aria-disabled]="isDisabled()"
      tabindex="0"
    >
      <ng-content select="[dropdown-trigger]" />
    </div>

    <!-- Template for overlay content -->
    <ng-template #dropdownTemplate>
      <div
        [class]="contentClasses()"
        role="menu"
        data-slot="dropdown-menu-content"
        [attr.data-state]="'open'"
        (click)="onDropdownClick($event)"
        (keydown.{arrowdown,arrowup,enter,space,escape,home,end}.prevent)="onDropdownKeydown($event)"
        tabindex="-1"
      >
        <ng-content />
      </div>
    </ng-template>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: {
    class: 'relative inline-block text-left',
    'data-slot': 'dropdown-menu',
    '[attr.data-state]': 'isOpen() ? "open" : "closed"',
    '(document:click)': 'onDocumentClick($event)',
  },
  exportAs: 'zDropdownMenu',
})
export class ZardDropdownMenuComponent implements OnDestroy {
  private elementRef = inject(ElementRef);
  private overlay = inject(Overlay);
  private overlayPositionBuilder = inject(OverlayPositionBuilder);
  private viewContainerRef = inject(ViewContainerRef);
  private platformId = inject(PLATFORM_ID);

  readonly dropdownTemplate = viewChild.required<TemplateRef<unknown>>('dropdownTemplate');
  readonly triggerContainer = viewChild.required<ElementRef<HTMLElement>>('triggerContainer');

  private overlayRef?: OverlayRef;
  private portal?: TemplatePortal;

  readonly class = input<ClassValue>('');
  readonly disabled = input(false, { transform: booleanAttribute });
  readonly zDisabled = input<boolean | undefined, unknown>(undefined, {
    alias: 'zDisabled',
    transform: value => (value === undefined ? undefined : booleanAttribute(value)),
  });

  readonly openChange = output<boolean>();

  readonly isOpen = signal(false);
  readonly focusedIndex = signal<number>(-1);

  protected readonly isDisabled = computed(() => this.zDisabled() ?? this.disabled());
  protected readonly contentClasses = computed(() => mergeClasses(dropdownContentVariants(), this.class()));

  ngOnDestroy() {
    this.destroyOverlay();
  }

  onDocumentClick(event: Event) {
    if (!this.elementRef.nativeElement.contains(event.target as Node)) {
      this.close();
    }
  }

  onDropdownKeydown(e: Event) {
    const items = this.getDropdownItems();
    const { key } = e as KeyboardEvent;

    switch (key) {
      case 'ArrowDown':
        this.navigateItems(1, items);
        break;
      case 'ArrowUp':
        this.navigateItems(-1, items);
        break;
      case 'Enter':
      case ' ':
        this.selectFocusedItem(items);
        break;
      case 'Escape':
        this.close();
        this.focusTrigger();
        break;
      case 'Home':
        this.focusFirstItem(items);
        break;
      case 'End':
        this.focusLastItem(items);
        break;
    }
  }

  onDropdownClick(event: Event) {
    const target = event.target as HTMLElement;
    const item = target.closest<HTMLElement>(
      'z-dropdown-menu-item, [z-dropdown-menu-item], z-dropdown-menu-checkbox-item, [z-dropdown-menu-checkbox-item], z-dropdown-menu-radio-item, [z-dropdown-menu-radio-item]',
    );

    if (!item || item.dataset['disabled'] !== undefined) {
      return;
    }

    setTimeout(() => {
      this.close();
      this.focusTrigger();
    }, 0);
  }

  toggle() {
    if (this.isDisabled()) {
      return;
    }
    if (this.isOpen()) {
      this.close();
    } else {
      this.open();
    }
  }

  open() {
    if (this.isOpen()) {
      return;
    }

    if (!this.overlayRef) {
      this.createOverlay();
    }

    if (!this.overlayRef) {
      return;
    }

    this.portal = new TemplatePortal(this.dropdownTemplate(), this.viewContainerRef);
    this.overlayRef.attach(this.portal);
    this.isOpen.set(true);
    this.openChange.emit(true);

    setTimeout(() => {
      this.focusDropdown();
    }, 0);
  }

  close() {
    if (this.overlayRef?.hasAttached()) {
      this.overlayRef.detach();
    }
    this.isOpen.set(false);
    this.focusedIndex.set(-1);
    this.openChange.emit(false);
  }

  private createOverlay() {
    if (this.overlayRef) {
      return;
    }

    if (isPlatformBrowser(this.platformId)) {
      try {
        const positionStrategy = this.overlayPositionBuilder
          .flexibleConnectedTo(this.elementRef)
          .withPositions([
            {
              originX: 'start',
              originY: 'bottom',
              overlayX: 'start',
              overlayY: 'top',
              offsetY: 4,
            },
            {
              originX: 'start',
              originY: 'top',
              overlayX: 'start',
              overlayY: 'bottom',
              offsetY: -4,
            },
          ])
          .withPush(false);

        this.overlayRef = this.overlay.create({
          positionStrategy,
          hasBackdrop: false,
          scrollStrategy: this.overlay.scrollStrategies.reposition(),
          minWidth: 200,
          maxHeight: 400,
        });
      } catch (error) {
        console.error('Error creating overlay:', error);
      }
    }
  }

  private destroyOverlay() {
    if (this.overlayRef) {
      this.overlayRef.dispose();
      this.overlayRef = undefined;
    }
  }

  private getDropdownItems(): HTMLElement[] {
    if (!this.overlayRef?.hasAttached()) {
      return [];
    }
    const dropdownElement = this.overlayRef.overlayElement;
    return Array.from(
      dropdownElement.querySelectorAll<HTMLElement>(
        'z-dropdown-menu-item, [z-dropdown-menu-item], z-dropdown-menu-checkbox-item, [z-dropdown-menu-checkbox-item], z-dropdown-menu-radio-item, [z-dropdown-menu-radio-item]',
      ),
    ).filter(item => item.dataset['disabled'] === undefined);
  }

  private navigateItems(direction: number, items: HTMLElement[]) {
    if (items.length === 0) {
      return;
    }

    const currentIndex = this.focusedIndex();
    let nextIndex: number;

    if (currentIndex === -1) {
      nextIndex = direction > 0 ? 0 : items.length - 1;
    } else {
      nextIndex = currentIndex + direction;
      if (nextIndex < 0) {
        nextIndex = items.length - 1;
      } else if (nextIndex >= items.length) {
        nextIndex = 0;
      }
    }

    this.focusedIndex.set(nextIndex);
    this.updateItemFocus(items, nextIndex);
  }

  private selectFocusedItem(items: HTMLElement[]) {
    const currentIndex = this.focusedIndex();
    if (currentIndex >= 0 && currentIndex < items.length) {
      const item = items[currentIndex];
      item.click();
    }
  }

  private focusFirstItem(items: HTMLElement[]) {
    if (items.length > 0) {
      this.focusedIndex.set(0);
      this.updateItemFocus(items, 0);
    }
  }

  private focusLastItem(items: HTMLElement[]) {
    if (items.length > 0) {
      const lastIndex = items.length - 1;
      this.focusedIndex.set(lastIndex);
      this.updateItemFocus(items, lastIndex);
    }
  }

  private updateItemFocus(items: HTMLElement[], focusedIndex: number) {
    items.forEach((item, index) => {
      if (index === focusedIndex) {
        item.focus();
        item.setAttribute('data-highlighted', '');
      } else {
        item.removeAttribute('data-highlighted');
      }
    });
  }

  private focusDropdown() {
    if (this.overlayRef?.hasAttached()) {
      const dropdownElement = this.overlayRef.overlayElement.querySelector('[role="menu"]') as HTMLElement;
      if (dropdownElement) {
        dropdownElement.focus();
      }
    }
  }

  private focusTrigger() {
    this.triggerContainer().nativeElement.focus();
  }
}
```

```angular-ts
import { cva, type VariantProps } from 'class-variance-authority';

export const dropdownContentVariants = cva([
  'z-50 min-w-32 max-h-96 overflow-x-hidden overflow-y-auto rounded-md border bg-popover p-1 text-popover-foreground',
  'shadow-md outline-none animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95',
]);

export const dropdownItemVariants = cva(
  'relative flex cursor-default select-none items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus-visible:bg-accent focus-visible:text-accent-foreground data-highlighted:bg-accent data-highlighted:text-accent-foreground data-disabled:pointer-events-none data-disabled:opacity-50 data-disabled:cursor-not-allowed [&_svg:not([class*=size-])]:size-4 [&_svg]:pointer-events-none [&_svg]:shrink-0',
  {
    variants: {
      variant: {
        default: '',
        destructive:
          'text-destructive hover:bg-destructive/10 focus:bg-destructive/10 dark:hover:bg-destructive/20 dark:focus:bg-destructive/20 focus:text-destructive',
      },
      inset: {
        true: 'pl-8',
        false: '',
      },
    },
    defaultVariants: {
      variant: 'default',
      inset: false,
    },
  },
);

export const dropdownLabelVariants = cva(
  'relative flex items-center px-2 py-1.5 text-sm font-medium text-muted-foreground',
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

export type ZardDropdownItemVariants = VariantProps<typeof dropdownItemVariants>;
export type ZardDropdownItemTypeVariants = NonNullable<ZardDropdownItemVariants['variant']>;
```

```angular-ts
import {
  booleanAttribute,
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
  ViewEncapsulation,
} from '@angular/core';

import type { ClassValue } from 'clsx';

import { mergeClasses } from '@/shared/utils/merge-classes';

import { ZardDropdownService } from './dropdown.service';
import { dropdownItemVariants, type ZardDropdownItemTypeVariants } from './dropdown.variants';

@Component({
  selector: 'z-dropdown-menu-item, [z-dropdown-menu-item]',
  template: `
    <ng-content />
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: {
    '[class]': 'classes()',
    'data-slot': 'dropdown-menu-item',
    '[attr.data-disabled]': 'isDisabled() || null',
    '[attr.data-variant]': 'itemVariant()',
    '[attr.data-inset]': 'isInset() || null',
    '[attr.aria-disabled]': 'isDisabled()',
    '(click.prevent-with-stop)': 'onClick()',
    role: 'menuitem',
    tabindex: '-1',
  },
  exportAs: 'zDropdownMenuItem',
})
export class ZardDropdownMenuItemComponent {
  private readonly dropdownService = inject(ZardDropdownService);

  readonly variant = input<ZardDropdownItemTypeVariants>('default');
  readonly zType = input<ZardDropdownItemTypeVariants | undefined>(undefined, { alias: 'zType' });
  readonly zVariant = input<ZardDropdownItemTypeVariants | undefined>(undefined, { alias: 'zVariant' });
  readonly inset = input(false, { transform: booleanAttribute });
  readonly zInset = input<boolean | undefined, unknown>(undefined, {
    alias: 'zInset',
    transform: value => (value === undefined ? undefined : booleanAttribute(value)),
  });

  readonly disabled = input(false, { transform: booleanAttribute });
  readonly zDisabled = input<boolean | undefined, unknown>(undefined, {
    alias: 'zDisabled',
    transform: value => (value === undefined ? undefined : booleanAttribute(value)),
  });

  readonly class = input<ClassValue>('');

  onClick() {
    if (this.isDisabled()) {
      return;
    }

    setTimeout(() => {
      this.dropdownService.closeAndFocusTrigger();
    }, 0);
  }

  protected readonly isDisabled = computed(() => this.zDisabled() ?? this.disabled());
  protected readonly itemVariant = computed(() => this.zType() ?? this.zVariant() ?? this.variant());
  protected readonly isInset = computed(() => this.zInset() ?? this.inset());

  protected readonly classes = computed(() =>
    mergeClasses(
      dropdownItemVariants({
        variant: this.itemVariant(),
        inset: this.isInset(),
      }),
      this.class(),
    ),
  );
}
```

```angular-ts
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  numberAttribute,
  type TemplateRef,
  viewChild,
  ViewEncapsulation,
} from '@angular/core';

import type { ClassValue } from 'clsx';

import type { ZardDropdownAlign, ZardDropdownSide } from '@/shared/components/dropdown/dropdown-positions';
import { dropdownContentVariants } from '@/shared/components/dropdown/dropdown.variants';
import { mergeClasses } from '@/shared/utils/merge-classes';

@Component({
  selector: 'z-dropdown-menu-content',
  template: `
    <ng-template #contentTemplate>
      <div
        [class]="contentClasses()"
        role="menu"
        data-slot="dropdown-menu-content"
        data-state="open"
        tabindex="-1"
        aria-orientation="vertical"
      >
        <ng-content />
      </div>
    </ng-template>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: {
    '[style.display]': '"none"',
  },
  exportAs: 'zDropdownMenuContent',
})
export class ZardDropdownMenuContentComponent {
  readonly contentTemplate = viewChild.required<TemplateRef<unknown>>('contentTemplate');

  readonly class = input<ClassValue>('');

  /** Edge of the trigger the menu opens from. Same meaning as Radix's `side`. */
  readonly zSide = input<ZardDropdownSide>('bottom');
  /** Alignment along that edge. Same meaning as Radix's `align`. */
  readonly zAlign = input<ZardDropdownAlign>('start');
  /** Gap between trigger and menu, in pixels. Same meaning as Radix's `sideOffset`. */
  readonly zSideOffset = input(4, { transform: numberAttribute });

  protected readonly contentClasses = computed(() => mergeClasses(dropdownContentVariants(), this.class()));
}
```

```angular-ts
import type { ConnectedPosition } from '@angular/cdk/overlay';

/** Which edge of the trigger the menu is anchored to. Mirrors Radix's `side`. */
export type ZardDropdownSide = 'top' | 'right' | 'bottom' | 'left';

/** How the menu is aligned along that edge. Mirrors Radix's `align`. */
export type ZardDropdownAlign = 'start' | 'center' | 'end';

/** The side the menu flips to when the preferred one does not fit. */
const OPPOSITE_SIDE: Record<ZardDropdownSide, ZardDropdownSide> = {
  top: 'bottom',
  bottom: 'top',
  left: 'right',
  right: 'left',
};

const isVertical = (side: ZardDropdownSide) => side === 'top' || side === 'bottom';

/**
 * Translates a Radix-style `side`/`align` pair into a CDK connected position.
 *
 * `side` decides the axis the menu is pushed along, `align` decides where it sits on the other axis
 * — the same split Radix uses, so a shadcn snippet can be transcribed one to one.
 */
function toConnectedPosition(side: ZardDropdownSide, align: ZardDropdownAlign, offset: number): ConnectedPosition {
  const alignPair = {
    start: 'start',
    center: 'center',
    end: 'end',
  } as const;

  if (isVertical(side)) {
    return {
      originX: alignPair[align],
      originY: side === 'bottom' ? 'bottom' : 'top',
      overlayX: alignPair[align],
      overlayY: side === 'bottom' ? 'top' : 'bottom',
      offsetY: side === 'bottom' ? offset : -offset,
    };
  }

  const verticalAlign = { start: 'top', center: 'center', end: 'bottom' } as const;

  return {
    originX: side === 'right' ? 'end' : 'start',
    originY: verticalAlign[align],
    overlayX: side === 'right' ? 'start' : 'end',
    overlayY: verticalAlign[align],
    offsetX: side === 'right' ? offset : -offset,
  };
}

/**
 * The preferred position followed by its fallbacks: the opposite side first (a flip keeps the menu
 * attached to the trigger), then the remaining alignments on the preferred side.
 */
export function buildDropdownPositions(
  side: ZardDropdownSide,
  align: ZardDropdownAlign,
  offset: number,
): ConnectedPosition[] {
  const fallbackAligns: ZardDropdownAlign[] = (['start', 'center', 'end'] as const).filter(value => value !== align);

  return [
    toConnectedPosition(side, align, offset),
    toConnectedPosition(OPPOSITE_SIDE[side], align, offset),
    ...fallbackAligns.map(fallbackAlign => toConnectedPosition(side, fallbackAlign, offset)),
    ...fallbackAligns.map(fallbackAlign => toConnectedPosition(OPPOSITE_SIDE[side], fallbackAlign, offset)),
  ];
}
```

```angular-ts
import {
  booleanAttribute,
  ChangeDetectionStrategy,
  Component,
  computed,
  forwardRef,
  inject,
  InjectionToken,
  input,
  model,
  ViewEncapsulation,
} from '@angular/core';

import type { ClassValue } from 'clsx';

import { mergeClasses } from '@/shared/utils/merge-classes';

import { ZardDropdownService } from './dropdown.service';
import { dropdownItemVariants, dropdownLabelVariants, type ZardDropdownItemTypeVariants } from './dropdown.variants';

interface ZardDropdownRadioGroup {
  zValue(): string | undefined;
  select(value: string): void;
}

const ZARD_DROPDOWN_RADIO_GROUP = new InjectionToken<ZardDropdownRadioGroup>('ZARD_DROPDOWN_RADIO_GROUP');

const optionalBooleanAttribute = (value: unknown) => (value === undefined ? undefined : booleanAttribute(value));

@Component({
  selector: 'z-dropdown-menu-group, [z-dropdown-menu-group]',
  template: `
    <ng-content />
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: {
    role: 'group',
    'data-slot': 'dropdown-menu-group',
    '[class]': 'classes()',
  },
  exportAs: 'zDropdownMenuGroup',
})
export class ZardDropdownMenuGroupComponent {
  readonly class = input<ClassValue>('');

  // `block` mirrors shadcn, which renders the group as a `<div>`.
  protected readonly classes = computed(() => mergeClasses('block', this.class()));
}

@Component({
  selector: 'z-dropdown-menu-separator, [z-dropdown-menu-separator]',
  template: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: {
    role: 'separator',
    'aria-orientation': 'horizontal',
    'data-slot': 'dropdown-menu-separator',
    '[class]': 'classes()',
  },
  exportAs: 'zDropdownMenuSeparator',
})
export class ZardDropdownMenuSeparatorComponent {
  readonly class = input<ClassValue>('');

  // `block`: the separator renders as `<z-dropdown-menu-separator>`, a custom element that is
  // `display: inline` by default — an inline box has no height, so the rule would draw nothing.
  protected readonly classes = computed(() => mergeClasses('bg-border -mx-1 my-1 block h-px', this.class()));
}

@Component({
  selector: 'z-dropdown-menu-label, [z-dropdown-menu-label]',
  template: `
    <ng-content />
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: {
    'data-slot': 'dropdown-menu-label',
    '[class]': 'classes()',
    '[attr.data-inset]': 'inset() || null',
  },
  exportAs: 'zDropdownMenuLabel',
})
export class ZardDropdownMenuLabelComponent {
  readonly class = input<ClassValue>('');
  readonly inset = input(false, { transform: booleanAttribute });

  protected readonly classes = computed(() =>
    mergeClasses(dropdownLabelVariants({ inset: this.inset() }), this.class()),
  );
}

@Component({
  selector: 'z-dropdown-menu-shortcut, [z-dropdown-menu-shortcut]',
  template: `
    <ng-content />
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: {
    'aria-hidden': 'true',
    'data-slot': 'dropdown-menu-shortcut',
    '[class]': 'classes()',
  },
  exportAs: 'zDropdownMenuShortcut',
})
export class ZardDropdownMenuShortcutComponent {
  readonly class = input<ClassValue>('');

  protected readonly classes = computed(() =>
    mergeClasses('text-muted-foreground ml-auto text-xs tracking-widest', this.class()),
  );
}

@Component({
  selector: 'z-dropdown-menu-checkbox-item, [z-dropdown-menu-checkbox-item]',
  template: `
    <span class="pointer-events-none absolute left-2 flex size-3.5 items-center justify-center">
      @if (zChecked()) {
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" class="size-4">
          <path d="M20 6 9 17l-5-5" />
        </svg>
      }
    </span>
    <ng-content />
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: {
    '[class]': 'classes()',
    role: 'menuitemcheckbox',
    tabindex: '-1',
    'data-slot': 'dropdown-menu-checkbox-item',
    '[attr.aria-checked]': 'zChecked()',
    '[attr.aria-disabled]': 'isDisabled()',
    '[attr.data-state]': 'zChecked() ? "checked" : "unchecked"',
    '[attr.data-disabled]': 'isDisabled() || null',
    '[attr.data-variant]': 'itemVariant()',
    '(click.prevent-with-stop)': 'onClick()',
  },
  exportAs: 'zDropdownMenuCheckboxItem',
})
export class ZardDropdownMenuCheckboxItemComponent {
  private readonly dropdownService = inject(ZardDropdownService);

  readonly zChecked = model(false);
  readonly disabled = input(false, { transform: booleanAttribute });
  readonly zDisabled = input<boolean | undefined, unknown>(undefined, {
    alias: 'zDisabled',
    transform: optionalBooleanAttribute,
  });

  readonly variant = input<ZardDropdownItemTypeVariants>('default');
  readonly zType = input<ZardDropdownItemTypeVariants | undefined>(undefined, { alias: 'zType' });
  readonly zVariant = input<ZardDropdownItemTypeVariants | undefined>(undefined, { alias: 'zVariant' });
  readonly class = input<ClassValue>('');

  protected readonly isDisabled = computed(() => this.zDisabled() ?? this.disabled());
  protected readonly itemVariant = computed(() => this.zType() ?? this.zVariant() ?? this.variant());
  protected readonly classes = computed(() =>
    mergeClasses(dropdownItemVariants({ variant: this.itemVariant(), inset: true }), this.class()),
  );

  protected onClick() {
    if (this.isDisabled()) {
      return;
    }

    this.zChecked.set(!this.zChecked());
    setTimeout(() => this.dropdownService.closeAndFocusTrigger(), 0);
  }
}

@Component({
  selector: 'z-dropdown-menu-radio-group, [z-dropdown-menu-radio-group]',
  template: `
    <ng-content />
  `,
  providers: [
    { provide: ZARD_DROPDOWN_RADIO_GROUP, useExisting: forwardRef(() => ZardDropdownMenuRadioGroupComponent) },
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: {
    role: 'group',
    'data-slot': 'dropdown-menu-radio-group',
    '[class]': 'classes()',
  },
  exportAs: 'zDropdownMenuRadioGroup',
})
export class ZardDropdownMenuRadioGroupComponent implements ZardDropdownRadioGroup {
  readonly zValue = model<string | undefined>(undefined);
  readonly class = input<ClassValue>('');

  // `block` mirrors shadcn, which renders the group as a `<div>`.
  protected readonly classes = computed(() => mergeClasses('block', this.class()));

  select(value: string) {
    this.zValue.set(value);
  }
}

@Component({
  selector: 'z-dropdown-menu-radio-item, [z-dropdown-menu-radio-item]',
  template: `
    <span class="pointer-events-none absolute left-2 flex size-3.5 items-center justify-center">
      @if (isChecked()) {
        <span class="size-2 rounded-full bg-current"></span>
      }
    </span>
    <ng-content />
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: {
    '[class]': 'classes()',
    role: 'menuitemradio',
    tabindex: '-1',
    'data-slot': 'dropdown-menu-radio-item',
    '[attr.aria-checked]': 'isChecked()',
    '[attr.aria-disabled]': 'isDisabled()',
    '[attr.data-state]': 'isChecked() ? "checked" : "unchecked"',
    '[attr.data-disabled]': 'isDisabled() || null',
    '[attr.data-variant]': 'itemVariant()',
    '(click.prevent-with-stop)': 'onClick()',
  },
})
export class ZardDropdownMenuRadioItemComponent {
  private readonly dropdownService = inject(ZardDropdownService);
  private readonly radioGroup = inject(ZARD_DROPDOWN_RADIO_GROUP, { optional: true });

  readonly zValue = input.required<string>();
  readonly disabled = input(false, { transform: booleanAttribute });
  readonly zDisabled = input<boolean | undefined, unknown>(undefined, {
    alias: 'zDisabled',
    transform: optionalBooleanAttribute,
  });

  readonly variant = input<ZardDropdownItemTypeVariants>('default');
  readonly zType = input<ZardDropdownItemTypeVariants | undefined>(undefined, { alias: 'zType' });
  readonly zVariant = input<ZardDropdownItemTypeVariants | undefined>(undefined, { alias: 'zVariant' });
  readonly class = input<ClassValue>('');

  protected readonly isDisabled = computed(() => this.zDisabled() ?? this.disabled());
  protected readonly itemVariant = computed(() => this.zType() ?? this.zVariant() ?? this.variant());
  protected readonly isChecked = computed(() => this.radioGroup?.zValue() === this.zValue());
  protected readonly classes = computed(() =>
    mergeClasses(dropdownItemVariants({ variant: this.itemVariant(), inset: true }), this.class()),
  );

  protected onClick() {
    if (this.isDisabled()) {
      return;
    }

    this.radioGroup?.select(this.zValue());
    setTimeout(() => this.dropdownService.closeAndFocusTrigger(), 0);
  }
}
```

```angular-ts
import {
  booleanAttribute,
  computed,
  Directive,
  ElementRef,
  inject,
  input,
  type OnInit,
  ViewContainerRef,
} from '@angular/core';

import type { ZardDropdownMenuContentComponent } from './dropdown-menu-content.component';
import { ZardDropdownService, type ZardDropdownPlacement } from './dropdown.service';

@Directive({
  selector: '[z-dropdown], [zDropdown]',
  host: {
    'data-slot': 'dropdown-menu-trigger',
    '[attr.tabindex]': '0',
    '[attr.role]': '"button"',
    '[attr.aria-haspopup]': '"menu"',
    '[attr.aria-expanded]': 'isThisDropdownOpen()',
    '[attr.aria-disabled]': 'zDisabled()',
    '[attr.data-state]': 'isThisDropdownOpen() ? "open" : "closed"',
    '[attr.data-disabled]': 'zDisabled() || null',
    '(click.prevent-with-stop)': 'onClick()',
    '(mouseenter)': 'onHoverToggle($event)',
    '(mouseleave)': 'onHoverToggle($event)',
    '(keydown.{enter,space}.prevent-with-stop)': 'toggleDropdown()',
    '(keydown.arrowdown.prevent)': 'openDropdown()',
  },
  exportAs: 'zDropdown',
})
export class ZardDropdownDirective implements OnInit {
  private readonly elementRef = inject(ElementRef);
  private readonly viewContainerRef = inject(ViewContainerRef);
  protected readonly dropdownService = inject(ZardDropdownService);

  protected readonly isThisDropdownOpen = computed(
    () => this.dropdownService.isOpen() && this.dropdownService.getTriggerElement() === this.elementRef,
  );

  readonly zDropdownMenu = input<ZardDropdownMenuContentComponent>();
  readonly zTrigger = input<'click' | 'hover'>('click');
  readonly zDisabled = input(false, { transform: booleanAttribute });

  ngOnInit() {
    // Ensure button has proper accessibility attributes
    const element = this.elementRef.nativeElement;
    if (!element.hasAttribute('aria-label') && !element.hasAttribute('aria-labelledby')) {
      const label = element.textContent?.trim();
      element.setAttribute('aria-label', label?.length ? label : 'Open menu');
    }
  }

  protected onClick() {
    if (this.zTrigger() !== 'click') {
      return;
    }

    this.toggleDropdown();
  }

  protected onHoverToggle(event: MouseEvent) {
    if (this.zTrigger() !== 'hover' || this.zDisabled()) {
      return;
    }

    if (event.type === 'mouseenter') {
      this.openDropdown();
    } else if (event.type === 'mouseleave') {
      this.closeDropdown();
    }
  }

  protected toggleDropdown() {
    if (this.zDisabled()) {
      return;
    }

    const menuContent = this.zDropdownMenu();
    if (menuContent) {
      this.dropdownService.toggle(
        this.elementRef,
        menuContent.contentTemplate(),
        this.viewContainerRef,
        this.placementOf(menuContent),
      );
    }
  }

  protected openDropdown() {
    if (this.zDisabled()) {
      return;
    }

    const menuContent = this.zDropdownMenu();
    if (menuContent && !this.dropdownService.isOpen()) {
      this.dropdownService.toggle(
        this.elementRef,
        menuContent.contentTemplate(),
        this.viewContainerRef,
        this.placementOf(menuContent),
      );
    }
  }

  /** The content owns `zSide`/`zAlign`/`zSideOffset`, exactly as `DropdownMenuContent` does in shadcn. */
  private placementOf(menuContent: ZardDropdownMenuContentComponent): ZardDropdownPlacement {
    return {
      side: menuContent.zSide(),
      align: menuContent.zAlign(),
      sideOffset: menuContent.zSideOffset(),
    };
  }

  protected closeDropdown() {
    this.dropdownService.close();
  }
}
```

```angular-ts
import { ZardDropdownMenuItemComponent } from '@/shared/components/dropdown/dropdown-item.component';
import { ZardDropdownMenuContentComponent } from '@/shared/components/dropdown/dropdown-menu-content.component';
import {
  ZardDropdownMenuCheckboxItemComponent,
  ZardDropdownMenuGroupComponent,
  ZardDropdownMenuLabelComponent,
  ZardDropdownMenuRadioGroupComponent,
  ZardDropdownMenuRadioItemComponent,
  ZardDropdownMenuSeparatorComponent,
  ZardDropdownMenuShortcutComponent,
} from '@/shared/components/dropdown/dropdown-primitives.component';
import { ZardDropdownDirective } from '@/shared/components/dropdown/dropdown-trigger.directive';
import { ZardDropdownMenuComponent } from '@/shared/components/dropdown/dropdown.component';

export const ZardDropdownImports = [
  ZardDropdownMenuComponent,
  ZardDropdownMenuItemComponent,
  ZardDropdownMenuContentComponent,
  ZardDropdownMenuGroupComponent,
  ZardDropdownMenuSeparatorComponent,
  ZardDropdownMenuShortcutComponent,
  ZardDropdownMenuCheckboxItemComponent,
  ZardDropdownMenuRadioGroupComponent,
  ZardDropdownMenuRadioItemComponent,
  ZardDropdownMenuLabelComponent,
  ZardDropdownDirective,
] as const;
```

```angular-ts
import { Overlay, OverlayPositionBuilder, type OverlayRef } from '@angular/cdk/overlay';
import { TemplatePortal } from '@angular/cdk/portal';
import { isPlatformBrowser } from '@angular/common';
import {
  type ElementRef,
  inject,
  Injectable,
  PLATFORM_ID,
  type Renderer2,
  RendererFactory2,
  signal,
  type TemplateRef,
  type ViewContainerRef,
} from '@angular/core';

import { filter, type Subscription } from 'rxjs';

import {
  buildDropdownPositions,
  type ZardDropdownAlign,
  type ZardDropdownSide,
} from '@/shared/components/dropdown/dropdown-positions';
import { noopFn } from '@/shared/utils/merge-classes';

/** Placement of the menu relative to its trigger, mirroring Radix's `side`/`align`/`sideOffset`. */
export interface ZardDropdownPlacement {
  side?: ZardDropdownSide;
  align?: ZardDropdownAlign;
  sideOffset?: number;
}

@Injectable({
  providedIn: 'root',
})
export class ZardDropdownService {
  private readonly overlay = inject(Overlay);
  private readonly overlayPositionBuilder = inject(OverlayPositionBuilder);
  private readonly platformId = inject(PLATFORM_ID);
  private readonly rendererFactory = inject(RendererFactory2);

  private overlayRef?: OverlayRef;
  private portal?: TemplatePortal;
  private triggerElement?: ElementRef;
  private renderer!: Renderer2;
  private readonly focusedIndex = signal<number>(-1);
  private outsideClickSubscription!: Subscription;
  private unlisten: () => void = noopFn;

  readonly isOpen = signal(false);

  constructor() {
    this.renderer = this.rendererFactory.createRenderer(null, null);
  }

  toggle(
    triggerElement: ElementRef,
    template: TemplateRef<unknown>,
    viewContainerRef: ViewContainerRef,
    placement?: ZardDropdownPlacement,
  ) {
    if (this.isOpen()) {
      this.close();
    } else {
      this.open(triggerElement, template, viewContainerRef, placement);
    }
  }

  private open(
    triggerElement: ElementRef,
    template: TemplateRef<unknown>,
    viewContainerRef: ViewContainerRef,
    placement?: ZardDropdownPlacement,
  ) {
    if (this.isOpen()) {
      this.close();
    }

    this.triggerElement = triggerElement;
    this.createOverlay(triggerElement, placement);

    if (!this.overlayRef) {
      return;
    }

    this.portal = new TemplatePortal(template, viewContainerRef);
    this.overlayRef.attach(this.portal);

    // Setup keyboard navigation
    setTimeout(() => {
      this.setupKeyboardNavigation();
    }, 0);

    // Close on outside click
    this.outsideClickSubscription = this.overlayRef
      .outsidePointerEvents()
      .pipe(filter(event => !triggerElement.nativeElement.contains(event.target)))
      .subscribe(() => {
        this.close();
      });
    this.isOpen.set(true);
  }

  getTriggerElement(): ElementRef | undefined {
    return this.triggerElement;
  }

  close() {
    if (this.overlayRef?.hasAttached()) {
      this.overlayRef.detach();
    }
    this.focusedIndex.set(-1);
    this.unlisten();
    this.destroyOverlay();
    this.isOpen.set(false);
    this.triggerElement = undefined;
  }

  closeAndReturnTrigger(): ElementRef | undefined {
    const trigger = this.triggerElement;
    this.close();
    return trigger;
  }

  closeAndFocusTrigger() {
    const trigger = this.closeAndReturnTrigger();
    trigger?.nativeElement.focus();
  }

  private createOverlay(triggerElement: ElementRef, placement?: ZardDropdownPlacement) {
    if (this.overlayRef) {
      this.destroyOverlay();
    }

    const positionStrategy = this.overlayPositionBuilder
      .flexibleConnectedTo(triggerElement)
      .withPositions(
        buildDropdownPositions(placement?.side ?? 'bottom', placement?.align ?? 'start', placement?.sideOffset ?? 4),
      )
      .withPush(false);

    this.overlayRef = this.overlay.create({
      positionStrategy,
      hasBackdrop: false,
      scrollStrategy: this.overlay.scrollStrategies.reposition(),
      minWidth: 200,
      maxHeight: 400,
    });

    this.publishTriggerWidth(triggerElement);
  }

  /**
   * Radix exposes the trigger's width to the menu as `--radix-dropdown-menu-trigger-width`, which
   * shadcn uses to make a menu exactly as wide as the button that opened it. This is the Zard
   * equivalent, published on the overlay pane so `w-(--z-dropdown-menu-trigger-width)` works inside.
   */
  private publishTriggerWidth(triggerElement: ElementRef) {
    if (!this.overlayRef || !isPlatformBrowser(this.platformId)) {
      return;
    }

    const width = (triggerElement.nativeElement as HTMLElement).getBoundingClientRect().width;
    this.overlayRef.hostElement.style.setProperty('--z-dropdown-menu-trigger-width', `${width}px`);
  }

  private destroyOverlay() {
    this.overlayRef?.dispose();
    this.overlayRef = undefined;
    this.outsideClickSubscription?.unsubscribe();
  }

  private setupKeyboardNavigation() {
    if (!this.overlayRef?.hasAttached() || !isPlatformBrowser(this.platformId)) {
      return;
    }

    const dropdownElement = this.overlayRef.overlayElement.querySelector('[role="menu"]') as HTMLElement;
    if (!dropdownElement) {
      return;
    }

    this.unlisten = this.renderer.listen(
      dropdownElement,
      'keydown.{arrowdown,arrowup,enter,space,escape,home,end}.prevent',
      (event: KeyboardEvent) => {
        const items = this.getDropdownItems();

        switch (event.key) {
          case 'ArrowDown':
            this.navigateItems(1, items);
            break;
          case 'ArrowUp':
            this.navigateItems(-1, items);
            break;
          case 'Enter':
          case ' ':
            this.selectFocusedItem(items);
            break;
          case 'Escape': {
            const triggerToFocus = this.closeAndReturnTrigger();
            triggerToFocus?.nativeElement.focus();
            break;
          }
          case 'Home':
            this.focusItemAtIndex(items, 0);
            break;
          case 'End':
            this.focusItemAtIndex(items, items.length - 1);
            break;
        }
      },
    );

    // Focus dropdown container
    dropdownElement.focus();
  }

  private getDropdownItems(): HTMLElement[] {
    if (!this.overlayRef?.hasAttached()) {
      return [];
    }
    const dropdownElement = this.overlayRef.overlayElement;
    return Array.from(
      dropdownElement.querySelectorAll<HTMLElement>(
        'z-dropdown-menu-item, [z-dropdown-menu-item], z-dropdown-menu-checkbox-item, [z-dropdown-menu-checkbox-item], z-dropdown-menu-radio-item, [z-dropdown-menu-radio-item]',
      ),
    ).filter(item => item.dataset['disabled'] === undefined);
  }

  private navigateItems(direction: number, items: HTMLElement[]) {
    if (items.length === 0) {
      return;
    }

    const currentIndex = this.focusedIndex();
    let nextIndex: number;

    if (currentIndex === -1) {
      // No item focused yet — start from first or last depending on direction
      nextIndex = direction > 0 ? 0 : items.length - 1;
    } else {
      nextIndex = currentIndex + direction;
      if (nextIndex < 0) {
        nextIndex = items.length - 1;
      } else if (nextIndex >= items.length) {
        nextIndex = 0;
      }
    }

    this.focusItemAtIndex(items, nextIndex);
  }

  private focusItemAtIndex(items: HTMLElement[], index: number) {
    if (index >= 0 && index < items.length) {
      this.focusedIndex.set(index);
      this.updateItemFocus(items, index);
    }
  }

  private focusFirstItem() {
    const items = this.getDropdownItems();
    if (items.length > 0) {
      this.focusItemAtIndex(items, 0);
    }
  }

  private selectFocusedItem(items: HTMLElement[]) {
    const currentIndex = this.focusedIndex();
    if (currentIndex >= 0 && currentIndex < items.length) {
      const item = items[currentIndex];
      item.click();
    }
  }

  private updateItemFocus(items: HTMLElement[], focusedIndex: number) {
    for (let index = 0; index < items.length; index++) {
      const item = items[index];
      if (index === focusedIndex) {
        item.focus();
        item.dataset['highlighted'] = '';
      } else {
        delete item.dataset['highlighted'];
      }
    }
  }
}
```

```angular-ts
export * from './dropdown.component';
export * from './dropdown-item.component';
export * from './dropdown-menu-content.component';
export * from './dropdown-positions';
export * from './dropdown-primitives.component';
export * from './dropdown-trigger.directive';
export * from './dropdown.service';
export * from './dropdown.imports';
export * from './dropdown.variants';
```

## Usage

```angular-ts
import { ZardDropdownImports } from '@/shared/components/dropdown/dropdown.imports';
```

```angular-html
<button z-button zType="outline" z-dropdown [zDropdownMenu]="menu">Open</button>

<z-dropdown-menu-content #menu="zDropdownMenuContent" class="w-48">
  <z-dropdown-menu-item>Profile</z-dropdown-menu-item>
  <z-dropdown-menu-item>Settings</z-dropdown-menu-item>
  <z-dropdown-menu-item zDisabled>Subscription</z-dropdown-menu-item>
</z-dropdown-menu-content>
```

## Examples

### Basic

```angular-ts
import { Component } from '@angular/core';

import { ZardButtonComponent } from '@/shared/components/button';
import { ZardDropdownImports } from '@/shared/components/dropdown/dropdown.imports';

@Component({
  selector: 'z-dropdown-demo',
  imports: [ZardDropdownImports, ZardButtonComponent],
  template: `
    <button type="button" z-button zType="outline" z-dropdown [zDropdownMenu]="menu">Open menu</button>

    <z-dropdown-menu-content #menu="zDropdownMenuContent" class="w-48">
      <z-dropdown-menu-item (click)="log('Profile')">Profile</z-dropdown-menu-item>
      <z-dropdown-menu-item (click)="log('Billing')">Billing</z-dropdown-menu-item>
      <z-dropdown-menu-item (click)="log('Team')">Team</z-dropdown-menu-item>
      <z-dropdown-menu-item [disabled]="true">Subscription</z-dropdown-menu-item>
    </z-dropdown-menu-content>
  `,
})
export class ZardDropdownDemoComponent {
  log(item: string) {
    console.log(`${item} clicked`);
  }
}
```

### Shortcuts

```angular-ts
import { Component } from '@angular/core';

import { ZardButtonComponent } from '@/shared/components/button';
import { ZardDropdownImports } from '@/shared/components/dropdown/dropdown.imports';

@Component({
  selector: 'z-dropdown-shortcuts-demo',
  imports: [ZardDropdownImports, ZardButtonComponent],
  template: `
    <button type="button" z-button zType="outline" z-dropdown [zDropdownMenu]="menu">Account</button>

    <z-dropdown-menu-content #menu="zDropdownMenuContent" class="w-56">
      <z-dropdown-menu-label>My Account</z-dropdown-menu-label>
      <z-dropdown-menu-item (click)="log('Profile')">
        Profile
        <z-dropdown-menu-shortcut>⇧⌘P</z-dropdown-menu-shortcut>
      </z-dropdown-menu-item>
      <z-dropdown-menu-item (click)="log('Billing')">
        Billing
        <z-dropdown-menu-shortcut>⌘B</z-dropdown-menu-shortcut>
      </z-dropdown-menu-item>
      <z-dropdown-menu-item (click)="log('Settings')">
        Settings
        <z-dropdown-menu-shortcut>⌘S</z-dropdown-menu-shortcut>
      </z-dropdown-menu-item>
      <z-dropdown-menu-separator />
      <z-dropdown-menu-item (click)="log('Log out')">
        Log out
        <z-dropdown-menu-shortcut>⇧⌘Q</z-dropdown-menu-shortcut>
      </z-dropdown-menu-item>
    </z-dropdown-menu-content>
  `,
})
export class ZardDropdownShortcutsDemoComponent {
  log(item: string) {
    console.log(`${item} clicked`);
  }
}
```

### Icons

```angular-ts
import { Component } from '@angular/core';

import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideCreditCard, lucideKeyboard, lucideSettings, lucideUser } from '@ng-icons/lucide';

import { ZardButtonComponent } from '@/shared/components/button';
import { ZardDropdownImports } from '@/shared/components/dropdown/dropdown.imports';

@Component({
  selector: 'z-dropdown-icons-demo',
  imports: [ZardDropdownImports, ZardButtonComponent, NgIcon],
  template: `
    <button type="button" z-button zType="outline" z-dropdown [zDropdownMenu]="menu">Open</button>

    <z-dropdown-menu-content #menu="zDropdownMenuContent" class="w-56">
      <z-dropdown-menu-item (click)="log('Profile')">
        <ng-icon name="lucideUser" class="mr-2 size-4" />
        Profile
      </z-dropdown-menu-item>
      <z-dropdown-menu-item (click)="log('Billing')">
        <ng-icon name="lucideCreditCard" class="mr-2 size-4" />
        Billing
      </z-dropdown-menu-item>
      <z-dropdown-menu-item (click)="log('Settings')">
        <ng-icon name="lucideSettings" class="mr-2 size-4" />
        Settings
      </z-dropdown-menu-item>
      <z-dropdown-menu-item (click)="log('Keyboard shortcuts')">
        <ng-icon name="lucideKeyboard" class="mr-2 size-4" />
        Keyboard shortcuts
      </z-dropdown-menu-item>
    </z-dropdown-menu-content>
  `,
  viewProviders: [provideIcons({ lucideUser, lucideCreditCard, lucideSettings, lucideKeyboard })],
})
export class ZardDropdownIconsDemoComponent {
  log(item: string) {
    console.log(`${item} clicked`);
  }
}
```

### Checkboxes

```angular-ts
import { Component } from '@angular/core';

import { ZardButtonComponent } from '@/shared/components/button';
import { ZardDropdownImports } from '@/shared/components/dropdown/dropdown.imports';

@Component({
  selector: 'z-dropdown-checkboxes-demo',
  imports: [ZardDropdownImports, ZardButtonComponent],
  template: `
    <button type="button" z-button zType="outline" z-dropdown [zDropdownMenu]="menu">View options</button>

    <z-dropdown-menu-content #menu="zDropdownMenuContent" class="w-56">
      <z-dropdown-menu-checkbox-item [(zChecked)]="statusBar">Status Bar</z-dropdown-menu-checkbox-item>
      <z-dropdown-menu-checkbox-item [(zChecked)]="activityBar">Activity Bar</z-dropdown-menu-checkbox-item>
      <z-dropdown-menu-checkbox-item [(zChecked)]="panel">Panel</z-dropdown-menu-checkbox-item>
    </z-dropdown-menu-content>
  `,
})
export class ZardDropdownCheckboxesDemoComponent {
  statusBar = true;
  activityBar = false;
  panel = false;
}
```

### Radio Group

```angular-ts
import { Component } from '@angular/core';

import { ZardButtonComponent } from '@/shared/components/button';
import { ZardDropdownImports } from '@/shared/components/dropdown/dropdown.imports';

@Component({
  selector: 'z-dropdown-radio-group-demo',
  imports: [ZardDropdownImports, ZardButtonComponent],
  template: `
    <button type="button" z-button zType="outline" z-dropdown [zDropdownMenu]="menu">Panel position</button>

    <z-dropdown-menu-content #menu="zDropdownMenuContent" class="w-56">
      <z-dropdown-menu-label>Panel Position</z-dropdown-menu-label>
      <z-dropdown-menu-radio-group [(zValue)]="selected">
        @for (position of positions; track position.value) {
          <z-dropdown-menu-radio-item [zValue]="position.value">
            {{ position.label }}
          </z-dropdown-menu-radio-item>
        }
      </z-dropdown-menu-radio-group>
    </z-dropdown-menu-content>
  `,
})
export class ZardDropdownRadioGroupDemoComponent {
  selected = 'bottom';
  positions = [
    { value: 'top', label: 'Top' },
    { value: 'bottom', label: 'Bottom' },
    { value: 'right', label: 'Right' },
  ];
}
```

### Destructive

```angular-ts
import { Component } from '@angular/core';

import { ZardButtonComponent } from '@/shared/components/button';
import { ZardDropdownImports } from '@/shared/components/dropdown/dropdown.imports';

@Component({
  selector: 'z-dropdown-destructive-demo',
  imports: [ZardDropdownImports, ZardButtonComponent],
  template: `
    <button type="button" z-button zType="outline" z-dropdown [zDropdownMenu]="menu">Project</button>

    <z-dropdown-menu-content #menu="zDropdownMenuContent" class="w-48">
      <z-dropdown-menu-item (click)="log('Rename')">Rename</z-dropdown-menu-item>
      <z-dropdown-menu-item (click)="log('Duplicate')">Duplicate</z-dropdown-menu-item>
      <z-dropdown-menu-separator />
      <z-dropdown-menu-item zType="destructive" (click)="log('Delete')">Delete</z-dropdown-menu-item>
    </z-dropdown-menu-content>
  `,
})
export class ZardDropdownDestructiveDemoComponent {
  log(item: string) {
    console.log(`${item} clicked`);
  }
}
```

### Submenu

Compose with `z-navigation-menu-trigger` for nested flyout behavior.

```angular-ts
import { Component } from '@angular/core';

import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideChevronRight } from '@ng-icons/lucide';

import { ZardButtonComponent } from '@/shared/components/button';
import { ZardDropdownImports } from '@/shared/components/dropdown/dropdown.imports';
import { ZardNavigationMenuImports } from '@/shared/components/navigation-menu';

@Component({
  selector: 'z-dropdown-submenu-demo',
  imports: [ZardDropdownImports, ZardButtonComponent, ZardNavigationMenuImports, NgIcon],
  template: `
    <button type="button" z-button zType="outline" z-dropdown [zDropdownMenu]="menu">Open</button>

    <z-dropdown-menu-content #menu="zDropdownMenuContent" class="w-56">
      <z-dropdown-menu-item (click)="log('Back')">Back</z-dropdown-menu-item>
      <z-dropdown-menu-item (click)="log('Forward')">Forward</z-dropdown-menu-item>
      <z-dropdown-menu-item (click)="log('Reload')">Reload</z-dropdown-menu-item>
      <z-dropdown-menu-separator />
      <button
        type="button"
        z-navigation-menu-link
        z-navigation-menu-trigger
        [zNavigationMenuTriggerFor]="moreToolsMenu"
        zPlacement="rightTop"
      >
        More Tools
        <ng-icon name="lucideChevronRight" class="ml-auto size-4" />
      </button>
    </z-dropdown-menu-content>

    <ng-template #moreToolsMenu>
      <div z-navigation-menu-content class="w-48">
        <button type="button" z-navigation-menu-link (click)="log('Save Page As')">Save Page As...</button>
        <button type="button" z-navigation-menu-link (click)="log('Create Shortcut')">Create Shortcut...</button>
        <button type="button" z-navigation-menu-link (click)="log('Developer Tools')">Developer Tools</button>
      </div>
    </ng-template>
  `,
  viewProviders: [provideIcons({ lucideChevronRight })],
})
export class ZardDropdownSubmenuDemoComponent {
  log(item: string) {
    console.log(`${item} clicked`);
  }
}
```

### Avatar

```angular-ts
import { Component } from '@angular/core';

import { ZardAvatarComponent } from '@/shared/components/avatar/avatar.component';
import { ZardButtonComponent } from '@/shared/components/button';
import { ZardDropdownImports } from '@/shared/components/dropdown/dropdown.imports';

@Component({
  selector: 'z-dropdown-avatar-demo',
  imports: [ZardDropdownImports, ZardButtonComponent, ZardAvatarComponent],
  template: `
    <button type="button" z-button zType="ghost" class="size-10 rounded-full p-0" z-dropdown [zDropdownMenu]="menu">
      <z-avatar zSrc="/images/avatar/imgs/avatar_image.jpg" zFallback="ZA" zAlt="User avatar" />
    </button>

    <z-dropdown-menu-content #menu="zDropdownMenuContent" class="w-56">
      <z-dropdown-menu-label>
        <div class="flex flex-col space-y-1">
          <p class="text-sm leading-none font-medium">Zard User</p>
          <p class="text-muted-foreground text-xs leading-none">user@zardui.com</p>
        </div>
      </z-dropdown-menu-label>
      <z-dropdown-menu-separator />
      <z-dropdown-menu-item (click)="log('Profile')">Profile</z-dropdown-menu-item>
      <z-dropdown-menu-item (click)="log('Billing')">Billing</z-dropdown-menu-item>
      <z-dropdown-menu-item (click)="log('Settings')">Settings</z-dropdown-menu-item>
      <z-dropdown-menu-separator />
      <z-dropdown-menu-item (click)="log('Log out')">Log out</z-dropdown-menu-item>
    </z-dropdown-menu-content>
  `,
})
export class ZardDropdownAvatarDemoComponent {
  log(item: string) {
    console.log(`${item} clicked`);
  }
}
```

### Complex

```angular-ts
import { Component } from '@angular/core';

import { ZardButtonComponent } from '@/shared/components/button';
import { ZardDropdownImports } from '@/shared/components/dropdown/dropdown.imports';

@Component({
  selector: 'z-dropdown-complex-demo',
  imports: [ZardDropdownImports, ZardButtonComponent],
  template: `
    <button type="button" z-button zType="outline" z-dropdown [zDropdownMenu]="menu">Open</button>

    <z-dropdown-menu-content #menu="zDropdownMenuContent" class="w-56">
      <z-dropdown-menu-label>My Account</z-dropdown-menu-label>
      <z-dropdown-menu-item (click)="log('Profile')">
        Profile
        <z-dropdown-menu-shortcut>⇧⌘P</z-dropdown-menu-shortcut>
      </z-dropdown-menu-item>
      <z-dropdown-menu-item (click)="log('Billing')">
        Billing
        <z-dropdown-menu-shortcut>⌘B</z-dropdown-menu-shortcut>
      </z-dropdown-menu-item>
      <z-dropdown-menu-item (click)="log('Settings')">
        Settings
        <z-dropdown-menu-shortcut>⌘S</z-dropdown-menu-shortcut>
      </z-dropdown-menu-item>
      <z-dropdown-menu-item (click)="log('Keyboard shortcuts')">
        Keyboard shortcuts
        <z-dropdown-menu-shortcut>⌘K</z-dropdown-menu-shortcut>
      </z-dropdown-menu-item>
      <z-dropdown-menu-separator />
      <z-dropdown-menu-item (click)="log('Team')">Team</z-dropdown-menu-item>
      <z-dropdown-menu-item (click)="log('New Team')">
        New Team
        <z-dropdown-menu-shortcut>⌘+T</z-dropdown-menu-shortcut>
      </z-dropdown-menu-item>
      <z-dropdown-menu-separator />
      <z-dropdown-menu-item (click)="log('GitHub')">GitHub</z-dropdown-menu-item>
      <z-dropdown-menu-item (click)="log('Support')">Support</z-dropdown-menu-item>
      <z-dropdown-menu-item [disabled]="true">API</z-dropdown-menu-item>
      <z-dropdown-menu-separator />
      <z-dropdown-menu-item (click)="log('Log out')">
        Log out
        <z-dropdown-menu-shortcut>⇧⌘Q</z-dropdown-menu-shortcut>
      </z-dropdown-menu-item>
    </z-dropdown-menu-content>
  `,
})
export class ZardDropdownComplexDemoComponent {
  log(item: string) {
    console.log(`${item} clicked`);
  }
}
```

### Hover

Use `zTrigger="hover"` when the menu should open on pointer hover.

```angular-ts
import { Component } from '@angular/core';

import { ZardButtonComponent } from '@/shared/components/button';
import { ZardDropdownImports } from '@/shared/components/dropdown/dropdown.imports';

@Component({
  selector: 'z-dropdown-hover-demo',
  imports: [ZardDropdownImports, ZardButtonComponent],
  template: `
    <button type="button" z-button zType="outline" zTrigger="hover" z-dropdown [zDropdownMenu]="menu">Open</button>

    <z-dropdown-menu-content #menu="zDropdownMenuContent" class="w-56">
      <z-dropdown-menu-label>My Account</z-dropdown-menu-label>

      <z-dropdown-menu-item (click)="onProfile()">
        Profile
        <z-dropdown-menu-shortcut>⇧⌘P</z-dropdown-menu-shortcut>
      </z-dropdown-menu-item>

      <z-dropdown-menu-item (click)="onBilling()">
        Billing
        <z-dropdown-menu-shortcut>⌘B</z-dropdown-menu-shortcut>
      </z-dropdown-menu-item>

      <z-dropdown-menu-item (click)="onSettings()">
        Settings
        <z-dropdown-menu-shortcut>⌘S</z-dropdown-menu-shortcut>
      </z-dropdown-menu-item>

      <z-dropdown-menu-item (click)="onKeyboardShortcuts()">
        Keyboard shortcuts
        <z-dropdown-menu-shortcut>⌘K</z-dropdown-menu-shortcut>
      </z-dropdown-menu-item>

      <z-dropdown-menu-separator />

      <z-dropdown-menu-item (click)="onTeam()">Team</z-dropdown-menu-item>

      <z-dropdown-menu-item (click)="onNewTeam()">
        New Team
        <z-dropdown-menu-shortcut>⌘+T</z-dropdown-menu-shortcut>
      </z-dropdown-menu-item>

      <z-dropdown-menu-separator />

      <z-dropdown-menu-item (click)="onGitHub()">GitHub</z-dropdown-menu-item>
      <z-dropdown-menu-item (click)="onSupport()">Support</z-dropdown-menu-item>
      <z-dropdown-menu-item [disabled]="true">API</z-dropdown-menu-item>

      <z-dropdown-menu-separator />

      <z-dropdown-menu-item (click)="onLogout()">
        Log out
        <z-dropdown-menu-shortcut>⇧⌘Q</z-dropdown-menu-shortcut>
      </z-dropdown-menu-item>
    </z-dropdown-menu-content>
  `,
})
export class ZardDropdownHoverDemoComponent {
  onProfile() {
    console.log('Profile clicked');
  }

  onBilling() {
    console.log('Billing clicked');
  }

  onSettings() {
    console.log('Settings clicked');
  }

  onKeyboardShortcuts() {
    console.log('Keyboard shortcuts clicked');
  }

  onTeam() {
    console.log('Team clicked');
  }

  onNewTeam() {
    console.log('New Team clicked');
  }

  onGitHub() {
    console.log('GitHub clicked');
  }

  onSupport() {
    console.log('Support clicked');
  }

  onLogout() {
    console.log('Log out clicked');
  }
}
```

## API Reference

### z-dropdown

Trigger directive that opens a linked dropdown menu content template.

| Prop | Description | Type | Default |
| --- | --- | --- | --- |
| `[zDropdownMenu]` | Reference to the `z-dropdown-menu-content` template exported as `zDropdownMenuContent`. | `ZardDropdownMenuContentComponent` | `-` |
| `[zTrigger]` | Interaction used to open the dropdown. | `'click' \| 'hover'` | `'click'` |
| `[zDisabled]` | Disables the dropdown trigger | `boolean` | `false` |

### z-dropdown-menu

Projected dropdown component with built-in trigger and overlay management.

| Prop | Description | Type | Default |
| --- | --- | --- | --- |
| `[class]` | Additional CSS classes | `ClassValue` | `''` |
| `[disabled]` | Disables the dropdown | `boolean` | `false` |
| `[zDisabled]` | Disables the dropdown using the Zard-prefixed API. | `boolean` | `false` |

### z-dropdown-menu-content

Reusable content template displayed by a `z-dropdown` trigger.

| Prop | Description | Type | Default |
| --- | --- | --- | --- |
| `[class]` | Additional CSS classes | `ClassValue` | `''` |
| `[zSide]` | Edge of the trigger the menu opens from. | `'top' \| 'right' \| 'bottom' \| 'left'` | `'bottom'` |
| `[zAlign]` | Alignment of the menu along that edge. | `'start' \| 'center' \| 'end'` | `'start'` |
| `[zSideOffset]` | Gap between trigger and menu, in pixels. | `number` | `4` |

### z-dropdown-menu-item

Clickable menu item that closes the dropdown after selection.

| Prop | Description | Type | Default |
| --- | --- | --- | --- |
| `[zType]` | Visual type of the item. | `'default' \| 'destructive'` | `'default'` |
| `[variant]` | Visual variant of the item | `'default' \| 'destructive'` | `'default'` |
| `[zInset]` | Adds left padding for alignment. | `boolean` | `false` |
| `[inset]` | Adds left padding for alignment | `boolean` | `false` |
| `[zDisabled]` | Disables the dropdown item. | `boolean` | `false` |
| `[disabled]` | Disables the dropdown item | `boolean` | `false` |
| `[class]` | Additional CSS classes | `ClassValue` | `''` |

### z-dropdown-menu-label

Label for grouping dropdown menu items.

| Prop | Description | Type | Default |
| --- | --- | --- | --- |
| `[zInset]` | Adds left padding for alignment. | `boolean` | `false` |
| `[class]` | Additional CSS classes | `ClassValue` | `''` |

### z-dropdown-menu-separator

Visual separator between dropdown menu sections.

| Prop | Description | Type | Default |
| --- | --- | --- | --- |
| `[class]` | Additional CSS classes | `ClassValue` | `''` |

### z-dropdown-menu-shortcut

Right-aligned shortcut text inside a dropdown menu item.

| Prop | Description | Type | Default |
| --- | --- | --- | --- |
| `[class]` | Additional CSS classes | `ClassValue` | `''` |

### z-dropdown-menu-checkbox-item

Checkbox-style dropdown menu item with checked state and menuitemcheckbox semantics.

| Prop | Description | Type | Default |
| --- | --- | --- | --- |
| `[(zChecked)]` | Checked state for the checkbox item. | `boolean` | `false` |
| `[zDisabled]` | Disables the checkbox item. | `boolean` | `false` |
| `[zType]` | Visual type of the item. | `'default' \| 'destructive'` | `'default'` |
| `[class]` | Additional CSS classes | `ClassValue` | `''` |

### z-dropdown-menu-radio-group

Radio group wrapper for dropdown menu radio items.

| Prop | Description | Type | Default |
| --- | --- | --- | --- |
| `[(zValue)]` | Selected radio item value. | `string \| undefined` | `undefined` |
| `[class]` | Additional CSS classes | `ClassValue` | `''` |

### z-dropdown-menu-radio-item

Radio-style dropdown menu item with menuitemradio semantics.

| Prop | Description | Type | Default |
| --- | --- | --- | --- |
| `[zValue]` | Value represented by this radio item. | `string` | `-` |
| `[zDisabled]` | Disables the radio item. | `boolean` | `false` |
| `[zType]` | Visual type of the item. | `'default' \| 'destructive'` | `'default'` |
| `[class]` | Additional CSS classes | `ClassValue` | `''` |

---

[Open in browser](https://zardui.com/docs/components/dropdown)
