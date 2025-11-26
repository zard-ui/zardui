import { ChangeDetectionStrategy, Component, computed, inject, input, ViewEncapsulation } from '@angular/core';

import type { ClassValue } from 'clsx';

import { mergeClasses } from '@ngzard/ui/core';

import { ZardCommandComponent } from './command.component';
import { commandSeparatorVariants } from './command.variants';

@Component({
  selector: 'z-command-divider',
  standalone: true,
  template: `
    @if (shouldShow()) {
      <div [class]="classes()" role="separator"></div>
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  exportAs: 'zCommandDivider',
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
