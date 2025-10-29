import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { ZardCheckboxComponent } from '../checkbox.component';

@Component({
  selector: 'z-demo-checkbox-size',
  standalone: true,
  imports: [ZardCheckboxComponent, FormsModule],
  template: `
    <span z-checkbox>Default</span>
    <span z-checkbox zSize="lg" [(ngModel)]="checked">Large</span>
  `,
})
export class ZardDemoCheckboxSizeComponent {
  checked = true;
}
