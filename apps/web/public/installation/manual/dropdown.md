### <img src="/icons/typescript.svg" class="w-4 h-4 inline mr-2" alt="TypeScript">dropdown.component.ts

```angular-ts showLineNumbers
import { CommonModule } from '@angular/common';
import { dropdownContainerVariants, dropdownDropdownVariants, ZardDropdownVariants } from './dropdown.variants';
import { ChangeDetectionStrategy, Component, computed, input, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'z-dropdown',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  template: `
    <div [class]="containerClasses()">
      <ng-content select="[dropdown-trigger]"></ng-content>
      <div *ngIf="isOpen()" [class]="dropdownClasses()" role="dropdown">
        <div class="p-1" role="none">
          <ng-content></ng-content>
        </div>
      </div>
    </div>
  `,
})
export class ZardDropdownComponent {
  readonly isOpen = input<boolean>(false);
  readonly zSize = input<ZardDropdownVariants['zSize']>('default');
  readonly zPlacement = input<ZardDropdownVariants['zPlacement']>('bottom-end');

  protected containerClasses = computed(() => dropdownContainerVariants());
  protected dropdownClasses = computed(() =>
    dropdownDropdownVariants({
      zSize: this.zSize(),
      zPlacement: this.zPlacement(),
    }),
  );
}

```

### <img src="/icons/typescript.svg" class="w-4 h-4 inline mr-2" alt="TypeScript">dropdown.variants.ts

```angular-ts showLineNumbers
import { cva, VariantProps } from 'class-variance-authority';

export const dropdownContainerVariants = cva('relative inline-block text-left', {
  variants: {},
  defaultVariants: {},
});

export const dropdownDropdownVariants = cva('absolute z-10 mt-2 rounded-md ring-1 bg-white dark:bg-black ring-accent ring-opacity-5 dark:ring-opacity-10 focus:outline-none', {
  variants: {
    zSize: {
      default: 'w-56',
      sm: 'w-48',
      lg: 'w-64',
    },
    zPlacement: {
      'bottom-start': 'origin-top-left left-0',
      'bottom-end': 'origin-top-right right-0',
      'top-start': 'origin-bottom-left bottom-full left-0 mb-2',
      'top-end': 'origin-bottom-right bottom-full right-0 mb-2',
    },
  },
  defaultVariants: {
    zSize: 'default',
    zPlacement: 'bottom-end',
  },
});

export type ZardDropdownPlacement = 'bottom-start' | 'bottom-end' | 'top-start' | 'top-end';
export type ZardDropdownVariants = VariantProps<typeof dropdownDropdownVariants>;

```

### <img src="/icons/typescript.svg" class="w-4 h-4 inline mr-2" alt="TypeScript">dropdown-item.component.ts

```angular-ts showLineNumbers
import { Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'z-dropdown-item',
  standalone: true,
  imports: [CommonModule],
  template: `
    <button
      type="button"
      class="text-gray-700 dark:text-gray-200 block w-full px-4 py-2 rounded-sm text-left text-sm hover:bg-gray-100 dark:hover:bg-accent hover:text-gray-900 dark:hover:text-gray-100"
      role="dropdownItem"
      [class.disabled]="disabled()"
      [disabled]="disabled()"
    >
      <ng-content></ng-content>
    </button>
  `,
  styles: `
    .disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }
  `,
})
export class ZardDropdownItemComponent {
  disabled = input<boolean>(false);
}

```

