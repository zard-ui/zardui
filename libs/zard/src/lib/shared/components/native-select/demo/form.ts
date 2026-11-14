import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

import { ZardButtonComponent } from '@/shared/components/button/button.component';
import { ZardFieldImports } from '@/shared/components/field/field.imports';
import { ZardNativeSelectDirective } from '@/shared/components/native-select/native-select.directive';

@Component({
  selector: 'z-demo-native-select-form',
  imports: [ZardNativeSelectDirective, ZardButtonComponent, ReactiveFormsModule, ...ZardFieldImports],
  template: `
    <form class="w-64" [formGroup]="form" (ngSubmit)="onSubmit()">
      <div z-field-group>
        @let statusControl = form.controls.status;
        @let statusInvalid = statusControl.invalid && statusControl.touched;
        <div z-field [attr.data-invalid]="statusInvalid || null">
          <label z-field-label for="native-select-form-status">Status</label>
          <select
            z-native-select
            id="native-select-form-status"
            formControlName="status"
            [attr.aria-invalid]="statusInvalid || null"
          >
            <option value="" disabled>Select status</option>
            <option value="todo">Todo</option>
            <option value="in-progress">In progress</option>
            <option value="done">Done</option>
          </select>
          @if (statusInvalid) {
            <z-field-error>Status is required.</z-field-error>
          } @else {
            <p z-field-description>Current value: {{ statusControl.value || 'none' }}</p>
          }
        </div>
        <div z-field zOrientation="horizontal">
          <button z-button type="button" zType="outline" (click)="form.reset()">Reset</button>
          <button z-button type="submit">Submit</button>
        </div>
      </div>
    </form>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ZardDemoNativeSelectFormComponent {
  readonly form = new FormGroup({
    status: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
  });

  onSubmit(): void {
    this.form.markAllAsTouched();
  }
}
