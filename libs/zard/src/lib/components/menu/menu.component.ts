import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, input, ViewEncapsulation } from '@angular/core';
import { menuContainerVariants, menuDropdownVariants, ZardMenuSize, ZardMenuVariant } from './menu.variants';

@Component({
  selector: 'z-menu',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  template: `
    <div [class]="containerClasses()">
      <ng-content select="[menu-trigger]"></ng-content>
      <div *ngIf="isOpen()" [class]="dropdownClasses()" role="menu">
        <div class="p-1" role="none">
          <ng-content></ng-content>
        </div>
      </div>
    </div>
  `,
})
export class ZardMenuComponent {
  isOpen = input<boolean>(false);
  size = input<ZardMenuSize>('default');
  variant = input<ZardMenuVariant>('default');

  protected containerClasses = computed(() => menuContainerVariants());
  protected dropdownClasses = computed(() => menuDropdownVariants({ size: this.size(), variant: this.variant() }));
}
