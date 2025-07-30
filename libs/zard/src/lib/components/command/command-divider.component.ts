import { ClassValue } from 'class-variance-authority/dist/types';

import { ChangeDetectionStrategy, Component, computed, inject, input, ViewEncapsulation } from '@angular/core';

import { mergeClasses } from '../../shared/utils/utils';
import { ZardCommandComponent } from './command.component';
import { commandSeparatorVariants } from './command.variants';

@Component({
  selector: 'z-command-divider',
  exportAs: 'zCommandDivider',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  template: `
    @if (shouldShow()) {
      <div [class]="classes()" role="separator"></div>
    }
  `,
})
export class ZardCommandDividerComponent {
  private readonly commandComponent = inject(ZardCommandComponent, { optional: true });

  readonly class = input<ClassValue>('');

  protected readonly classes = computed(() => mergeClasses(commandSeparatorVariants({}), this.class()));

  protected readonly shouldShow = computed(() => {
    if (!this.commandComponent) return true;

    const searchTerm = this.commandComponent.searchTerm();

    // If no search, always show dividers
    if (searchTerm === '') return true;

    // If there's a search term, hide all dividers for now
    // This is a simple approach - we can make it smarter later
    return false;
  });
}
