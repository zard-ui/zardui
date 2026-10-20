import { JsonPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';

import { ZardFieldImports } from '@/shared/components/field/field.imports';

import { ZardColorPickerComponent } from '../color-picker.component';

@Component({
  selector: 'z-demo-color-picker-form',
  imports: [ZardColorPickerComponent, ZardFieldImports, ReactiveFormsModule, JsonPipe],
  template: `
    <form [formGroup]="form">
      <div z-field-group class="mx-auto w-60">
        <div z-field>
          <label z-field-label for="color-picker-form-brand">Brand color</label>
          <z-color-picker
            zId="color-picker-form-brand"
            formControlName="brand"
            zShowValue
            [zPresets]="['#0f172a', '#2563eb', '#16a34a', '#f59e0b', '#dc2626']"
          />
          <p z-field-description>Used for buttons and links.</p>
        </div>

        <div z-field data-disabled="true">
          <label z-field-label for="color-picker-form-locked">Logo color (locked)</label>
          <z-color-picker zId="color-picker-form-locked" formControlName="logo" zShowValue />
        </div>

        <p class="text-muted-foreground text-sm">Form value: {{ form.getRawValue() | json }}</p>
      </div>
    </form>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ZardDemoColorPickerFormComponent {
  private readonly fb = inject(FormBuilder);

  protected readonly form = this.fb.group({
    brand: ['#2563eb'],
    logo: [{ value: '#0f172a', disabled: true }],
  });
}
