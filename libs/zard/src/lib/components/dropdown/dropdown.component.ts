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
