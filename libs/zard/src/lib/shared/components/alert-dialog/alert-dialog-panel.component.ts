import { FocusTrapFactory } from '@angular/cdk/a11y';
import {
  afterNextRender,
  ChangeDetectionStrategy,
  Component,
  computed,
  DestroyRef,
  ElementRef,
  inject,
  input,
  ViewEncapsulation,
} from '@angular/core';

import type { ClassValue } from 'clsx';

import { mergeClasses } from '@/shared/utils/merge-classes';

import { alertDialogVariants, type ZardAlertDialogSizeVariants } from './alert-dialog.variants';

/** How long the enter and leave transitions run, in ms. Mirrors the CSS. */
export const ALERT_DIALOG_DURATION = 100;

/**
 * The floating panel of an alert dialog: styling per size, the enter and leave transitions
 * and the focus trap. Shared by the declarative `z-alert-dialog` and by the container the
 * `ZardAlertDialogService` attaches, so both behave identically.
 *
 * @internal Compose `z-alert-dialog` instead of using this directly.
 */
@Component({
  selector: 'z-alert-dialog-panel',
  template: `
    <ng-content />
  `,
  styles: `
    z-alert-dialog-panel {
      --z-alert-dialog-duration: 100ms;
      opacity: 1;
      transform: scale(1);
      transition:
        opacity var(--z-alert-dialog-duration) ease-out,
        transform var(--z-alert-dialog-duration) ease-out;
    }

    @starting-style {
      z-alert-dialog-panel {
        opacity: 0;
        transform: scale(0.9);
      }
    }

    z-alert-dialog-panel[data-state='closed'] {
      opacity: 0;
      transform: scale(0.9);
      transition:
        opacity var(--z-alert-dialog-duration) ease-in,
        transform var(--z-alert-dialog-duration) ease-in;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: {
    'data-slot': 'alert-dialog-content',
    role: 'alertdialog',
    'aria-modal': 'true',
    tabindex: '-1',
    '[attr.data-size]': 'zSize()',
    '[attr.data-state]': 'zState()',
    '[attr.aria-labelledby]': 'zLabelledBy()',
    '[attr.aria-describedby]': 'zDescribedBy()',
    '[class]': 'classes()',
    '[style.width]': 'zWidth() || null',
    '[style.--z-alert-dialog-duration.ms]': 'zDuration()',
  },
  exportAs: 'zAlertDialogPanel',
})
export class ZardAlertDialogPanelComponent {
  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly focusTrapFactory = inject(FocusTrapFactory);
  private readonly destroyRef = inject(DestroyRef);

  /** Visual size. `default` widens on sm+ and lays media and title side by side; `sm` stays compact and centered. */
  readonly zSize = input<ZardAlertDialogSizeVariants>('default');
  /** Explicit width; leave unset for the size preset. */
  readonly zWidth = input<string | undefined>(undefined);
  /** How long the enter and leave transitions run, in ms. */
  readonly zDuration = input(ALERT_DIALOG_DURATION);
  /** `closed` plays the leave transition; the owner disposes the overlay once it ends. */
  readonly zState = input<'open' | 'closed'>('open');
  readonly zLabelledBy = input<string | null>(null);
  readonly zDescribedBy = input<string | null>(null);
  readonly class = input<ClassValue>('');

  protected readonly classes = computed(() => mergeClasses(alertDialogVariants({ zSize: this.zSize() }), this.class()));

  constructor() {
    afterNextRender(() => {
      const trap = this.focusTrapFactory.create(this.host.nativeElement);
      void trap.focusInitialElementWhenReady();
      this.destroyRef.onDestroy(() => trap.destroy());
    });
  }
}
