import { FocusTrapFactory } from '@angular/cdk/a11y';
import {
  afterNextRender,
  booleanAttribute,
  ChangeDetectionStrategy,
  Component,
  computed,
  DestroyRef,
  ElementRef,
  inject,
  input,
  output,
  ViewEncapsulation,
} from '@angular/core';

import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideX } from '@ng-icons/lucide';
import type { ClassValue } from 'clsx';

import { ZardButtonComponent } from '@/shared/components/button/button.component';
import { mergeClasses } from '@/shared/utils/merge-classes';

import { dialogVariants } from './dialog.variants';

/** How long the enter and leave transitions run, in ms. Mirrors the CSS. */
export const DIALOG_DURATION = 100;

/**
 * The floating panel of a dialog: styling, the enter and leave transitions, the focus trap
 * and the corner close button. Shared by the declarative `z-dialog` and by the container the
 * `ZardDialogService` attaches, so both behave identically.
 *
 * @internal Compose `z-dialog` instead of using this directly.
 */
@Component({
  selector: 'z-dialog-panel',
  imports: [ZardButtonComponent, NgIcon],
  template: `
    @if (zClosable()) {
      <button
        type="button"
        data-testid="z-close-header-button"
        data-slot="dialog-close"
        z-button
        zType="ghost"
        zSize="icon-sm"
        class="absolute top-2 ltr:right-2 rtl:left-2"
        (click)="closeRequested.emit()"
      >
        <ng-icon name="lucideX" class="size-4!" />
        <span class="sr-only">Close</span>
      </button>
    }
    <ng-content />
  `,
  styles: `
    z-dialog-panel {
      --z-dialog-duration: 100ms;
      opacity: 1;
      transform: scale(1);
      transition:
        opacity var(--z-dialog-duration) ease-out,
        transform var(--z-dialog-duration) ease-out;
    }

    @starting-style {
      z-dialog-panel {
        opacity: 0;
        transform: scale(0.9);
      }
    }

    z-dialog-panel[data-state='closed'] {
      opacity: 0;
      transform: scale(0.9);
      transition:
        opacity var(--z-dialog-duration) ease-in,
        transform var(--z-dialog-duration) ease-in;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  viewProviders: [provideIcons({ lucideX })],
  host: {
    'data-slot': 'dialog-content',
    role: 'dialog',
    'aria-modal': 'true',
    tabindex: '-1',
    '[attr.data-state]': 'zState()',
    '[attr.aria-labelledby]': 'zLabelledBy()',
    '[attr.aria-describedby]': 'zDescribedBy()',
    '[class]': 'classes()',
    '[style.width]': 'zWidth() || null',
    '[style.--z-dialog-duration.ms]': 'zDuration()',
  },
  exportAs: 'zDialogPanel',
})
export class ZardDialogPanelComponent {
  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly focusTrapFactory = inject(FocusTrapFactory);
  private readonly destroyRef = inject(DestroyRef);

  /** Renders the close button in the top-right corner. */
  readonly zClosable = input(true, { transform: booleanAttribute });
  /** Explicit width; leave unset for the responsive default. */
  readonly zWidth = input<string | undefined>(undefined);
  /** How long the enter and leave transitions run, in ms. */
  readonly zDuration = input(DIALOG_DURATION);
  /** `closed` plays the leave transition; the owner disposes the overlay once it ends. */
  readonly zState = input<'open' | 'closed'>('open');
  readonly zLabelledBy = input<string | null>(null);
  readonly zDescribedBy = input<string | null>(null);
  readonly class = input<ClassValue>('');

  /** The corner close button was pressed. */
  readonly closeRequested = output<void>();

  protected readonly classes = computed(() => mergeClasses(dialogVariants(), this.class()));

  constructor() {
    afterNextRender(() => {
      const trap = this.focusTrapFactory.create(this.host.nativeElement);
      void trap.focusInitialElementWhenReady();
      this.destroyRef.onDestroy(() => trap.destroy());
    });
  }
}
