```angular-ts showLineNumbers copyButton
// z-demo-float-label-status.component.ts
import { Component } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';

import { ZardFormLabelComponent } from '../../form/form.component';
import { ZardInputDirective } from '../../input/input.directive';
import { ZardFloatLabelComponent } from '../float.label.component';

@Component({
  selector: 'z-demo-float-label-status',
  imports: [ReactiveFormsModule, ZardInputDirective, ZardFloatLabelComponent, ZardFormLabelComponent],
  template: `
    <div class="space-y-6">
      <z-float-label>
        <input z-input [zStatus]="'error'" />
        <label z-form-label>Error State</label>
      </z-float-label>

      <z-float-label>
        <input z-input [zStatus]="'warning'" />
        <label z-form-label>Warning State</label>
      </z-float-label>

      <z-float-label>
        <input z-input [zStatus]="'success'" />
        <label z-form-label>Success State</label>
      </z-float-label>
    </div>
  `,
})
export class ZardDemoFloatLabelStatusComponent {}

```