```angular-ts showLineNumbers
import { Component, input, signal } from '@angular/core';

import { ZardDropdownVariants } from '../dropdown.variants';
import { ZardDropdownComponent } from '../dropdown.component';
import { ZardDropdownItemComponent } from '../dropdown-item.component';
import { ZardButtonComponent } from '../../button/button.component';

@Component({
  selector: 'z-dropdown-demo',
  standalone: true,
  imports: [ZardDropdownComponent, ZardDropdownItemComponent, ZardButtonComponent],
  template: `
    <z-dropdown [isOpen]="isDropdownOpen()" [zPlacement]="zPlacement()" [zSize]="zSize()">
      <z-button dropdown-trigger (click)="toggleDropdown()"> Options </z-button>
      <z-dropdown-item (click)="onEdit()">Edit</z-dropdown-item>
      <z-dropdown-item (click)="onDuplicate()">Duplicate</z-dropdown-item>
      <z-dropdown-item (click)="onArchive()">Archive</z-dropdown-item>
      <z-dropdown-item [disabled]="true">Move (disabled)</z-dropdown-item>
      <z-dropdown-item (click)="onDelete()">Delete</z-dropdown-item>
    </z-dropdown>
  `,
})
export class ZardDropdownDemoComponent {
  readonly isDropdownOpen = signal<boolean>(false);
  readonly zSize = input<ZardDropdownVariants['zSize']>('default');
  readonly zPlacement = input<ZardDropdownVariants['zPlacement']>('bottom-end');

  toggleDropdown() {
    this.isDropdownOpen.set(!this.isDropdownOpen());
  }

  onEdit() {
    console.log('Edit clicked');
  }

  onDuplicate() {
    console.log('Duplicate clicked');
  }

  onArchive() {
    console.log('Archive clicked');
  }

  onDelete() {
    console.log('Delete clicked');
  }
}

```