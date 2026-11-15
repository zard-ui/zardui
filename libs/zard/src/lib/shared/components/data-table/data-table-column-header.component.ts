import { ChangeDetectionStrategy, Component, computed, input, ViewEncapsulation } from '@angular/core';

import { NgIcon, provideIcons } from '@ng-icons/core';
import {
  lucideArrowDown,
  lucideArrowUp,
  lucideChevronsUpDown,
  lucideEyeOff,
  lucidePin,
  lucidePinOff,
} from '@ng-icons/lucide';
import { injectTableHeaderContext, type RowData } from '@tanstack/angular-table';
import type { ClassValue } from 'clsx';

import { ZardButtonComponent } from '@/shared/components/button/button.component';
import type { ZardDataTableFeatures } from '@/shared/components/data-table/data-table.component';
import { dataTableColumnHeaderVariants } from '@/shared/components/data-table/data-table.variants';
import { ZardDropdownImports } from '@/shared/components/dropdown/dropdown.imports';
import { mergeClasses } from '@/shared/utils/merge-classes';

/**
 * A sortable, pinnable, hideable column header — each action shows when the table has its
 * feature. Render it from a column definition, where TanStack hands it the header through DI:
 *
 * `header: () => flexRenderComponent(ZardDataTableColumnHeaderComponent, { inputs: { zTitle: 'Email' } })`
 */
@Component({
  selector: 'z-data-table-column-header',
  imports: [ZardButtonComponent, ZardDropdownImports, NgIcon],
  template: `
    @if (canSort() || canPin()) {
      <button
        type="button"
        z-button
        zType="ghost"
        zSize="sm"
        class="data-[state=open]:bg-accent -ms-2.5 h-8"
        z-dropdown
        [zDropdownMenu]="menu"
      >
        <span>{{ zTitle() }}</span>
        @if (pinned()) {
          <ng-icon name="lucidePin" aria-hidden="true" />
        }
        @switch (sorted()) {
          @case ('desc') {
            <ng-icon name="lucideArrowDown" aria-hidden="true" />
          }
          @case ('asc') {
            <ng-icon name="lucideArrowUp" aria-hidden="true" />
          }
          @default {
            @if (canSort()) {
              <ng-icon name="lucideChevronsUpDown" aria-hidden="true" />
            }
          }
        }
      </button>

      <z-dropdown-menu-content #menu="zDropdownMenuContent" zAlign="start">
        @if (canSort()) {
          <z-dropdown-menu-item (click)="sort(false)">
            <ng-icon name="lucideArrowUp" aria-hidden="true" />
            Asc
          </z-dropdown-menu-item>
          <z-dropdown-menu-item (click)="sort(true)">
            <ng-icon name="lucideArrowDown" aria-hidden="true" />
            Desc
          </z-dropdown-menu-item>
        }
        @if (canPin()) {
          @if (canSort()) {
            <z-dropdown-menu-separator />
          }
          @if (pinned() !== 'start') {
            <z-dropdown-menu-item (click)="pin('start')">
              <ng-icon name="lucidePin" aria-hidden="true" />
              Pin to start
            </z-dropdown-menu-item>
          }
          @if (pinned() !== 'end') {
            <z-dropdown-menu-item (click)="pin('end')">
              <ng-icon name="lucidePin" aria-hidden="true" />
              Pin to end
            </z-dropdown-menu-item>
          }
          @if (pinned()) {
            <z-dropdown-menu-item (click)="pin(false)">
              <ng-icon name="lucidePinOff" aria-hidden="true" />
              Unpin
            </z-dropdown-menu-item>
          }
        }
        @if (canHide()) {
          <z-dropdown-menu-separator />
          <z-dropdown-menu-item (click)="hide()">
            <ng-icon name="lucideEyeOff" aria-hidden="true" />
            Hide
          </z-dropdown-menu-item>
        }
      </z-dropdown-menu-content>
    } @else {
      <span>{{ zTitle() }}</span>
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  viewProviders: [
    provideIcons({ lucideArrowDown, lucideArrowUp, lucideChevronsUpDown, lucideEyeOff, lucidePin, lucidePinOff }),
  ],
  host: {
    'data-slot': 'data-table-column-header',
    '[class]': 'classes()',
  },
  exportAs: 'zDataTableColumnHeader',
})
export class ZardDataTableColumnHeaderComponent {
  readonly zTitle = input.required<string>();
  readonly class = input<ClassValue>('');

  private readonly header = injectTableHeaderContext<ZardDataTableFeatures, RowData, unknown>();
  private readonly column = computed(() => this.header().column);

  protected readonly classes = computed(() => mergeClasses(dataTableColumnHeaderVariants(), this.class()));
  protected readonly canSort = computed(
    () => typeof this.column().getCanSort === 'function' && this.column().getCanSort(),
  );

  protected readonly canHide = computed(
    () => typeof this.column().getCanHide === 'function' && this.column().getCanHide(),
  );

  protected readonly canPin = computed(
    () => typeof this.column().getCanPin === 'function' && this.column().getCanPin(),
  );

  protected readonly sorted = computed<false | 'asc' | 'desc'>(() =>
    typeof this.column().getIsSorted === 'function' ? this.column().getIsSorted() : false,
  );

  protected readonly pinned = computed<false | 'start' | 'end'>(() =>
    typeof this.column().getIsPinned === 'function' ? this.column().getIsPinned() : false,
  );

  protected sort(desc: boolean): void {
    this.column().toggleSorting(desc);
  }

  protected pin(position: false | 'start' | 'end'): void {
    this.column().pin(position);
  }

  protected hide(): void {
    this.column().toggleVisibility(false);
  }
}
