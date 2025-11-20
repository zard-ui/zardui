import { ChangeDetectionStrategy, Component, computed, input, ViewEncapsulation } from '@angular/core';

import type { ClassValue } from 'clsx';

import { commandListVariants } from './command.variants';
import { mergeClasses } from '../../shared/utils/utils';

@Component({
  selector: 'z-command-list',
  standalone: true,
  template: `
    <div [class]="classes()" role="listbox" id="command-list">
      <ng-content />
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  exportAs: 'zCommandList',
})
export class ZardCommandListComponent {
  readonly class = input<ClassValue>('');

  protected readonly classes = computed(() => mergeClasses(commandListVariants({}), this.class()));
}
