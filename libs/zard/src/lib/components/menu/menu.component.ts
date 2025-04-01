import { CommonModule } from '@angular/common';
import { menuContainerVariants, menuDropdownVariants, ZardMenuVariants } from './menu.variants';
import { ChangeDetectionStrategy, Component, computed, input, ViewEncapsulation } from '@angular/core';

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
  readonly isOpen = input<boolean>(false);
  readonly zSize = input<ZardMenuVariants['zSize']>('default');

  protected containerClasses = computed(() => menuContainerVariants());
  protected dropdownClasses = computed(() => menuDropdownVariants({ zSize: this.zSize() }));
}
