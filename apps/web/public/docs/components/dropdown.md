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

export const dropdownSubContentVariants = cva([
  'z-50 min-w-32 max-h-96 overflow-x-hidden overflow-y-auto rounded-md border bg-popover p-1 text-popover-foreground',
  'shadow-lg outline-none animate-in fade-in-0 zoom-in-95',
]);

export const dropdownSubTriggerVariants = cva(
  'relative flex cursor-default select-none items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground data-highlighted:bg-accent data-highlighted:text-accent-foreground data-[state=open]:bg-accent data-[state=open]:text-accent-foreground data-disabled:pointer-events-none data-disabled:opacity-50 data-disabled:cursor-not-allowed [&_svg:not([class*=size-])]:size-4 [&_svg]:pointer-events-none [&_svg]:shrink-0',
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
  inject,
  input,
  type TemplateRef,
  viewChild,
  ViewContainerRef,
  ViewEncapsulation,
} from '@angular/core';

import type { ClassValue } from 'clsx';

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
  /**
   * Where the template is instantiated from when a service — rather than a trigger directive —
   * opens this menu, so `ZardContextMenuService.create()` needs nothing but the menu itself.
   */
  readonly viewContainerRef = inject(ViewContainerRef);

  readonly contentTemplate = viewChild.required<TemplateRef<unknown>>('contentTemplate');

  readonly class = input<ClassValue>('');

  protected readonly contentClasses = computed(() => mergeClasses(dropdownContentVariants(), this.class()));
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

  // `block` is not decoration: on the `z-dropdown-menu-separator` element form the default
  // `display: inline` swallows `h-px` and the negative margins, and the divider renders as a gap
  // with no line in it.
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
import { Overlay, OverlayPositionBuilder, type OverlayRef } from '@angular/cdk/overlay';
import { TemplatePortal } from '@angular/cdk/portal';
import { isPlatformBrowser } from '@angular/common';
import {
  booleanAttribute,
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  ElementRef,
  inject,
  input,
  type OnDestroy,
  PLATFORM_ID,
  signal,
  type TemplateRef,
  viewChild,
  ViewContainerRef,
  ViewEncapsulation,
} from '@angular/core';

import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideChevronRight } from '@ng-icons/lucide';
import type { ClassValue } from 'clsx';

import { mergeClasses } from '@/shared/utils/merge-classes';

import { ZardDropdownService } from './dropdown.service';
import { dropdownSubContentVariants, dropdownSubTriggerVariants } from './dropdown.variants';
import { findMenuItemByChar, getMenuItems, highlightMenuItem, isTypeaheadKey, nextMenuIndex } from './menu-keyboard';

/** How long the pointer may sit between the trigger and the popup before the submenu closes. */
const CLOSE_DELAY = 120;

/**
 * Holds the rows of one submenu. Like `z-dropdown-menu-content` it renders nothing where it is
 * declared — it hands a template to the sub-trigger, which opens it in its own overlay.
 */
@Component({
  selector: 'z-dropdown-menu-sub-content, [z-dropdown-menu-sub-content]',
  template: `
    <ng-template #contentTemplate>
      <div
        [class]="contentClasses()"
        role="menu"
        data-slot="dropdown-menu-sub-content"
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
  exportAs: 'zDropdownMenuSubContent',
})
export class ZardDropdownMenuSubContentComponent {
  readonly viewContainerRef = inject(ViewContainerRef);

  readonly contentTemplate = viewChild.required<TemplateRef<unknown>>('contentTemplate');

  readonly class = input<ClassValue>('');

  protected readonly contentClasses = computed(() => mergeClasses(dropdownSubContentVariants(), this.class()));
}

/**
 * A menu row that opens a nested menu to its side. Positioned by the CDK so it flips to the other
 * side near the viewport edge, and opened on hover, click, `Enter`, `Space` or `ArrowRight` —
 * `ArrowLeft` and `Escape` close it and hand the focus back to this row.
 */
@Component({
  selector: 'z-dropdown-menu-sub-trigger, [z-dropdown-menu-sub-trigger]',
  imports: [NgIcon],
  template: `
    <ng-content />
    <ng-icon name="lucideChevronRight" class="ml-auto size-4 shrink-0" aria-hidden="true" />
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  viewProviders: [provideIcons({ lucideChevronRight })],
  host: {
    '[class]': 'classes()',
    'data-slot': 'dropdown-menu-sub-trigger',
    role: 'menuitem',
    tabindex: '-1',
    'aria-haspopup': 'menu',
    '[attr.aria-expanded]': 'isOpen()',
    '[attr.data-state]': 'isOpen() ? "open" : "closed"',
    '[attr.data-disabled]': 'zDisabled() || null',
    '[attr.data-inset]': 'zInset() || null',
    '[attr.aria-disabled]': 'zDisabled()',
    '(click)': 'onClick($event)',
    '(mouseenter)': 'onMouseEnter()',
    '(mouseleave)': 'scheduleClose($event)',
    '(keydown)': 'onKeydown($event)',
  },
  exportAs: 'zDropdownMenuSubTrigger',
})
export class ZardDropdownMenuSubTriggerComponent implements OnDestroy {
  private readonly dropdownService = inject(ZardDropdownService);
  private readonly elementRef = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly overlay = inject(Overlay);
  private readonly overlayPositionBuilder = inject(OverlayPositionBuilder);
  private readonly platformId = inject(PLATFORM_ID);
  private readonly viewContainerRef = inject(ViewContainerRef);

  private overlayRef?: OverlayRef;
  private closeTimeout?: ReturnType<typeof setTimeout>;
  private readonly cleanups: Array<() => void> = [];
  private focusedIndex = -1;

  readonly zSubMenu = input.required<ZardDropdownMenuSubContentComponent | TemplateRef<unknown>>();
  readonly zDisabled = input(false, { transform: booleanAttribute });
  readonly zInset = input(false, { transform: booleanAttribute });
  readonly class = input<ClassValue>('');

  readonly isOpen = signal(false);

  protected readonly classes = computed(() =>
    mergeClasses(dropdownSubTriggerVariants({ inset: this.zInset() }), this.class()),
  );

  constructor() {
    /**
     * The rows of a menu are projected content, so they belong to the view that declared them and
     * outlive the overlay they are shown in — closing the parent menu never destroys this trigger.
     * Following the parent's state is therefore the only thing that keeps an open submenu from
     * being left behind on screen.
     */
    effect(() => {
      if (this.dropdownService.isOpen() || !this.isOpen()) {
        return;
      }

      this.close();
    });
  }

  ngOnDestroy(): void {
    this.close();
    this.overlayRef?.dispose();
    this.overlayRef = undefined;
  }

  open(focusFirstItem = false): void {
    if (this.zDisabled() || !isPlatformBrowser(this.platformId)) {
      return;
    }

    this.cancelScheduledClose();

    if (this.isOpen()) {
      if (focusFirstItem) {
        this.focusItem(0);
      }
      return;
    }

    const template = this.resolveTemplate();
    const viewContainerRef = this.resolveViewContainerRef();
    if (!template) {
      return;
    }

    this.createOverlay();
    if (!this.overlayRef) {
      return;
    }

    this.overlayRef.attach(new TemplatePortal(template, viewContainerRef));
    this.isOpen.set(true);
    this.focusedIndex = -1;
    this.attachOverlayListeners();

    if (focusFirstItem) {
      setTimeout(() => this.focusItem(0));
    }
  }

  close(returnFocus = false): void {
    this.cancelScheduledClose();
    this.runCleanups();

    if (this.overlayRef?.hasAttached()) {
      this.overlayRef.detach();
    }

    this.isOpen.set(false);
    this.focusedIndex = -1;

    if (returnFocus) {
      this.elementRef.nativeElement.focus();
    }
  }

  protected onClick(event: MouseEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.open();
  }

  protected onKeydown(event: KeyboardEvent): void {
    if (event.key !== 'ArrowRight' && event.key !== 'Enter' && event.key !== ' ') return;

    event.preventDefault();
    event.stopPropagation();
    this.open(true);
  }

  protected onMouseEnter(): void {
    // Hovering a row is also what highlights it, so the parent's roving focus follows the pointer.
    this.elementRef.nativeElement.focus();
    this.open();
  }

  protected scheduleClose(event?: MouseEvent): void {
    if (this.isMovingInsideSubmenu(event)) {
      return;
    }

    this.cancelScheduledClose();
    this.closeTimeout = setTimeout(() => this.close(), CLOSE_DELAY);
  }

  private isMovingInsideSubmenu(event?: MouseEvent): boolean {
    const target = event?.relatedTarget as Node | null;
    if (!target) {
      return false;
    }

    return (
      this.elementRef.nativeElement.contains(target) || (this.overlayRef?.overlayElement.contains(target) ?? false)
    );
  }

  private cancelScheduledClose(): void {
    if (this.closeTimeout) {
      clearTimeout(this.closeTimeout);
      this.closeTimeout = undefined;
    }
  }

  private resolveTemplate(): TemplateRef<unknown> | undefined {
    const menu = this.zSubMenu();
    return menu instanceof ZardDropdownMenuSubContentComponent ? menu.contentTemplate() : menu;
  }

  private resolveViewContainerRef(): ViewContainerRef {
    const menu = this.zSubMenu();
    return menu instanceof ZardDropdownMenuSubContentComponent ? menu.viewContainerRef : this.viewContainerRef;
  }

  private createOverlay(): void {
    if (this.overlayRef) {
      return;
    }

    const positionStrategy = this.overlayPositionBuilder
      .flexibleConnectedTo(this.elementRef)
      .withPositions([
        { originX: 'end', originY: 'top', overlayX: 'start', overlayY: 'top', offsetY: -4 },
        { originX: 'start', originY: 'top', overlayX: 'end', overlayY: 'top', offsetY: -4 },
        { originX: 'end', originY: 'bottom', overlayX: 'start', overlayY: 'bottom', offsetY: 4 },
        { originX: 'start', originY: 'bottom', overlayX: 'end', overlayY: 'bottom', offsetY: 4 },
      ])
      .withFlexibleDimensions(false)
      .withPush(true);

    this.overlayRef = this.overlay.create({
      positionStrategy,
      hasBackdrop: false,
      scrollStrategy: this.overlay.scrollStrategies.reposition(),
    });
  }

  /**
   * The popup lives in a sibling overlay pane, so it is outside this element's subtree: the
   * pointer and keyboard listeners that keep it open have to be bound to the pane itself.
   */
  private attachOverlayListeners(): void {
    const pane = this.overlayRef?.overlayElement;
    if (!pane) {
      return;
    }

    const onEnter = () => this.cancelScheduledClose();
    const onLeave = (event: Event) => this.scheduleClose(event as MouseEvent);
    const onKeydown = (event: Event) => this.onSubmenuKeydown(event as KeyboardEvent);

    pane.addEventListener('mouseenter', onEnter);
    pane.addEventListener('mouseleave', onLeave);
    pane.addEventListener('keydown', onKeydown);

    this.cleanups.push(
      () => pane.removeEventListener('mouseenter', onEnter),
      () => pane.removeEventListener('mouseleave', onLeave),
      () => pane.removeEventListener('keydown', onKeydown),
    );
  }

  private onSubmenuKeydown(event: KeyboardEvent): void {
    const items = this.submenuItems();

    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault();
        this.focusItem(nextMenuIndex(items, this.focusedIndex, 1), items);
        return;
      case 'ArrowUp':
        event.preventDefault();
        this.focusItem(nextMenuIndex(items, this.focusedIndex, -1), items);
        return;
      case 'Home':
        event.preventDefault();
        this.focusItem(0, items);
        return;
      case 'End':
        event.preventDefault();
        this.focusItem(items.length - 1, items);
        return;
      case 'Enter':
      case ' ':
        event.preventDefault();
        items[this.focusedIndex]?.click();
        return;
      case 'ArrowLeft':
      case 'Escape':
        event.preventDefault();
        event.stopPropagation();
        this.close(true);
        return;
      case 'Tab':
        this.dropdownService.close();
        return;
    }

    if (!isTypeaheadKey(event)) {
      return;
    }

    const match = findMenuItemByChar(items, event.key, this.focusedIndex);
    if (match === -1) {
      return;
    }

    event.preventDefault();
    this.focusItem(match, items);
  }

  private submenuItems(): HTMLElement[] {
    const pane = this.overlayRef?.overlayElement;
    return pane ? getMenuItems(pane) : [];
  }

  private focusItem(index: number, items = this.submenuItems()): void {
    if (index < 0 || index >= items.length) {
      return;
    }

    this.focusedIndex = index;
    highlightMenuItem(items, index);
  }

  private runCleanups(): void {
    this.cleanups.forEach(cleanup => cleanup());
    this.cleanups.length = 0;
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
import { ZardDropdownService } from './dropdown.service';

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
      this.dropdownService.toggle(this.elementRef, menuContent.contentTemplate(), this.viewContainerRef);
    }
  }

  protected openDropdown() {
    if (this.zDisabled()) {
      return;
    }

    const menuContent = this.zDropdownMenu();
    if (menuContent && !this.dropdownService.isOpen()) {
      this.dropdownService.toggle(this.elementRef, menuContent.contentTemplate(), this.viewContainerRef);
    }
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
import {
  ZardDropdownMenuSubContentComponent,
  ZardDropdownMenuSubTriggerComponent,
} from '@/shared/components/dropdown/dropdown-submenu.component';
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
  ZardDropdownMenuSubTriggerComponent,
  ZardDropdownMenuSubContentComponent,
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

import { findMenuItemByChar, getMenuItems, highlightMenuItem, isTypeaheadKey, nextMenuIndex } from './menu-keyboard';

/** A viewport coordinate a menu can be anchored to, instead of an element. */
export interface ZardMenuOrigin {
  x: number;
  y: number;
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
  /**
   * The element whose own clicks must not close the menu. It is the trigger for a dropdown — the
   * click that toggles it would otherwise register as an outside click and close it right back —
   * and nothing for a context menu, where a plain click anywhere, the trigger included, closes.
   */
  private outsideClickExempt?: ElementRef;
  /**
   * A right click ends in an `auxclick`, which the CDK reports as an outside pointer event — so the
   * very gesture that opens a context menu would close it again on mouse up. Only the first one is
   * dropped: every later right click is a real dismissal.
   */
  private skipFirstAuxClick = false;
  private renderer!: Renderer2;
  private readonly focusedIndex = signal<number>(-1);
  private outsideClickSubscription!: Subscription;
  private keydownSubscription?: Subscription;
  private unlisten: Array<() => void> = [];

  readonly isOpen = signal(false);

  constructor() {
    this.renderer = this.rendererFactory.createRenderer(null, null);
  }

  toggle(triggerElement: ElementRef, template: TemplateRef<unknown>, viewContainerRef: ViewContainerRef) {
    if (this.isOpen()) {
      this.close();
    } else {
      this.open(triggerElement, template, viewContainerRef);
    }
  }

  private open(triggerElement: ElementRef, template: TemplateRef<unknown>, viewContainerRef: ViewContainerRef) {
    if (this.isOpen()) {
      this.close();
    }

    this.triggerElement = triggerElement;
    this.outsideClickExempt = triggerElement;
    this.skipFirstAuxClick = false;
    this.createOverlay(triggerElement);
    this.attach(template, viewContainerRef);
  }

  /**
   * Opens the menu at a viewport coordinate instead of below an element — what a context menu
   * needs, since it belongs to the pointer and not to an anchor. `focusOrigin` is where `Escape`
   * and selecting an item hand the focus back to.
   */
  openAt(
    origin: ZardMenuOrigin,
    template: TemplateRef<unknown>,
    viewContainerRef: ViewContainerRef,
    focusOrigin?: ElementRef,
  ) {
    if (this.isOpen()) {
      this.close();
    }

    this.triggerElement = focusOrigin;
    this.outsideClickExempt = undefined;
    this.skipFirstAuxClick = true;
    this.createPointOverlay(origin);
    this.attach(template, viewContainerRef);
  }

  private attach(template: TemplateRef<unknown>, viewContainerRef: ViewContainerRef) {
    if (!this.overlayRef) {
      return;
    }

    this.portal = new TemplatePortal(template, viewContainerRef);
    this.overlayRef.attach(this.portal);

    // Setup keyboard navigation
    setTimeout(() => {
      this.setupKeyboardNavigation();
    }, 0);

    /**
     * `Escape` is also taken at the overlay level, not only on the surface: the CDK routes it to
     * the top-most overlay whatever holds the focus, so the menu still closes after a click that
     * left the focus on the body. The dispatcher only ever feeds the top overlay, so an open
     * submenu keeps its own `Escape` to itself.
     */
    this.keydownSubscription = this.overlayRef.keydownEvents().subscribe(event => {
      if (event.key !== 'Escape' || !this.isOpen()) {
        return;
      }

      event.preventDefault();
      this.closeAndFocusTrigger();
    });

    // Close on outside click
    const exempt = this.outsideClickExempt;
    this.outsideClickSubscription = this.overlayRef
      .outsidePointerEvents()
      .pipe(filter(event => this.closesOnOutsideEvent(event, exempt)))
      .subscribe(() => {
        this.close();
      });
    this.isOpen.set(true);
  }

  private closesOnOutsideEvent(event: MouseEvent, exempt: ElementRef | undefined): boolean {
    if (this.skipFirstAuxClick && event.type === 'auxclick') {
      this.skipFirstAuxClick = false;
      return false;
    }

    return !exempt?.nativeElement.contains(event.target);
  }

  getTriggerElement(): ElementRef | undefined {
    return this.triggerElement;
  }

  close() {
    if (this.overlayRef?.hasAttached()) {
      this.overlayRef.detach();
    }
    this.focusedIndex.set(-1);
    this.unlisten.forEach(unlisten => unlisten());
    this.unlisten = [];
    this.destroyOverlay();
    this.isOpen.set(false);
    this.triggerElement = undefined;
    this.outsideClickExempt = undefined;
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

  private createOverlay(triggerElement: ElementRef) {
    if (this.overlayRef) {
      this.destroyOverlay();
    }

    const positionStrategy = this.overlayPositionBuilder
      .flexibleConnectedTo(triggerElement)
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
  }

  /**
   * Anchored to a zero-sized rect at the pointer. The four positions are the four quadrants it can
   * grow into, so the menu flips instead of spilling out of the viewport, and `close()` as the
   * scroll strategy matches every native context menu: scrolling dismisses it.
   */
  private createPointOverlay(origin: ZardMenuOrigin) {
    if (this.overlayRef) {
      this.destroyOverlay();
    }

    const positionStrategy = this.overlayPositionBuilder
      .flexibleConnectedTo(origin)
      .withPositions([
        { originX: 'start', originY: 'bottom', overlayX: 'start', overlayY: 'top' },
        { originX: 'end', originY: 'bottom', overlayX: 'end', overlayY: 'top' },
        { originX: 'start', originY: 'top', overlayX: 'start', overlayY: 'bottom' },
        { originX: 'end', originY: 'top', overlayX: 'end', overlayY: 'bottom' },
      ])
      .withFlexibleDimensions(false)
      .withPush(true);

    this.overlayRef = this.overlay.create({
      positionStrategy,
      hasBackdrop: false,
      scrollStrategy: this.overlay.scrollStrategies.close(),
    });
  }

  private destroyOverlay() {
    this.overlayRef?.dispose();
    this.overlayRef = undefined;
    this.outsideClickSubscription?.unsubscribe();
    this.keydownSubscription?.unsubscribe();
    this.keydownSubscription = undefined;
  }

  private setupKeyboardNavigation() {
    if (!this.overlayRef?.hasAttached() || !isPlatformBrowser(this.platformId)) {
      return;
    }

    const dropdownElement = this.overlayRef.overlayElement.querySelector('[role="menu"]') as HTMLElement;
    if (!dropdownElement) {
      return;
    }

    this.unlisten.push(
      this.renderer.listen(
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
      ),
    );

    // A right click inside the surface must not strand the keyboard: the press blurs the focused
    // row, so the surface takes the focus back instead of leaving it on the body.
    this.unlisten.push(
      this.renderer.listen(dropdownElement, 'contextmenu', (event: MouseEvent) => {
        event.preventDefault();
        dropdownElement.focus();
      }),
    );

    // Typeahead: a printable key jumps to the next row whose label starts with it.
    this.unlisten.push(
      this.renderer.listen(dropdownElement, 'keydown', (event: KeyboardEvent) => {
        if (!isTypeaheadKey(event)) {
          return;
        }

        const items = this.getDropdownItems();
        const match = findMenuItemByChar(items, event.key, this.focusedIndex());
        if (match === -1) {
          return;
        }

        event.preventDefault();
        this.focusItemAtIndex(items, match);
      }),
    );

    // Focus dropdown container
    dropdownElement.focus();
  }

  private getDropdownItems(): HTMLElement[] {
    if (!this.overlayRef?.hasAttached()) {
      return [];
    }

    return getMenuItems(this.overlayRef.overlayElement);
  }

  private navigateItems(direction: number, items: HTMLElement[]) {
    this.focusItemAtIndex(items, nextMenuIndex(items, this.focusedIndex(), direction));
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
    highlightMenuItem(items, focusedIndex);
  }
}
```

```angular-ts
export * from './dropdown.component';
export * from './dropdown-item.component';
export * from './dropdown-menu-content.component';
export * from './dropdown-primitives.component';
export * from './dropdown-submenu.component';
export * from './dropdown-trigger.directive';
export * from './dropdown.service';
export * from './dropdown.imports';
export * from './dropdown.variants';
export * from './menu-keyboard';
```

```angular-ts
/**
 * Roving focus shared by every menu surface — the overlay the dropdown service owns and the
 * submenu overlay a sub-trigger opens. Both navigate the same primitives, so the item lookup,
 * the `data-highlighted` bookkeeping and the typeahead live here instead of in each of them.
 */

/** Every row of a menu surface that can take focus, in DOM order. */
export const ZARD_MENU_ITEM_SELECTOR = [
  'z-dropdown-menu-item',
  '[z-dropdown-menu-item]',
  'z-dropdown-menu-checkbox-item',
  '[z-dropdown-menu-checkbox-item]',
  'z-dropdown-menu-radio-item',
  '[z-dropdown-menu-radio-item]',
  'z-dropdown-menu-sub-trigger',
  '[z-dropdown-menu-sub-trigger]',
].join(', ');

export function getMenuItems(root: HTMLElement): HTMLElement[] {
  return Array.from(root.querySelectorAll<HTMLElement>(ZARD_MENU_ITEM_SELECTOR)).filter(
    item => item.dataset['disabled'] === undefined,
  );
}

/** Moves the focus to `index` and keeps `data-highlighted` on that row alone. */
export function highlightMenuItem(items: HTMLElement[], index: number): void {
  for (let i = 0; i < items.length; i++) {
    const item = items[i];
    if (i === index) {
      item.focus();
      item.dataset['highlighted'] = '';
    } else {
      delete item.dataset['highlighted'];
    }
  }
}

/** Wraps `from` by `direction`, starting at either end when nothing is focused yet. */
export function nextMenuIndex(items: HTMLElement[], from: number, direction: number): number {
  if (items.length === 0) {
    return -1;
  }
  if (from === -1) {
    return direction > 0 ? 0 : items.length - 1;
  }

  const next = from + direction;
  if (next < 0) {
    return items.length - 1;
  }
  if (next >= items.length) {
    return 0;
  }
  return next;
}

/**
 * Typeahead: the next row whose label starts with `char`, searched forward from the focused one
 * so repeated presses cycle through the matches instead of sticking to the first.
 */
export function findMenuItemByChar(items: HTMLElement[], char: string, from: number): number {
  const needle = char.toLowerCase();

  for (let step = 1; step <= items.length; step++) {
    const index = (Math.max(from, -1) + step) % items.length;
    if (items[index].textContent?.trim().toLowerCase().startsWith(needle)) {
      return index;
    }
  }

  return -1;
}

/** True for a key that should drive typeahead rather than an action. */
export function isTypeaheadKey(event: KeyboardEvent): boolean {
  return event.key.length === 1 && event.key !== ' ' && !event.ctrlKey && !event.metaKey && !event.altKey;
}
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
