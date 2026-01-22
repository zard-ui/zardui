import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { ZardCheckboxComponent } from '../checkbox.component';

@Component({
  selector: 'z-demo-checkbox-default',
  imports: [ZardCheckboxComponent, FormsModule],
  template: `
    <span z-checkbox></span>
    <span z-checkbox [(ngModel)]="checked">Default Checked</span>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ZardDemoCheckboxDefaultComponent {
  checked = true;
}
