import {
  ChangeDetectionStrategy,
  Component,
  computed,
  ElementRef,
  inject,
  input,
  signal,
  ViewEncapsulation,
} from '@angular/core';

import type { ClassValue } from 'clsx';

import { ZardCommandComponent } from '@/shared/components/command/command.component';
import {
  commandItemVariants,
  commandShortcutVariants,
  type ZardCommandItemVariants,
} from '@/shared/components/command/command.variants';
import { ZardIconComponent, type ZardIcon } from '@/shared/components/icon';
import { mergeClasses, transform } from '@/shared/utils/merge-classes';

@Component({
  selector: 'z-command-option',
  imports: [ZardIconComponent],
  template: `
    @if (shouldShow()) {
      <div
        [class]="classes()"
        [attr.role]="'option'"
        [attr.aria-selected]="isSelected()"
        [attr.data-selected]="isSelected()"
        [attr.data-disabled]="zDisabled()"
        [attr.tabindex]="0"
        (click)="onClick()"
        (keydown.{enter,space}.prevent)="onClick()"
        (mouseenter)="onMouseEnter()"
      >
        @if (zIcon()) {
          <div z-icon [zType]="zIcon()!" class="mr-2 flex shrink-0 items-center justify-center"></div>
        }
        <span class="flex-1">{{ zLabel() }}</span>
        @if (zShortcut()) {
          <span [class]="shortcutClasses()">{{ zShortcut() }}</span>
        }
      </div>
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  exportAs: 'zCommandOption',
})
export class ZardCommandOptionComponent {
  private readonly elementRef = inject(ElementRef);
  private readonly commandComponent = inject(ZardCommandComponent, { optional: true });

  readonly zValue = input.required<unknown>();
  readonly zLabel = input.required<string>();
  readonly zCommand = input<string>('');
  readonly zIcon = input<ZardIcon>();
  readonly zShortcut = input<string>('');
  readonly zDisabled = input(false, { transform });
  readonly variant = input<ZardCommandItemVariants>('default');
  readonly class = input<ClassValue>('');

  readonly isSelected = signal(false);

  protected readonly classes = computed(() => {
    const baseClasses = commandItemVariants({ variant: this.variant() });
    const selectedClasses = this.isSelected() ? 'bg-accent text-accent-foreground' : '';
    return mergeClasses(baseClasses, selectedClasses, this.class());
  });

  protected readonly shortcutClasses = computed(() => mergeClasses(commandShortcutVariants()));

  protected readonly shouldShow = computed(() => {
    if (!this.commandComponent) {
      return true;
    }

    const filteredOptions = this.commandComponent.filteredOptions();
    const searchTerm = this.commandComponent.searchTerm();

    // If no search term, show all options
    if (searchTerm === '') {
      return true;
    }

    // Check if this option is in the filtered list
    return filteredOptions.includes(this);
  });

  onClick() {
    if (this.zDisabled()) {
      return;
    }
    if (this.commandComponent) {
      this.commandComponent.selectOption(this);
    }
  }

  onMouseEnter() {
    if (this.zDisabled()) {
      return;
    }
    // Visual feedback for hover
  }

  setSelected(selected: boolean) {
    this.isSelected.set(selected);
  }

  focus() {
    const element = this.elementRef.nativeElement;
    element.focus();
    // Scroll element into view if needed
    element.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }
}
