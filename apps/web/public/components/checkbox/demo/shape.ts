import { FormsModule } from '@angular/forms';
import { Component } from '@angular/core';

import { ZardCheckboxComponent } from '../checkbox.component';

@Component({
  standalone: true,
  imports: [ZardCheckboxComponent, FormsModule],
  template: `
    <span z-checkbox zShape="circle">Cicle</span>
    <span z-checkbox zShape="circle" [(ngModel)]="checked">Cicle checked</span>
    <span z-checkbox zShape="circle" zType="destructive" [(ngModel)]="checked"></span>

    <span z-checkbox zShape="square">Square</span>
    <span z-checkbox zShape="square" [(ngModel)]="checked">Square checked</span>
    <span z-checkbox zShape="square" zType="destructive" [(ngModel)]="checked"></span>
  `,
  styles: [
    `
      :host {
        display: flex;
        flex-wrap: wrap;
        align-items: center;
        gap: 24px;
      }
    `,
  ],
})
export class ZardDemoCheckboxShapeComponent {
  checked = true;
}
