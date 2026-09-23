---
title: Command
description: Fast, composable, unstyled command menu for Angular.
---

# Command

Fast, composable, unstyled command menu for Angular.

## Installation

### CLI

```bash
npx zard-cli@latest add command
```

### Manual

```angular-ts
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  contentChild,
  contentChildren,
  effect,
  forwardRef,
  input,
  output,
  signal,
  ViewEncapsulation,
} from '@angular/core';
import { type ControlValueAccessor, FormsModule, NG_VALUE_ACCESSOR } from '@angular/forms';

import type { IconName } from '@ng-icons/core';
import type { ClassValue } from 'clsx';

import { ZardCommandInputComponent } from '@/shared/components/command/command-input.component';
import { ZardCommandOptionComponent } from '@/shared/components/command/command-option.component';
import { commandVariants } from '@/shared/components/command/command.variants';
import { mergeClasses } from '@/shared/utils/merge-classes';

import { ZardCommand } from './command.tokens';

export interface ZardCommandOption {
  value: unknown;
  label: string;
  disabled?: boolean;
  command?: string;
  shortcut?: string;
  icon?: IconName;
  action?: () => void;
  key?: string;
}

export interface ZardCommandGroup {
  label: string;
  options: ZardCommandOption[];
}

export interface ZardCommandConfig {
  placeholder?: string;
  emptyText?: string;
  groups: ZardCommandGroup[];
  dividers?: boolean;
  onSelect?: (option: ZardCommandOption) => void;
}

@Component({
  selector: 'z-command',
  imports: [FormsModule],
  template: `
    <div [class]="classes()">
      <div id="command-instructions" class="sr-only">
        Use arrow keys to navigate, Enter to select, Escape to clear selection.
      </div>
      <div id="command-status" class="sr-only" aria-live="polite" aria-atomic="true">
        {{ statusMessage() }}
      </div>
      <ng-content />
    </div>
  `,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => ZardCommandComponent),
      multi: true,
    },
    {
      provide: ZardCommand,
      useExisting: forwardRef(() => ZardCommandComponent),
    },
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: {
    'data-slot': 'command',
    role: 'combobox',
    'aria-haspopup': 'listbox',
    '[attr.aria-expanded]': 'true',
    '(keydown.{arrowdown,arrowup,enter,escape}.prevent)': 'onKeyDown($event)',
  },
  exportAs: 'zCommand',
})
export class ZardCommandComponent implements ControlValueAccessor, ZardCommand {
  private readonly commandInput = contentChild(ZardCommandInputComponent);
  private readonly optionComponentsAsChildren = contentChildren(ZardCommandOptionComponent, { descendants: true });
  private readonly registeredOptionComponents = signal<ZardCommandOptionComponent[]>([]);

  readonly class = input<ClassValue>('');

  readonly zCommandChange = output<ZardCommandOption>();
  readonly zCommandSelected = output<ZardCommandOption>();

  // Internal signals for search functionality
  readonly searchTerm = signal('');
  readonly selectedIndex = signal(0);

  /**
   * Clamps selectedIndex to valid bounds of filteredOptions and skips disabled
   * options. Returns -1 when there are no enabled options to highlight.
   */
  private readonly resolvedIndex = computed(() => {
    const options = this.filteredOptions();
    const len = options.length;
    if (len === 0) {
      return -1;
    }

    const raw = this.selectedIndex();
    const target = raw < 0 || raw >= len ? 0 : raw;

    if (!options[target].zDisabled()) {
      return target;
    }

    for (let i = 1; i < len; i++) {
      const candidate = (target + i) % len;
      if (!options[candidate].zDisabled()) {
        return candidate;
      }
    }
    return -1;
  });

  /**
   * Finds the next enabled option index in the given direction, wrapping
   * around. Returns -1 if there is no enabled option.
   */
  private findEnabledIndex(from: number, direction: 1 | -1, options: readonly ZardCommandOptionComponent[]): number {
    const len = options.length;
    if (len === 0) {
      return -1;
    }
    let idx = from;
    for (let i = 0; i < len; i++) {
      idx = (idx + direction + len) % len;
      if (!options[idx].zDisabled()) {
        return idx;
      }
    }
    return -1;
  }

  protected readonly optionComponents = computed(() =>
    this.optionComponentsAsChildren().length ? this.optionComponentsAsChildren() : this.registeredOptionComponents(),
  );

  registerOption(option: ZardCommandOptionComponent) {
    this.registeredOptionComponents.update(current => [...current, option]);
  }

  unregisterOption(option: ZardCommandOptionComponent) {
    this.registeredOptionComponents.update(current => current.filter(o => o !== option));
  }

  // Signal to trigger updates when optionComponents change
  private readonly optionsUpdateTrigger = signal(0);

  protected readonly classes = computed(() => mergeClasses(commandVariants(), this.class()));

  // Computed signal for filtered options - this will automatically update when searchTerm or options change
  readonly filteredOptions = computed(() => {
    const searchTerm = this.searchTerm();
    // Include the trigger signal to make this computed reactive to option changes
    this.optionsUpdateTrigger();

    if (!this.optionComponents()) {
      return [];
    }

    const lowerSearchTerm = searchTerm.toLowerCase().trim();
    if (!lowerSearchTerm) {
      return this.optionComponents();
    }

    return this.optionComponents().filter(option => {
      const label = option.zLabel().toLowerCase();
      const command = option.zCommand()?.toLowerCase() ?? '';
      return label.includes(lowerSearchTerm) || command.includes(lowerSearchTerm);
    });
  });

  /**
   * True when there is a search term and no results match. Useful to render
   * an empty state next to the command list (e.g. <z-empty />).
   */
  readonly isEmpty = computed(() => {
    const searchTerm = this.searchTerm().trim();
    if (!searchTerm) {
      return false;
    }
    return this.filteredOptions().length === 0;
  });

  // Status message for screen readers
  protected readonly statusMessage = computed(() => {
    const searchTerm = this.searchTerm().trim();
    const filteredCount = this.filteredOptions().length;

    if (!searchTerm) {
      return searchTerm;
    }

    if (!filteredCount) {
      return `No results found for "${searchTerm}"`;
    }

    return `${filteredCount} result${filteredCount === 1 ? '' : 's'} found for "${searchTerm}"`;
  });

  private onChange = (_value: unknown) => {
    // ControlValueAccessor implementation
  };

  private onTouched = () => {
    // ControlValueAccessor implementation
  };

  constructor() {
    this.triggerOptionsUpdate();

    effect(() => {
      const idx = this.resolvedIndex();
      this.filteredOptions().forEach((opt, i) => opt.setSelected(i === idx));
    });
  }

  /**
   * Trigger an update to the filteredOptions computed signal
   */
  private triggerOptionsUpdate(): void {
    this.optionsUpdateTrigger.update(value => value + 1);
  }

  onSearch(searchTerm: string) {
    this.searchTerm.set(searchTerm);
    this.selectedIndex.set(0);
  }

  /**
   * Sets the active item by index. Called by command-option on mouseenter
   * and by command-list on mouseleave (with 0 to reset to first).
   */
  setActiveByIndex(index: number) {
    this.selectedIndex.set(index);
  }

  selectOption(option: ZardCommandOptionComponent) {
    const commandOption: ZardCommandOption = {
      value: option.zValue(),
      label: option.zLabel(),
      disabled: option.zDisabled(),
      command: option.zCommand(),
      shortcut: option.zShortcut(),
      icon: option.zIcon(),
    };

    this.onChange(commandOption.value);
    this.zCommandChange.emit(commandOption);
    this.zCommandSelected.emit(commandOption);
  }

  // in @Component host: '(keydown)': 'onKeyDown($event)'
  onKeyDown(event: Event) {
    const filteredOptions = this.filteredOptions();
    if (filteredOptions.length === 0) {
      return;
    }

    const { key } = event as KeyboardEvent;
    const currentIndex = this.resolvedIndex();

    switch (key) {
      case 'ArrowDown': {
        const nextIndex = this.findEnabledIndex(currentIndex, 1, filteredOptions);
        if (nextIndex >= 0) {
          this.selectedIndex.set(nextIndex);
          filteredOptions[nextIndex].scrollIntoView();
        }
        break;
      }
      case 'ArrowUp': {
        const prevIndex = this.findEnabledIndex(currentIndex, -1, filteredOptions);
        if (prevIndex >= 0) {
          this.selectedIndex.set(prevIndex);
          filteredOptions[prevIndex].scrollIntoView();
        }
        break;
      }
      case 'Enter':
        if (currentIndex >= 0 && currentIndex < filteredOptions.length) {
          const selectedOption = filteredOptions[currentIndex];
          if (!selectedOption.zDisabled()) {
            this.selectOption(selectedOption);
          }
        }
        break;
      case 'Escape':
        this.selectedIndex.set(0);
        break;
    }
  }

  // ControlValueAccessor implementation
  writeValue(_value: unknown): void {
    // Implementation if needed for form control integration
  }

  registerOnChange(fn: (value: unknown) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(_isDisabled: boolean): void {
    // Implementation if needed for form control disabled state
  }

  /**
   * Refresh the options list - useful when options are added/removed dynamically
   */
  refreshOptions(): void {
    this.triggerOptionsUpdate();
  }

  /**
   * Focus the command input
   */
  focus(): void {
    this.commandInput()?.focus();
  }
}
```

```angular-ts
import { cva, type VariantProps } from 'class-variance-authority';

export const commandVariants = cva(
  'flex size-full flex-col overflow-hidden rounded-xl bg-popover p-1 text-popover-foreground border shadow-md',
);

export const commandListVariants = cva(
  'no-scrollbar max-h-72 scroll-py-1 overflow-x-hidden overflow-y-auto outline-none p-1',
);

export const commandGroupVariants = cva(
  'overflow-hidden text-foreground **:data-[slot=command-group-heading]:px-2 **:data-[slot=command-group-heading]:py-1.5 **:data-[slot=command-group-heading]:text-xs **:data-[slot=command-group-heading]:font-medium **:data-[slot=command-group-heading]:text-muted-foreground',
);

export const commandItemVariants = cva(
  [
    'group/command-item relative flex cursor-pointer items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-none select-none transition-colors',
    'data-[disabled=true]:pointer-events-none data-[disabled=true]:opacity-50',
    'data-selected:bg-muted data-selected:text-accent-foreground',
    "[&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
    'data-selected:*:[svg]:text-accent-foreground',
  ],
  {
    variants: {
      variant: {
        default: '',
        // Tinted background, destructive text — the same treatment as the
        // destructive button and dropdown item. It used to be a solid
        // `bg-destructive` with `text-destructive-foreground`, a token no theme
        // ever defined, so the text stayed dark on red.
        destructive:
          'text-destructive data-selected:bg-destructive/10 data-selected:text-destructive dark:data-selected:bg-destructive/20',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  },
);

export const commandSeparatorVariants = cva('-mx-1 my-1 h-px bg-border');

export const commandShortcutVariants = cva(
  'ml-auto text-xs tracking-widest text-muted-foreground group-data-selected/command-item:text-accent-foreground',
);

export type ZardCommandItemVariants = NonNullable<VariantProps<typeof commandItemVariants>['variant']>;
```

```angular-ts
import { ChangeDetectionStrategy, Component, computed, inject, input, ViewEncapsulation } from '@angular/core';

import type { ClassValue } from 'clsx';

import { ZardCommandComponent } from '@/shared/components/command/command.component';
import { commandSeparatorVariants } from '@/shared/components/command/command.variants';
import { mergeClasses } from '@/shared/utils/merge-classes';

@Component({
  selector: 'z-command-divider',
  template: `
    @if (shouldShow()) {
      <div [class]="classes()" role="separator" data-slot="command-separator"></div>
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  exportAs: 'zCommandDivider',
})
export class ZardCommandDividerComponent {
  private readonly commandComponent = inject(ZardCommandComponent, { optional: true });

  readonly class = input<ClassValue>('');

  protected readonly classes = computed(() => mergeClasses(commandSeparatorVariants(), this.class()));

  protected readonly shouldShow = computed(() => {
    if (!this.commandComponent) {
      return true;
    }

    const searchTerm = this.commandComponent.searchTerm();

    // If no search, always show dividers
    if (searchTerm === '') {
      return true;
    }

    // If there's a search term, hide all dividers for now
    // This is a simple approach - we can make it smarter later
    return false;
  });
}
```

```angular-ts
import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  forwardRef,
  inject,
  input,
  output,
  signal,
  viewChild,
  ViewEncapsulation,
} from '@angular/core';
import { type ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideSearch } from '@ng-icons/lucide';

import { ZardCommand } from '@/shared/components/command/command.tokens';
import { ZardInputComponent } from '@/shared/components/input/input.component';
import { ZardInputGroupImports } from '@/shared/components/input-group/input-group.imports';

@Component({
  selector: 'z-command-input',
  imports: [NgIcon, ZardInputComponent, ...ZardInputGroupImports],
  template: `
    <div data-slot="command-input-wrapper" class="p-1 pb-0">
      <z-input-group
        class="border-input/30 has-[input:focus-visible]:border-input/30! shadow-none! has-[input:focus-visible]:ring-0!"
      >
        <z-input-group-addon>
          <ng-icon name="lucideSearch" class="size-4! shrink-0 opacity-50" />
        </z-input-group-addon>
        <input
          z-input
          #searchInput
          [placeholder]="placeholder()"
          [value]="searchTerm()"
          [disabled]="disabled()"
          (input)="onInput($event)"
          (keydown)="onKeyDown($event)"
          (blur)="onTouched()"
          aria-controls="command-list"
          aria-describedby="command-instructions"
          aria-haspopup="listbox"
          aria-label="Search commands"
          autocomplete="off"
          autocorrect="off"
          spellcheck="false"
          role="combobox"
          [attr.aria-expanded]="true"
        />
      </z-input-group>
    </div>
  `,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => ZardCommandInputComponent),
      multi: true,
    },
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  viewProviders: [provideIcons({ lucideSearch })],
  exportAs: 'zCommandInput',
})
export class ZardCommandInputComponent implements ControlValueAccessor {
  private readonly commandComponent = inject(ZardCommand, { optional: true });
  // `#searchInput` sits on an `input[z-input]` component, so read the element explicitly.
  readonly searchInput = viewChild<unknown, ElementRef<HTMLInputElement>>('searchInput', { read: ElementRef });

  readonly placeholder = input<string>('Type a command or search...');

  readonly valueChange = output<string>();

  readonly searchTerm = signal('');
  readonly disabled = signal(false);

  protected onChange = (_: string) => {
    /* CVA */
  };

  protected onTouched = () => {
    /* CVA */
  };

  onInput(event: Event) {
    const { value } = event.target as HTMLInputElement;
    this.updateParentComponents(value);
  }

  updateParentComponents(value: string): void {
    this.searchTerm.set(value);
    this.commandComponent?.onSearch(value);
    this.onChange(value);
    this.valueChange.emit(value);
  }

  onKeyDown(event: KeyboardEvent) {
    if (['ArrowDown', 'ArrowUp', 'Enter', 'Escape'].includes(event.key)) {
      if (event.key !== 'Escape') {
        event.preventDefault();
        event.stopPropagation();
      }
      this.commandComponent?.onKeyDown(event);
    }
  }

  writeValue(value: string | null): void {
    const normalized = value ?? '';
    this.searchTerm.set(normalized);
    this.commandComponent?.onSearch(normalized);
  }

  registerOnChange(fn: (value: string) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled.set(isDisabled);
  }

  focus(): void {
    this.searchInput()?.nativeElement?.focus();
  }
}
```

```angular-ts
import { ChangeDetectionStrategy, Component, computed, input, ViewEncapsulation } from '@angular/core';

import type { ClassValue } from 'clsx';

import { commandListVariants } from '@/shared/components/command/command.variants';
import { mergeClasses } from '@/shared/utils/merge-classes';

@Component({
  selector: 'z-command-list',
  template: `
    <div [class]="classes()" role="listbox" id="command-list" data-slot="command-list">
      <ng-content />
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  exportAs: 'zCommandList',
})
export class ZardCommandListComponent {
  readonly class = input<ClassValue>('');

  protected readonly classes = computed(() => mergeClasses(commandListVariants(), this.class()));
}
```

```angular-ts
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  contentChildren,
  inject,
  input,
  signal,
  ViewEncapsulation,
} from '@angular/core';

import type { ClassValue } from 'clsx';

import { ZardCommandOptionComponent } from '@/shared/components/command/command-option.component';
import { ZardCommandComponent } from '@/shared/components/command/command.component';
import { commandGroupVariants } from '@/shared/components/command/command.variants';
import { mergeClasses } from '@/shared/utils/merge-classes';

export abstract class ZardCommandOptionGroup {
  abstract registerOption(option: ZardCommandOptionComponent): void;
  abstract unregisterOption(option: ZardCommandOptionComponent): void;
}

@Component({
  selector: 'z-command-option-group',
  template: `
    @if (isGroupVisible()) {
      <div [class]="classes()" role="group" data-slot="command-group">
        @if (zLabel()) {
          <div data-slot="command-group-heading" role="presentation">
            {{ zLabel() }}
          </div>
        }
        <div role="group">
          <ng-content />
        </div>
      </div>
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  exportAs: 'zCommandOptionGroup',
})
export class ZardCommandOptionGroupComponent implements ZardCommandOptionGroup {
  private readonly commandComponent = inject(ZardCommandComponent, { optional: true });
  private readonly optionComponentsAsChildren = contentChildren(ZardCommandOptionComponent, { descendants: true });
  private readonly registeredOptionComponents = signal<ZardCommandOptionComponent[]>([]);

  readonly zLabel = input.required<string>();
  readonly class = input<ClassValue>('');

  protected readonly classes = computed(() => mergeClasses(commandGroupVariants(), this.class()));
  private readonly optionComponents = computed(() =>
    this.optionComponentsAsChildren().length ? this.optionComponentsAsChildren() : this.registeredOptionComponents(),
  );

  protected readonly isGroupVisible = computed(() => {
    if (!this.commandComponent || !this.optionComponents().length) {
      return true;
    }

    const searchTerm = this.commandComponent.searchTerm();
    // If no search term, show all groups
    if (!searchTerm) {
      return true;
    }

    const filteredOptions = this.commandComponent.filteredOptions();
    // Check if any option in this group is in the filtered list
    return this.optionComponents().some(option => filteredOptions.includes(option));
  });

  registerOption(option: ZardCommandOptionComponent) {
    this.registeredOptionComponents.update(current => [...current, option]);
  }

  unregisterOption(option: ZardCommandOptionComponent) {
    this.registeredOptionComponents.update(current => current.filter(o => o !== option));
  }
}
```

```angular-ts
import {
  booleanAttribute,
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  ElementRef,
  inject,
  input,
  signal,
  ViewEncapsulation,
} from '@angular/core';

import { NgIcon, type IconName } from '@ng-icons/core';
import type { ClassValue } from 'clsx';

import type { ZardCommandOptionGroupComponent } from '@/shared/components/command/command-option-group.component';
import { ZardCommand } from '@/shared/components/command/command.tokens';
import {
  commandItemVariants,
  commandShortcutVariants,
  type ZardCommandItemVariants,
} from '@/shared/components/command/command.variants';
import { mergeClasses } from '@/shared/utils/merge-classes';

@Component({
  selector: 'z-command-option',
  imports: [NgIcon],
  template: `
    @if (isOptionVisible()) {
      <div
        [class]="classes()"
        data-slot="command-item"
        [attr.role]="'option'"
        [attr.aria-selected]="isSelected()"
        [attr.data-selected]="isSelected() ? '' : null"
        [attr.data-disabled]="zDisabled()"
        [attr.tabindex]="0"
        (click)="onClick()"
        (keydown.{enter,space}.prevent)="onClick()"
        (mouseenter)="onMouseEnter()"
      >
        <ng-content select="[data-slot=command-option-leading]" />
        @if (zIcon()) {
          <ng-icon [name]="zIcon()!" />
        }
        <span class="flex-1">{{ zLabel() }}</span>
        @if (zShortcut()) {
          <span [class]="shortcutClasses()" data-slot="command-shortcut">{{ zShortcut() }}</span>
        }
        <ng-content select="[data-slot=command-option-trailing]" />
      </div>
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  exportAs: 'zCommandOption',
})
export class ZardCommandOptionComponent {
  private readonly elementRef = inject(ElementRef);
  private readonly parentCommandComponent = inject(ZardCommand, { optional: true });

  readonly zValue = input.required<unknown>();
  readonly zLabel = input.required<string>();
  readonly zCommand = input<string>('');
  readonly zIcon = input<IconName>();
  readonly zShortcut = input<string>('');
  readonly zDisabled = input(false, { transform: booleanAttribute });
  readonly variant = input<ZardCommandItemVariants>('default');
  readonly class = input<ClassValue>('');
  readonly parentCommand = input<ZardCommand | null>(null);
  readonly commandGroup = input<ZardCommandOptionGroupComponent | null>(null);

  readonly isSelected = signal(false);

  protected readonly classes = computed(() =>
    mergeClasses(commandItemVariants({ variant: this.variant() }), this.class()),
  );

  protected readonly shortcutClasses = computed(() => mergeClasses(commandShortcutVariants()));

  private get commandComponent() {
    let parent = this.parentCommand();
    parent ||= this.parentCommandComponent;
    return parent;
  }

  protected readonly isOptionVisible = computed(() => {
    const parent = this.commandComponent;

    if (!parent) {
      return true;
    }
    /*
      If no search term, show this option, otherwise check
      if this option is included in the filtered list
     */
    return !parent.searchTerm() || parent.filteredOptions().includes(this);
  });

  constructor() {
    effect(onCleanup => {
      const cmd = this.parentCommand();
      const grp = this.commandGroup();

      if (cmd) {
        cmd.registerOption(this);
        onCleanup(() => cmd.unregisterOption(this));
      }

      if (grp) {
        grp.registerOption(this);
        onCleanup(() => grp.unregisterOption(this));
      }
    });
  }

  onClick() {
    if (this.zDisabled()) {
      return;
    }

    this.commandComponent?.selectOption(this);
  }

  onMouseEnter() {
    if (this.zDisabled()) {
      return;
    }
    const parent = this.commandComponent;
    if (!parent) {
      return;
    }
    const idx = parent.filteredOptions().indexOf(this);
    if (idx >= 0) {
      parent.setActiveByIndex(idx);
    }
  }

  setSelected(selected: boolean) {
    this.isSelected.set(selected);
  }

  /**
   * Brings this option into view. Focus intentionally stays on the search
   * input while navigating, so typing keeps filtering the list.
   */
  scrollIntoView() {
    this.elementRef.nativeElement.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }
}
```

```angular-ts
import { ZardCommandDividerComponent } from '@/shared/components/command/command-divider.component';
import { ZardCommandInputComponent } from '@/shared/components/command/command-input.component';
import { ZardCommandListComponent } from '@/shared/components/command/command-list.component';
import { ZardCommandOptionGroupComponent } from '@/shared/components/command/command-option-group.component';
import { ZardCommandOptionComponent } from '@/shared/components/command/command-option.component';
import { ZardCommandComponent } from '@/shared/components/command/command.component';

export const ZardCommandImports = [
  ZardCommandComponent,
  ZardCommandInputComponent,
  ZardCommandListComponent,
  ZardCommandOptionComponent,
  ZardCommandOptionGroupComponent,
  ZardCommandDividerComponent,
] as const;
```

```angular-ts
import type { Signal, WritableSignal } from '@angular/core';

import type { ZardCommandOptionComponent } from './command-option.component';

/**
 * What a command's children may ask of it.
 *
 * The input and the options need the root at runtime, and the root needs both of
 * them for its content queries — injecting the concrete `ZardCommandComponent`
 * made that a real import cycle, and the module graph is evaluated in an order
 * where one of the two classes is still undefined. The children inject this
 * instead; `ZardCommandComponent` provides itself for the token.
 *
 * The reference to `ZardCommandOptionComponent` below is type-only, so it is
 * erased at compile time and adds no edge back.
 */
export abstract class ZardCommand {
  /** The current query, empty when nothing has been typed. */
  abstract readonly searchTerm: WritableSignal<string>;
  /** The options still visible for the current query, in document order. */
  abstract readonly filteredOptions: Signal<readonly ZardCommandOptionComponent[]>;

  abstract registerOption(option: ZardCommandOptionComponent): void;
  abstract unregisterOption(option: ZardCommandOptionComponent): void;

  /** Applies a new query. */
  abstract onSearch(searchTerm: string): void;
  /** Handles the arrow / enter / escape keys the input forwards. */
  abstract onKeyDown(event: KeyboardEvent): void;

  /** Moves the active highlight, by index into {@link filteredOptions}. */
  abstract setActiveByIndex(index: number): void;
  /** Commits a choice and emits it to the consumer. */
  abstract selectOption(option: ZardCommandOptionComponent): void;
}
```

```angular-ts
export * from './command.component';
export * from './command-input.component';
export * from './command-list.component';
export * from './command-option.component';
export * from './command-option-group.component';
export * from './command-divider.component';
export * from './command.imports';
export * from './command.tokens';
export * from './command.variants';
```

## Usage

```angular-ts
import { ZardCommandImports } from '@/shared/components/command/command.imports';
```

```angular-html
<z-command #cmd="zCommand">
  <z-command-input placeholder="Type a command..." />
  <z-command-list>
    @if (cmd.isEmpty()) {
      <div class="py-6 text-center text-sm">No results found.</div>
    }
    <z-command-option-group zLabel="Suggestions">
      <z-command-option zLabel="Calendar" zValue="calendar" />
    </z-command-option-group>
  </z-command-list>
</z-command>
```

## Examples

### Basic

```angular-ts
import { type AfterViewInit, ChangeDetectionStrategy, Component, inject, viewChild } from '@angular/core';

import { ZardButtonComponent } from '@/shared/components/button/button.component';
import { ZardCommandComponent } from '@/shared/components/command/command.component';
import { ZardCommandImports } from '@/shared/components/command/command.imports';
import { ZardDialogService } from '@/shared/components/dialog/dialog.service';

@Component({
  selector: 'z-demo-command-basic-dialog',
  imports: [ZardCommandImports],
  template: `
    <z-command #cmd="zCommand">
      <z-command-input placeholder="Type a command or search..." />
      <z-command-list>
        @if (cmd.isEmpty()) {
          <div class="py-6 text-center text-sm">No results found.</div>
        }
        <z-command-option-group zLabel="Suggestions">
          <z-command-option zLabel="Calendar" zValue="calendar" />
          <z-command-option zLabel="Search Emoji" zValue="emoji" />
          <z-command-option zLabel="Calculator" zValue="calculator" />
        </z-command-option-group>
      </z-command-list>
    </z-command>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
class ZardDemoCommandBasicDialogComponent implements AfterViewInit {
  private readonly cmd = viewChild.required(ZardCommandComponent);
  ngAfterViewInit() {
    setTimeout(() => this.cmd().focus(), 0);
  }
}

@Component({
  selector: 'z-demo-command-basic',
  imports: [ZardButtonComponent],
  template: `
    <button type="button" z-button zType="outline" (click)="open()">Open Menu</button>
  `,
})
export class ZardDemoCommandBasicComponent {
  private readonly dialogService = inject(ZardDialogService);

  open() {
    this.dialogService.create({
      zContent: ZardDemoCommandBasicDialogComponent,
      zClosable: false,
      zHideFooter: true,
      zOkText: null,
      zCancelText: null,
      zMaskClosable: true,
      zWidth: '24rem',
      zCustomClasses: '!p-0 !gap-0 !border-0 !bg-transparent !shadow-none',
    });
  }
}
```

### Shortcuts

```angular-ts
import { type AfterViewInit, ChangeDetectionStrategy, Component, inject, viewChild } from '@angular/core';

import { provideIcons } from '@ng-icons/core';
import { lucideCreditCard, lucideSettings, lucideUser } from '@ng-icons/lucide';

import { ZardButtonComponent } from '@/shared/components/button/button.component';
import { ZardCommandComponent } from '@/shared/components/command/command.component';
import { ZardCommandImports } from '@/shared/components/command/command.imports';
import { ZardDialogService } from '@/shared/components/dialog/dialog.service';

@Component({
  selector: 'z-demo-command-shortcuts-dialog',
  imports: [ZardCommandImports],
  template: `
    <z-command #cmd="zCommand">
      <z-command-input placeholder="Type a command or search..." />
      <z-command-list>
        @if (cmd.isEmpty()) {
          <div class="py-6 text-center text-sm">No results found.</div>
        }
        <z-command-option-group zLabel="Settings">
          <z-command-option zLabel="Profile" zValue="profile" zIcon="lucideUser" zShortcut="⌘P" />
          <z-command-option zLabel="Billing" zValue="billing" zIcon="lucideCreditCard" zShortcut="⌘B" />
          <z-command-option zLabel="Settings" zValue="settings" zIcon="lucideSettings" zShortcut="⌘S" />
        </z-command-option-group>
      </z-command-list>
    </z-command>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  viewProviders: [provideIcons({ lucideUser, lucideCreditCard, lucideSettings })],
})
class ZardDemoCommandShortcutsDialogComponent implements AfterViewInit {
  private readonly cmd = viewChild.required(ZardCommandComponent);
  ngAfterViewInit() {
    setTimeout(() => this.cmd().focus(), 0);
  }
}

@Component({
  selector: 'z-demo-command-shortcuts',
  imports: [ZardButtonComponent],
  template: `
    <button type="button" z-button zType="outline" (click)="open()">Open Menu</button>
  `,
})
export class ZardDemoCommandShortcutsComponent {
  private readonly dialogService = inject(ZardDialogService);

  open() {
    this.dialogService.create({
      zContent: ZardDemoCommandShortcutsDialogComponent,
      zClosable: false,
      zHideFooter: true,
      zOkText: null,
      zCancelText: null,
      zMaskClosable: true,
      zWidth: '24rem',
      zCustomClasses: '!p-0 !gap-0 !border-0 !bg-transparent !shadow-none',
    });
  }
}
```

### Groups

```angular-ts
import { type AfterViewInit, ChangeDetectionStrategy, Component, inject, viewChild } from '@angular/core';

import { provideIcons } from '@ng-icons/core';
import {
  lucideCalculator,
  lucideCalendar,
  lucideCreditCard,
  lucideSettings,
  lucideSmile,
  lucideUser,
} from '@ng-icons/lucide';

import { ZardButtonComponent } from '@/shared/components/button/button.component';
import { ZardCommandComponent } from '@/shared/components/command/command.component';
import { ZardCommandImports } from '@/shared/components/command/command.imports';
import { ZardDialogService } from '@/shared/components/dialog/dialog.service';

@Component({
  selector: 'z-demo-command-groups-dialog',
  imports: [ZardCommandImports],
  template: `
    <z-command #cmd="zCommand">
      <z-command-input placeholder="Type a command or search..." />
      <z-command-list>
        @if (cmd.isEmpty()) {
          <div class="py-6 text-center text-sm">No results found.</div>
        }

        <z-command-option-group zLabel="Suggestions">
          <z-command-option zLabel="Calendar" zValue="calendar" zIcon="lucideCalendar" />
          <z-command-option zLabel="Search Emoji" zValue="emoji" zIcon="lucideSmile" />
          <z-command-option zLabel="Calculator" zValue="calculator" zIcon="lucideCalculator" />
        </z-command-option-group>

        <z-command-divider />

        <z-command-option-group zLabel="Settings">
          <z-command-option zLabel="Profile" zValue="profile" zIcon="lucideUser" zShortcut="⌘P" />
          <z-command-option zLabel="Billing" zValue="billing" zIcon="lucideCreditCard" zShortcut="⌘B" />
          <z-command-option zLabel="Settings" zValue="settings" zIcon="lucideSettings" zShortcut="⌘S" />
        </z-command-option-group>
      </z-command-list>
    </z-command>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  viewProviders: [
    provideIcons({ lucideCalendar, lucideSmile, lucideCalculator, lucideUser, lucideCreditCard, lucideSettings }),
  ],
})
class ZardDemoCommandGroupsDialogComponent implements AfterViewInit {
  private readonly cmd = viewChild.required(ZardCommandComponent);
  ngAfterViewInit() {
    setTimeout(() => this.cmd().focus(), 0);
  }
}

@Component({
  selector: 'z-demo-command-groups',
  imports: [ZardButtonComponent],
  template: `
    <button type="button" z-button zType="outline" (click)="open()">Open Menu</button>
  `,
})
export class ZardDemoCommandGroupsComponent {
  private readonly dialogService = inject(ZardDialogService);

  open() {
    this.dialogService.create({
      zContent: ZardDemoCommandGroupsDialogComponent,
      zClosable: false,
      zHideFooter: true,
      zOkText: null,
      zCancelText: null,
      zMaskClosable: true,
      zWidth: '24rem',
      zCustomClasses: '!p-0 !gap-0 !border-0 !bg-transparent !shadow-none',
    });
  }
}
```

### Scrollable

```angular-ts
import { type AfterViewInit, ChangeDetectionStrategy, Component, inject, viewChild } from '@angular/core';

import { provideIcons } from '@ng-icons/core';
import {
  lucideBell,
  lucideCalculator,
  lucideCalendar,
  lucideCircleHelp,
  lucideClipboardPaste,
  lucideCode,
  lucideCopy,
  lucideCreditCard,
  lucideFileText,
  lucideFolder,
  lucideFolderPlus,
  lucideHouse,
  lucideImage,
  lucideInbox,
  lucideLayoutGrid,
  lucideList,
  lucidePlus,
  lucideScissors,
  lucideSettings,
  lucideTrash2,
  lucideUser,
  lucideZoomIn,
  lucideZoomOut,
} from '@ng-icons/lucide';

import { ZardButtonComponent } from '@/shared/components/button/button.component';
import { ZardCommandComponent } from '@/shared/components/command/command.component';
import { ZardCommandImports } from '@/shared/components/command/command.imports';
import { ZardDialogService } from '@/shared/components/dialog/dialog.service';

@Component({
  selector: 'z-demo-command-scrollable-dialog',
  imports: [ZardCommandImports],
  template: `
    <z-command #cmd="zCommand">
      <z-command-input placeholder="Type a command or search..." />
      <z-command-list>
        @if (cmd.isEmpty()) {
          <div class="py-6 text-center text-sm">No results found.</div>
        }

        <z-command-option-group zLabel="Navigation">
          <z-command-option zLabel="Home" zValue="home" zIcon="lucideHouse" zShortcut="⌘H" />
          <z-command-option zLabel="Inbox" zValue="inbox" zIcon="lucideInbox" zShortcut="⌘I" />
          <z-command-option zLabel="Documents" zValue="documents" zIcon="lucideFileText" zShortcut="⌘D" />
          <z-command-option zLabel="Folders" zValue="folders" zIcon="lucideFolder" zShortcut="⌘F" />
        </z-command-option-group>

        <z-command-divider />

        <z-command-option-group zLabel="Actions">
          <z-command-option zLabel="New File" zValue="new-file" zIcon="lucidePlus" zShortcut="⌘N" />
          <z-command-option zLabel="New Folder" zValue="new-folder" zIcon="lucideFolderPlus" zShortcut="⇧⌘N" />
          <z-command-option zLabel="Copy" zValue="copy" zIcon="lucideCopy" zShortcut="⌘C" />
          <z-command-option zLabel="Cut" zValue="cut" zIcon="lucideScissors" zShortcut="⌘X" />
          <z-command-option zLabel="Paste" zValue="paste" zIcon="lucideClipboardPaste" zShortcut="⌘V" />
          <z-command-option zLabel="Delete" zValue="delete" zIcon="lucideTrash2" zShortcut="⌫" />
        </z-command-option-group>

        <z-command-divider />

        <z-command-option-group zLabel="View">
          <z-command-option zLabel="Grid View" zValue="grid" zIcon="lucideLayoutGrid" />
          <z-command-option zLabel="List View" zValue="list" zIcon="lucideList" />
          <z-command-option zLabel="Zoom In" zValue="zoom-in" zIcon="lucideZoomIn" zShortcut="⌘+" />
          <z-command-option zLabel="Zoom Out" zValue="zoom-out" zIcon="lucideZoomOut" zShortcut="⌘-" />
        </z-command-option-group>

        <z-command-divider />

        <z-command-option-group zLabel="Account">
          <z-command-option zLabel="Profile" zValue="profile" zIcon="lucideUser" zShortcut="⌘P" />
          <z-command-option zLabel="Billing" zValue="billing" zIcon="lucideCreditCard" zShortcut="⌘B" />
          <z-command-option zLabel="Settings" zValue="settings" zIcon="lucideSettings" zShortcut="⌘S" />
          <z-command-option zLabel="Notifications" zValue="notifications" zIcon="lucideBell" />
          <z-command-option zLabel="Help & Support" zValue="help" zIcon="lucideCircleHelp" />
        </z-command-option-group>

        <z-command-divider />

        <z-command-option-group zLabel="Tools">
          <z-command-option zLabel="Calculator" zValue="calculator" zIcon="lucideCalculator" />
          <z-command-option zLabel="Calendar" zValue="calendar" zIcon="lucideCalendar" />
          <z-command-option zLabel="Image Editor" zValue="image" zIcon="lucideImage" />
          <z-command-option zLabel="Code Editor" zValue="code" zIcon="lucideCode" />
        </z-command-option-group>
      </z-command-list>
    </z-command>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  viewProviders: [
    provideIcons({
      lucideHouse,
      lucideInbox,
      lucideFileText,
      lucideFolder,
      lucidePlus,
      lucideFolderPlus,
      lucideCopy,
      lucideScissors,
      lucideClipboardPaste,
      lucideTrash2,
      lucideLayoutGrid,
      lucideList,
      lucideZoomIn,
      lucideZoomOut,
      lucideUser,
      lucideCreditCard,
      lucideSettings,
      lucideBell,
      lucideCircleHelp,
      lucideCalculator,
      lucideCalendar,
      lucideImage,
      lucideCode,
    }),
  ],
})
class ZardDemoCommandScrollableDialogComponent implements AfterViewInit {
  private readonly cmd = viewChild.required(ZardCommandComponent);
  ngAfterViewInit() {
    setTimeout(() => this.cmd().focus(), 0);
  }
}

@Component({
  selector: 'z-demo-command-scrollable',
  imports: [ZardButtonComponent],
  template: `
    <button type="button" z-button zType="outline" (click)="open()">Open Menu</button>
  `,
})
export class ZardDemoCommandScrollableComponent {
  private readonly dialogService = inject(ZardDialogService);

  open() {
    this.dialogService.create({
      zContent: ZardDemoCommandScrollableDialogComponent,
      zClosable: false,
      zHideFooter: true,
      zOkText: null,
      zCancelText: null,
      zMaskClosable: true,
      zWidth: '24rem',
      zCustomClasses: '!p-0 !gap-0 !border-0 !bg-transparent !shadow-none',
    });
  }
}
```

## API Reference

### z-command

The main command palette container that handles search input and keyboard navigation with debounced search, ARIA accessibility, and comprehensive keyboard navigation.

| Prop | Description | Type | Default |
| --- | --- | --- | --- |
| `[size]` | Size of the command palette | `'sm' \| 'default' \| 'lg' \| 'xl'` | `'default'` |
| `[class]` | Additional CSS classes | `string` | `''` |
| `(zCommandChange)` | Fired when the selected option changes | `output<ZardCommandOption>` | `-` |
| `(zCommandSelected)` | Fired when an option is selected | `output<ZardCommandOption>` | `-` |

### z-command-input

Search input component with debounced input handling and accessibility features.

| Prop | Description | Type | Default |
| --- | --- | --- | --- |
| `[placeholder]` | Placeholder text for input | `string` | `'Type a command or search...'` |
| `[class]` | Additional CSS classes | `string` | `''` |
| `(valueChange)` | Fired when input value changes | `EventEmitter<string>` | `-` |

### z-command-list

Container for command options with proper ARIA listbox semantics.

| Prop | Description | Type | Default |
| --- | --- | --- | --- |
| `[class]` | Additional CSS classes | `string` | `''` |

### z-command-option

Individual selectable option within the command palette with enhanced accessibility and interaction features.

| Prop | Description | Type | Default |
| --- | --- | --- | --- |
| `[zValue]` | Value of the option (required) | `any` | `-` |
| `[zLabel]` | Label text (required) | `string` | `-` |
| `[zIcon]` | Icon HTML content | `string` | `''` |
| `[zCommand]` | Command identifier | `string` | `''` |
| `[zShortcut]` | Keyboard shortcut display | `string` | `''` |
| `[zDisabled]` | Disabled state | `boolean` | `false` |
| `[variant]` | Visual variant | `'default' \| 'destructive'` | `'default'` |
| `[class]` | Additional CSS classes | `string` | `''` |

### z-command-option-group

Groups related command options together with semantic grouping and accessibility.

| Prop | Description | Type | Default |
| --- | --- | --- | --- |
| `[zLabel]` | Group label (required) | `string` | `-` |
| `[class]` | Additional CSS classes | `string` | `''` |

### z-command-divider

Visual separator between command groups with semantic role.

| Prop | Description | Type | Default |
| --- | --- | --- | --- |
| `[class]` | Additional CSS classes | `string` | `''` |

---

[Open in browser](https://zardui.com/docs/components/command)
