import { Component, input, signal } from '@angular/core';

import { ZardMenuVariants } from '../menu.variants';
import { ZardMenuComponent } from '../menu.component';
import { ZardMenuItemComponent } from '../menu-item.component';
import { ZardButtonComponent } from '../../button/button.component';

@Component({
  selector: 'z-menu-demo',
  standalone: true,
  imports: [ZardMenuComponent, ZardMenuItemComponent, ZardButtonComponent],
  template: `
    <z-menu [isOpen]="isMenuOpen()" [zSize]="zSize()">
      <z-button menu-trigger (click)="toggleMenu()"> Options </z-button>
      <z-menu-item (click)="onEdit()">Edit</z-menu-item>
      <z-menu-item (click)="onDuplicate()">Duplicate</z-menu-item>
      <z-menu-item (click)="onArchive()">Archive</z-menu-item>
      <z-menu-item [disabled]="true">Move (disabled)</z-menu-item>
      <z-menu-item (click)="onDelete()">Delete</z-menu-item>
    </z-menu>
  `,
})
export class ZardMenuDemoComponent {
  readonly isMenuOpen = signal<boolean>(false);
  readonly zSize = input<ZardMenuVariants['zSize']>('default');

  toggleMenu() {
    this.isMenuOpen.set(!this.isMenuOpen());
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
