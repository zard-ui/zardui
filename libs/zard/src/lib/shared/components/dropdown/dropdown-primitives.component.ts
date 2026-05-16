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
import { dropdownItemVariants, type ZardDropdownItemTypeVariants } from './dropdown.variants';

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

  protected readonly classes = computed(() => mergeClasses(this.class()));
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

  protected readonly classes = computed(() => mergeClasses('bg-border -mx-1 my-1 h-px', this.class()));
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
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  providers: [
    { provide: ZARD_DROPDOWN_RADIO_GROUP, useExisting: forwardRef(() => ZardDropdownMenuRadioGroupComponent) },
  ],
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

  protected readonly classes = computed(() => mergeClasses(this.class()));

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
