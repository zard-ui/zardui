```angular-ts showLineNumbers copyButton
import { ChangeDetectionStrategy, Component, type OnInit } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';

import { ZardCheckboxComponent } from '../checkbox.component';

@Component({
  selector: 'z-demo-checkbox-disabled',
  imports: [ZardCheckboxComponent, FormsModule, ReactiveFormsModule],
  template: `
    <div class="flex flex-col gap-8">
      <form [formGroup]="form">
        <span z-checkbox formControlName="acceptTerms">Accept Terms</span>
        <span z-checkbox formControlName="newsletter">Subscribe</span>
      </form>

      <div>
        <span z-checkbox [zDisabled]="true">Disabled</span>
        <span z-checkbox [zDisabled]="true" [(ngModel)]="checked">Disabled</span>
      </div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ZardDemoCheckboxDisabledComponent implements OnInit {
  checked = true;
  form = new FormGroup({
    acceptTerms: new FormControl(false),
    newsletter: new FormControl(false),
  });

  ngOnInit() {
    this.form.disable();
  }
}

```