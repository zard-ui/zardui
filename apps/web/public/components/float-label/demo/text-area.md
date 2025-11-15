```angular-ts showLineNumbers copyButton
import { ZardFormLabelComponent } from '@zard/components/form/form.component';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { ZardInputDirective } from '@zard/components/input/input.directive';
import { Component, inject } from '@angular/core';

import { ZardFloatLabelComponent } from '../float.label.component';


@Component({
  selector: 'z-demo-float-label-textarea',
  imports: [
    ReactiveFormsModule,
    ZardInputDirective,
    ZardFloatLabelComponent,
    ZardFormLabelComponent,
  ],
  template: `
    <form [formGroup]="form" class="space-y-6">
      <z-float-label>
        <textarea
          z-input
          formControlName="description"
          rows="4"
          [zStatus]="form.get('description')?.invalid && form.get('description')?.touched ? 'error' : null"
        ></textarea>
        <label z-form-label zRequired>Description</label>
      </z-float-label>
    </form>
  `,
})
export class ZardDemoFloatLabelTextareaComponent {
  private fb = inject(FormBuilder);

  form = this.fb.group({
    description: ['', Validators.required],
  });
}
```