import {
  afterNextRender,
  booleanAttribute,
  ChangeDetectionStrategy,
  Component,
  computed,
  Directive,
  effect,
  ElementRef,
  inject,
  Injector,
  input,
  ViewEncapsulation,
} from '@angular/core';

import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideChevronDown, lucideX } from '@ng-icons/lucide';
import type { ClassValue } from 'clsx';

import {
  comboboxClearVariants,
  comboboxInputGroupVariants,
  comboboxInputHostVariants,
  comboboxTriggerVariants,
} from '@/shared/components/combobox/combobox.variants';
import { ZardInputComponent } from '@/shared/components/input/input.component';
import {
  ZardInputGroupAddonComponent,
  ZardInputGroupButtonDirective,
  ZardInputGroupComponent,
} from '@/shared/components/input-group';
import { mergeClasses } from '@/shared/utils/merge-classes';

import { ZardComboboxContentComponent } from './combobox-content.component';
import { ZardComboboxRoot } from './combobox.types';

@Directive({
  selector: 'button[z-combobox-trigger]',
  host: {
    type: 'button',
    'aria-haspopup': 'listbox',
    // Bound instead of static so it wins over the `data-slot` of a co-located `z-input-group-button`.
    '[attr.data-slot]': '"combobox-trigger"',
    '[attr.aria-controls]': 'root.listboxId',
    '[attr.aria-expanded]': 'root.open()',
    '[attr.aria-label]': 'root.ariaLabel() || "Toggle options"',
    '[attr.tabindex]': 'standalone ? "0" : "-1"',
    '[class]': 'classes()',
    '(click)': 'toggle()',
    '(mousedown)': 'onMousedown($event)',
  },
  exportAs: 'zComboboxTrigger',
})
export class ZardComboboxTriggerDirective {
  protected readonly root = inject(ZardComboboxRoot);
  private readonly elementRef = inject(ElementRef<HTMLElement>);
  private readonly inputGroup = inject(ZardInputGroupComponent, { optional: true });

  readonly class = input<ClassValue>('');

  /** A trigger rendered outside a `z-input-group` opens the popup on its own and anchors it. */
  protected readonly standalone = this.inputGroup === null;

  protected readonly classes = computed(() =>
    mergeClasses(comboboxTriggerVariants({ zStandalone: this.standalone }), this.class()),
  );

  constructor() {
    if (this.standalone) {
      this.root.registerAnchor(this.elementRef.nativeElement, 'trigger');
    }
  }

  protected toggle(): void {
    if (this.root.disabled()) {
      return;
    }

    if (this.root.open()) {
      this.root.closePanel();
    } else {
      this.root.openPanel();
    }

    this.root.focusInput();
  }

  /** Keeps the caret inside the combobox input when the trigger is clicked. */
  protected onMousedown(event: MouseEvent): void {
    event.preventDefault();
  }
}

@Directive({
  selector: 'button[z-combobox-clear]',
  host: {
    type: 'button',
    tabindex: '-1',
    // Bound instead of static so it wins over the `data-slot` of a co-located `z-input-group-button`.
    // The `group-has-data-[slot=combobox-clear]/input-group:hidden` rule on the trigger depends on it.
    '[attr.data-slot]': '"combobox-clear"',
    '[attr.aria-label]': '"Clear selection"',
    '[class]': 'classes()',
    '(click)': 'clear()',
    '(mousedown)': 'onMousedown($event)',
  },
  exportAs: 'zComboboxClear',
})
export class ZardComboboxClearDirective {
  protected readonly root = inject(ZardComboboxRoot);

  readonly class = input<ClassValue>('');

  protected readonly classes = computed(() => mergeClasses(comboboxClearVariants(), this.class()));

  protected clear(): void {
    if (this.root.disabled()) {
      return;
    }

    this.root.clear();
    this.root.focusInput();
  }

  protected onMousedown(event: MouseEvent): void {
    event.preventDefault();
  }
}

@Component({
  selector: 'z-combobox-input',
  imports: [
    NgIcon,
    ZardComboboxClearDirective,
    ZardComboboxTriggerDirective,
    ZardInputComponent,
    ZardInputGroupAddonComponent,
    ZardInputGroupButtonDirective,
    ZardInputGroupComponent,
  ],
  template: `
    <z-input-group [class]="inputGroupClasses()">
      <input
        z-input
        type="text"
        role="combobox"
        autocomplete="off"
        aria-autocomplete="list"
        [attr.aria-activedescendant]="root.highlightedItem()?.id ?? null"
        [attr.aria-controls]="root.listboxId"
        [attr.aria-describedby]="root.ariaDescribedBy() || null"
        [attr.aria-expanded]="root.open()"
        [attr.aria-invalid]="root.zInvalid() ? 'true' : null"
        [attr.aria-label]="root.ariaLabel() || null"
        [disabled]="disabled()"
        [id]="root.inputId"
        [placeholder]="placeholderText()"
        [readOnly]="!root.searchable()"
        [value]="displayText()"
        (blur)="onBlur()"
        (focus)="onFocus()"
        (input)="onInput($event)"
      />

      <z-input-group-addon zAlign="inline-end">
        @if (zShowTrigger()) {
          <button
            type="button"
            z-input-group-button
            z-combobox-trigger
            zSize="icon-xs"
            zVariant="ghost"
            [disabled]="disabled()"
          >
            <ng-icon name="lucideChevronDown" class="text-muted-foreground pointer-events-none size-4" />
          </button>
        }
        @if (showClear()) {
          <button
            type="button"
            z-input-group-button
            z-combobox-clear
            zSize="icon-xs"
            zVariant="ghost"
            [disabled]="disabled()"
          >
            <ng-icon name="lucideX" class="pointer-events-none" />
          </button>
        }
      </z-input-group-addon>

      <ng-content />
    </z-input-group>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  viewProviders: [provideIcons({ lucideChevronDown, lucideX })],
  host: {
    'data-slot': 'combobox-input',
    '[class]': 'classes()',
  },
  exportAs: 'zComboboxInput',
})
export class ZardComboboxInputComponent {
  protected readonly root = inject(ZardComboboxRoot);
  private readonly elementRef = inject(ElementRef<HTMLElement>);
  private readonly injector = inject(Injector);

  /** Resolved when the input is projected inside the popup (`z-combobox-content`), i.e. popup mode. */
  private readonly content = inject(ZardComboboxContentComponent, { optional: true });

  readonly class = input<ClassValue>('');
  readonly placeholder = input<string>('');
  readonly zShowTrigger = input(true, { transform: booleanAttribute });
  readonly zShowClear = input(false, { transform: booleanAttribute });
  readonly zDisabled = input(false, { transform: booleanAttribute });

  protected readonly disabled = computed(() => this.zDisabled() || this.root.disabled());
  protected readonly showClear = computed(() => this.zShowClear() && this.root.hasValue());

  protected readonly displayText = computed(() =>
    this.root.open() || this.root.zMultiple() ? this.root.query() : this.root.selectedLabel(),
  );

  protected readonly placeholderText = computed(() => {
    const own = this.placeholder();
    if (own) {
      return own;
    }
    return this.root.open() && this.root.searchable() ? this.root.searchPlaceholder() : this.root.placeholder();
  });

  protected readonly classes = computed(() => mergeClasses(comboboxInputHostVariants(), this.class()));
  protected readonly inputGroupClasses = computed(() => mergeClasses(comboboxInputGroupVariants()));

  constructor() {
    effect(() => {
      const open = this.root.open();

      // In popup mode this component is rendered inside the CDK overlay, and a view child never
      // resolves for that view — so the DOM is read straight from the host, once it is rendered.
      afterNextRender(() => this.syncWithRoot(open), { injector: this.injector });
    });
  }

  private syncWithRoot(open: boolean): void {
    const host: HTMLElement = this.elementRef.nativeElement;
    const group = host.querySelector<HTMLElement>('[data-slot="input-group"]');
    const element = host.querySelector<HTMLInputElement>('input');

    // A popup that is closed keeps its input out of the document, and a detached input must not be
    // registered as the active one.
    if (!element?.isConnected) {
      return;
    }

    // Inside the popup the input group must not become the anchor, otherwise the popup would
    // anchor itself to its own content instead of the standalone trigger.
    if (group && !this.content) {
      this.root.registerAnchor(group, 'input');
    }

    this.root.registerInput(element);

    if (this.content && open) {
      element.focus();
    }
  }

  protected onInput(event: Event): void {
    if (this.disabled()) {
      return;
    }

    this.root.openPanel();
    this.root.setQuery((event.target as HTMLInputElement).value);
  }

  protected onFocus(): void {
    if (this.disabled()) {
      return;
    }
    this.root.openPanel();
  }

  protected onBlur(): void {
    this.root.markAsTouched();
  }
}
