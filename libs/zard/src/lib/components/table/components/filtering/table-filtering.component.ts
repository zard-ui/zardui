import { Component, computed, input } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { ClassValue } from 'clsx';
import { mergeClasses } from '../../../../shared/utils/utils';
import { ZardInputDirective } from '../../../input/input.directive';
import { tableVariants } from '../../table.variants';

@Component({
  selector: 'z-table-filtering',
  standalone: true,
  exportAs: 'zTableFiltering',
  imports: [ZardInputDirective, ReactiveFormsModule],
  template: `
    <div role="search" [class]="classes()">
      <label for="inputSearch" class="sr-only">{{ placeholder() }}</label>
      <input
        z-input
        aria-controls="table-id"
        type="search"
        [zSize]="inputSize()"
        class="w-full min-w-0 max-w-sm"
        [placeholder]="placeholder()"
        [formControl]="control()"
        id="inputSearch"
        aria-describedby="searchHint"
      />
      <span id="searchHint" class="sr-only"> Results will update automatically as you type </span>

      <div aria-live="polite" class="sr-only">
        {{ search() }}
      </div>
    </div>
  `,
})
export class ZardTableFilteringComponent {
  readonly placeholder = input<string>();
  readonly search = input<string>();
  readonly control = input.required<FormControl<string | null>>();
  readonly class = input<ClassValue>('');
  readonly zSize = input<'default' | 'compact' | 'comfortable'>('default');

  protected readonly inputSize = computed(() => {
    const size = this.zSize();
    switch (size) {
      case 'compact':
        return 'sm';
      case 'comfortable':
        return 'lg';
      default:
        return 'default';
    }
  });

  protected readonly classes = computed(() => mergeClasses(tableVariants.filtering({ zSize: this.zSize() }), this.class()));
}
