import { DOCUMENT } from '@angular/common';
import {
  booleanAttribute,
  ChangeDetectionStrategy,
  Component,
  computed,
  ElementRef,
  inject,
  input,
  output,
  signal,
} from '@angular/core';

import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideCheck, lucideLock, lucideLockOpen } from '@ng-icons/lucide';

import { ZardPopoverImports } from '@zard/components/popover/popover.imports';

import type { PickerEvent, PickerOption, PickerSection } from '../lib/picker.types';

export type { PickerEvent, PickerOption, PickerSection } from '../lib/picker.types';

/**
 * One row of the customizer: what the option is, what it currently holds, a glyph, and a dark glass radio menu
 * that opens beside the card (above it on a phone).
 *
 * An option applies when it is clicked (or chosen with Enter); hovering and arrowing only move the highlight. A lock
 * toggle sits beside the glyph and protects the option from Shuffle.
 */
@Component({
  selector: 'z-create-picker',
  imports: [NgIcon, ...ZardPopoverImports],
  providers: [provideIcons({ lucideCheck, lucideLock, lucideLockOpen })],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'group/picker relative block shrink-0', '[attr.data-picker]': 'label()' },
  template: `
    <button
      type="button"
      class="ring-foreground/10 hover:bg-muted aria-expanded:bg-muted focus-visible:ring-foreground/50 relative w-36 touch-manipulation rounded-xl p-3 text-left ring-1 select-none focus-visible:outline-none disabled:opacity-50 md:w-full md:rounded-lg md:px-2.5 md:py-2"
      zPopover
      zAlign="start"
      [zOrigin]="origin()"
      [zPlacement]="mobile() ? 'top' : 'right'"
      [zSideOffset]="mobile() ? 12 : 20"
      [zContent]="options"
      [zVisible]="open()"
      [disabled]="disabled()"
      (zVisibleChange)="onVisible($event)"
    >
      <span class="flex min-w-0 flex-col justify-start pr-7 text-left">
        <span class="text-muted-foreground block text-xs leading-4">{{ label() }}</span>
        <span class="text-foreground block truncate text-sm leading-5 font-medium">{{ display() }}</span>
      </span>
      <span
        class="text-foreground pointer-events-none absolute top-1/2 right-4 flex size-4 -translate-y-1/2 items-center justify-center select-none md:right-2.5 [&>*]:shrink-0"
      >
        <ng-content select="[slot=glyph]" />
      </span>
    </button>

    @if (lockable()) {
      <!-- A sibling of the trigger: a button inside a button is not valid HTML. -->
      <button
        type="button"
        class="ring-foreground/60 text-foreground absolute top-1/2 right-8 flex size-4 -translate-y-1/2 items-center justify-center rounded opacity-0 transition-opacity outline-none group-focus-within/picker:opacity-100 group-hover/picker:opacity-100 focus-visible:ring-1 data-[locked=true]:opacity-100 max-md:hidden pointer-coarse:hidden"
        [attr.data-locked]="locked()"
        [attr.aria-pressed]="locked()"
        [attr.aria-label]="(locked() ? 'Unlock ' : 'Lock ') + label()"
        [attr.title]="locked() ? 'Unlock' : 'Lock'"
        (click)="lockToggled.emit()"
      >
        <ng-icon [name]="locked() ? 'lucideLock' : 'lucideLockOpen'" class="size-5 shrink-0" />
      </button>
    }

    <ng-template #options>
      <z-popover
        class="dark max-h-96 w-52 gap-0 overflow-y-auto rounded-xl border-0 bg-neutral-950/80 p-1.5 text-neutral-100 ring-1 ring-neutral-950/80 backdrop-blur-xl max-md:w-[calc(100vw-3rem)] dark:bg-neutral-800/90 dark:ring-neutral-700/50"
        [attr.aria-label]="label()"
      >
        <div role="menu" [attr.aria-label]="label()" (keydown)="onKeydown($event)">
          @for (section of sections(); track $index) {
            <div role="group" [attr.aria-label]="section.label ?? label()">
              @if (section.label) {
                <div class="px-2 py-1.5 text-xs font-medium text-neutral-400" aria-hidden="true">
                  {{ section.label }}
                </div>
              }
              @for (option of section.options; track option.value) {
                <button
                  type="button"
                  role="menuitemradio"
                  class="relative flex w-full cursor-default items-center gap-2 rounded-lg py-1.5 pr-8 pl-2 text-left text-sm font-medium text-neutral-100 outline-hidden select-none hover:bg-neutral-600 focus:bg-neutral-600 disabled:pointer-events-none disabled:opacity-50 dark:hover:bg-neutral-700/80 dark:focus:bg-neutral-700/80 pointer-coarse:gap-3 pointer-coarse:py-2.5 pointer-coarse:pl-3 pointer-coarse:text-base"
                  [attr.aria-checked]="option.value === section.value"
                  [attr.data-value]="option.value"
                  [disabled]="option.disabled"
                  (click)="pick(section.id, option)"
                >
                  <span class="truncate">{{ option.label }}</span>
                  @if (option.value === section.value) {
                    <span class="pointer-events-none absolute right-2 flex items-center justify-center">
                      <ng-icon name="lucideCheck" class="size-4 pointer-coarse:size-5" />
                    </span>
                  }
                </button>
              }
            </div>
            @if (section.separatorAfter) {
              <div role="separator" class="-mx-1.5 my-1.5 h-px bg-neutral-600 dark:bg-neutral-700"></div>
            }
          }
        </div>
      </z-popover>
    </ng-template>
  `,
})
export class CreatePickerComponent {
  private readonly document = inject(DOCUMENT);

  readonly label = input.required<string>();
  /** What the trigger shows under the label. */
  readonly display = input.required<string>();
  readonly sections = input.required<readonly PickerSection[]>();
  readonly disabled = input(false, { transform: booleanAttribute });

  /** On a phone the menu opens above the whole card, anchored to it, and closes on a pick. */
  readonly mobile = input(false, { transform: booleanAttribute });
  readonly anchor = input<HTMLElement | undefined>(undefined);
  protected readonly origin = computed(() => {
    const element = this.anchor();
    return this.mobile() && element ? new ElementRef(element) : undefined;
  });

  readonly lockable = input(true, { transform: booleanAttribute });
  readonly locked = input(false, { transform: booleanAttribute });

  readonly picked = output<PickerEvent>();
  readonly lockToggled = output<void>();

  protected readonly open = signal(false);

  protected onVisible(open: boolean): void {
    this.open.set(open);
    if (open) this.focusOpenMenu();
  }

  protected pick(section: string, option: PickerOption): void {
    if (option.disabled) return;
    this.picked.emit({ section, value: option.value });
    // The menu stays open on a desktop so options can be compared; a phone has no room for that.
    if (this.mobile()) this.open.set(false);
  }

  protected onKeydown(event: KeyboardEvent): void {
    const step = event.key === 'ArrowDown' ? 1 : event.key === 'ArrowUp' ? -1 : 0;
    if (step === 0) return;
    event.preventDefault();

    const items = Array.from(
      (event.currentTarget as HTMLElement).querySelectorAll<HTMLElement>('[role="menuitemradio"]:not(:disabled)'),
    );
    const current = items.indexOf(this.document.activeElement as HTMLElement);
    items[(current + step + items.length) % items.length]?.focus();
  }

  /** The CDK overlay mounts at the end of `body`, outside the tab order: move focus in so the menu is reachable. */
  private focusOpenMenu(): void {
    setTimeout(() => {
      const menu = this.document.querySelector<HTMLElement>('.cdk-overlay-container [role="menu"]');
      const checked = menu?.querySelector<HTMLElement>('[aria-checked="true"]:not(:disabled)');
      // Start on the committed value, so the arrows move from where the user is.
      (checked ?? menu?.querySelector<HTMLElement>('[role="menuitemradio"]:not(:disabled)'))?.focus();
    });
  }
}
