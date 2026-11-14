import { ChangeDetectionStrategy, Component, signal } from '@angular/core';

import { ZardFieldImports } from '@/shared/components/field/field.imports';

import { ZardColorPickerComponent } from '../color-picker.component';

@Component({
  selector: 'z-demo-color-picker-basic',
  imports: [ZardColorPickerComponent, ZardFieldImports],
  template: `
    <div z-field zOrientation="horizontal" class="mx-auto w-fit">
      <z-color-picker zId="color-picker-basic" [(value)]="color" />
      <label z-field-label for="color-picker-basic">Accent color</label>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ZardDemoColorPickerBasicComponent {
  readonly color = signal<string | null>('#16a34a');
}
