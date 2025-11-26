import { ChangeDetectionStrategy, Component, computed, input, ViewEncapsulation } from '@angular/core';

import type { ClassValue } from 'clsx';

import { mergeClasses } from '@ngzard/ui/core';

import { commandListVariants } from './command.variants';

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
