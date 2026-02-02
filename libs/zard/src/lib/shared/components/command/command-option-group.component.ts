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
import { commandGroupHeadingVariants, commandGroupVariants } from '@/shared/components/command/command.variants';
import { mergeClasses } from '@/shared/utils/merge-classes';

export abstract class ZardCommandOptionGroup {
  abstract registerOption(option: ZardCommandOptionComponent): void;
  abstract unregisterOption(option: ZardCommandOptionComponent): void;
}

@Component({
  selector: 'z-command-option-group',
  template: `
    @if (isGroupVisible()) {
      <div [class]="classes()" role="group">
        @if (zLabel()) {
          <div [class]="headingClasses()" role="presentation">
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

  protected readonly classes = computed(() => mergeClasses(commandGroupVariants({}), this.class()));
  protected readonly headingClasses = computed(() => mergeClasses(commandGroupHeadingVariants({})));
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
