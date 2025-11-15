```angular-ts showLineNumbers copyButton
import { ZardFormLabelComponent } from '@zard/components/form/form.component';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { ZardInputDirective } from '@zard/components/input/input.directive';
import { Component, inject } from '@angular/core';

import { ZardFloatLabelComponent } from '../float.label.component';


@Component({
  selector: 'z-demo-float-label-default',
  imports: [
    ReactiveFormsModule,
    ZardInputDirective,
    ZardFloatLabelComponent,
    ZardFormLabelComponent,
  ],
  template: `
    <form [formGroup]="form" class="space-y-6">
      <z-float-label>
        <input
          z-input
          formControlName="name"
          [zStatus]="form.get('name')?.invalid && form.get('name')?.touched ? 'error' : null"
        />
        <label z-form-label zRequired>Name</label>
      </z-float-label>
    </form>
  `,
})
export class ZardDemoFloatLabelDefaultComponent {
  private fb = inject(FormBuilder);

  form = this.fb.group({
    name: ['', Validators.required],
  });
}
```