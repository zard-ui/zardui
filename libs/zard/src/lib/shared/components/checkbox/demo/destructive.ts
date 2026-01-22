import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { ZardCheckboxComponent } from '../checkbox.component';

@Component({
  selector: 'z-demo-checkbox-destructive',
  imports: [ZardCheckboxComponent, FormsModule],
  template: `
    <span z-checkbox zType="destructive"></span>
    <span z-checkbox zType="destructive" [(ngModel)]="checked">Destructive Checked</span>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ZardDemoCheckboxDestructiveComponent {
  checked = true;
}
