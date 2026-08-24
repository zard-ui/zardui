import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import {
  booleanAttribute,
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
  output,
  PLATFORM_ID,
  signal,
} from '@angular/core';

import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideCheck, lucideLock, lucideLockOpen } from '@ng-icons/lucide';

import { ZardPopoverImports } from '@zard/components/popover/popover.imports';

export interface TypesetControlOption<T extends string | number> {
  readonly value: T;
  readonly label: string;
  /** Rendered in this face, when the option *is* a face. */
  readonly family?: string;
}

export interface TypesetControlGroup<T extends string | number> {
  /** Shown above the options. Omitted when the control has a single flat list. */
  readonly label?: string;
  /** Draws a rule under the group, to hold it apart from the catalog below. */
  readonly separated?: boolean;
  readonly options: readonly TypesetControlOption<T>[];
}

/**
 * One control of the customizer: what the slot is, what it currently holds, and
 * the list it can be changed to.
 *
 * The list opens beside the panel on a desktop, where there is room for it, and
 * upwards from the strip on a phone, where there is not.
 */
@Component({
  selector: 'app-typeset-control',
  standalone: true,
  imports: [NgIcon, ...ZardPopoverImports],
  providers: [provideIcons({ lucideCheck, lucideLock, lucideLockOpen })],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'block shrink-0', '[attr.data-control]': 'label()' },
  template: `
    <div class="group/control relative">
      <button
        type="button"
        class="ring-foreground/10 hover:bg-muted aria-expanded:bg-muted focus-visible:ring-foreground/50 relative w-36 touch-manipulation rounded-xl p-3 text-left ring-1 transition-colors select-none focus-visible:outline-none md:w-full md:rounded-lg md:px-2.5 md:py-2"
        zPopover
        zAlign="start"
        [zPlacement]="onPhone() ? 'top' : 'right'"
        [zSideOffset]="onPhone() ? 12 : 20"
        [zContent]="options"
        [zVisible]="open()"
        (zVisibleChange)="onVisible($event)"
      >
        <span class="flex min-w-0 flex-col justify-start pr-8">
          <span class="text-muted-foreground block text-xs leading-4">{{ label() }}</span>
          <span class="block truncate text-sm leading-5 font-medium">{{ display() }}</span>
        </span>

        <!--
          The box is 16px and the icon 18px: it overflows, centred, the way the
          original does. The shrink-0 is what stops flex from squeezing it back.
        -->
        <span
          class="pointer-events-none absolute top-1/2 right-4 flex size-4 -translate-y-1/2 items-center justify-center select-none md:right-2.5 [&>*]:shrink-0"
        >
          <ng-content select="[slot=icon]" />
        </span>
      </button>

      @if (lockable()) {
        <!-- A sibling of the trigger, not a child: a button inside a button is not valid HTML. -->
        <button
          type="button"
          class="ring-foreground/60 text-foreground absolute top-1/2 right-8 flex size-4 -translate-y-1/2 items-center justify-center rounded transition-opacity outline-none group-focus-within/control:opacity-100 group-hover/control:opacity-100 focus-visible:ring-1 max-md:hidden pointer-coarse:hidden"
          [class.opacity-0]="!locked() && !open()"
          [attr.aria-pressed]="locked()"
          [attr.aria-label]="(locked() ? 'Unlock ' : 'Lock ') + label()"
          (click)="lockedChange.emit(!locked())"
        >
          <ng-icon [name]="locked() ? 'lucideLock' : 'lucideLockOpen'" class="size-5 shrink-0" />
        </button>
      }
    </div>

    <ng-template #options>
      <z-popover class="w-52 gap-0 rounded-xl p-1.5" [attr.aria-label]="label()">
        <div
          class="max-h-[21rem] overflow-y-auto"
          role="listbox"
          [attr.aria-label]="label()"
          (keydown)="onKeydown($event)"
        >
          @for (group of groups(); track $index) {
            @if (group.label) {
              <div class="text-muted-foreground px-2 py-1.5 text-xs font-medium">{{ group.label }}</div>
            }

            @for (option of group.options; track option.value) {
              <button
                type="button"
                role="option"
                class="hover:bg-accent focus:bg-accent relative flex w-full items-center rounded-lg py-1.5 pr-8 pl-2 text-left text-sm font-medium transition-colors outline-none"
                [style.font-family]="option.family"
                [attr.aria-selected]="option.value === value()"
                (click)="pick(option.value)"
              >
                <span class="truncate">{{ option.label }}</span>

                @if (option.value === value()) {
                  <span class="absolute right-2 flex items-center justify-center">
                    <ng-icon name="lucideCheck" class="size-4" />
                  </span>
                }
              </button>
            }

            @if (group.separated) {
              <div class="bg-border -mx-1.5 my-1.5 h-px"></div>
            }
          }
        </div>
      </z-popover>
    </ng-template>
  `,
})
export class TypesetControlComponent<T extends string | number> {
  private readonly document = inject(DOCUMENT);
  private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));

  readonly label = input.required<string>();
  readonly groups = input.required<readonly TypesetControlGroup<T>[]>();
  readonly value = input.required<T>();
  /** What the row shows. Falls back to the label of the selected option. */
  readonly display = input.required<string>();

  /** Where the list has room to open. The strip at the bottom of a phone has none to its right. */
  readonly onPhone = input(false, { transform: booleanAttribute });

  /** Whether the row offers the padlock that holds it through a shuffle. */
  readonly lockable = input(false, { transform: booleanAttribute });
  readonly locked = input(false);

  readonly valueChange = output<T>();
  readonly lockedChange = output<boolean>();

  protected readonly open = signal(false);

  protected onVisible(open: boolean): void {
    this.open.set(open);
    if (open) this.focusOpenList();
  }

  protected pick(value: T): void {
    this.open.set(false);
    this.valueChange.emit(value);
  }

  /** Up and down walk the options, the way a listbox is expected to behave. */
  protected onKeydown(event: KeyboardEvent): void {
    const step = event.key === 'ArrowDown' ? 1 : event.key === 'ArrowUp' ? -1 : 0;
    if (step === 0) return;

    event.preventDefault();

    const options = optionsOf(event.currentTarget as HTMLElement);
    const current = options.indexOf(this.document.activeElement as HTMLElement);
    const next = current === -1 ? 0 : (current + step + options.length) % options.length;
    options[next]?.focus();
  }

  /*
   * The CDK overlay mounts the list at the end of the `body`, outside the row's
   * tab order. Without moving focus there on open, the next Tab lands on the
   * control below and the options are unreachable by keyboard.
   */
  private focusOpenList(): void {
    if (!this.isBrowser) return;

    setTimeout(() => {
      const list = this.document.querySelector<HTMLElement>('.cdk-overlay-container [role="listbox"]');
      if (!list) return;

      const selected = list.querySelector<HTMLElement>('[aria-selected="true"]');
      (selected ?? optionsOf(list)[0])?.focus();
    });
  }
}

function optionsOf(list: HTMLElement): HTMLElement[] {
  return Array.from(list.querySelectorAll<HTMLElement>('[role="option"]'));
}
