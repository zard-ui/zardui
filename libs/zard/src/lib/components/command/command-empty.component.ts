import { ChangeDetectionStrategy, Component, computed, inject, input, ViewEncapsulation } from '@angular/core';

import { mergeClasses } from '../../shared/utils/utils';
import { ZardCommandJsonComponent } from './command-json.component';
import { ZardCommandComponent } from './command.component';
import { commandEmptyVariants } from './command.variants';

import type { ClassValue } from 'clsx';

@Component({
  selector: 'z-command-empty',
  exportAs: 'zCommandEmpty',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  template: `
    @if (shouldShow()) {
      <div [class]="classes()">
        <ng-content>No results found.</ng-content>
      </div>
    }
  `,
})
export class ZardCommandEmptyComponent {
  private readonly commandComponent = inject(ZardCommandComponent, { optional: true });
  private readonly jsonCommandComponent = inject(ZardCommandJsonComponent, { optional: true });

  readonly class = input<ClassValue>('');

  protected readonly classes = computed(() => mergeClasses(commandEmptyVariants({}), this.class()));

  protected readonly shouldShow = computed(() => {
    // Check traditional command component
    if (this.commandComponent) {
      const filteredOptions = this.commandComponent.filteredOptions();
      return filteredOptions.length === 0;
    }

    // Check JSON command component
    if (this.jsonCommandComponent) {
      const filteredGroups = this.jsonCommandComponent.filteredGroups();
      return filteredGroups.length === 0;
    }

    return false;
  });
}
