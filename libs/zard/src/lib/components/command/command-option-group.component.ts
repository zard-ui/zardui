import { AfterContentInit, ChangeDetectionStrategy, Component, computed, contentChildren, inject, input, ViewEncapsulation } from '@angular/core';
import type { ClassValue } from 'clsx';

import { commandGroupHeadingVariants, commandGroupVariants } from './command.variants';
import { ZardCommandOptionComponent } from './command-option.component';
import { ZardCommandComponent } from './command.component';
import { mergeClasses } from '../../shared/utils/utils';

@Component({
  selector: 'z-command-option-group',
  exportAs: 'zCommandOptionGroup',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  template: `
    @if (shouldShow()) {
      <div [class]="classes()" role="group">
        @if (zLabel()) {
          <div [class]="headingClasses()" role="presentation">
            {{ zLabel() }}
          </div>
        }
        <div role="group">
          <ng-content></ng-content>
        </div>
      </div>
    }
  `,
})
export class ZardCommandOptionGroupComponent implements AfterContentInit {
  private readonly commandComponent = inject(ZardCommandComponent, { optional: true });

  readonly optionComponents = contentChildren(ZardCommandOptionComponent, { descendants: true });

  readonly zLabel = input.required<string>();
  readonly class = input<ClassValue>('');

  protected readonly classes = computed(() => mergeClasses(commandGroupVariants({}), this.class()));

  protected readonly headingClasses = computed(() => mergeClasses(commandGroupHeadingVariants({})));

  protected readonly shouldShow = computed(() => {
    if (!this.commandComponent || !this.optionComponents) return true;

    const searchTerm = this.commandComponent.searchTerm();
    const filteredOptions = this.commandComponent.filteredOptions();

    // If no search term, show all groups
    if (searchTerm === '') return true;

    // Check if any option in this group is in the filtered list
    return this.optionComponents().some(option => filteredOptions.includes(option));
  });

  ngAfterContentInit() {
    // Component is ready when content children are initialized
  }
}
