import { ChangeDetectionStrategy, Component, signal } from '@angular/core';

import { ZardFieldImports } from '@/shared/components/field/field.imports';

import { ZardColorPickerComponent } from '../color-picker.component';

@Component({
  selector: 'z-demo-color-picker-alpha',
  imports: [ZardColorPickerComponent, ZardFieldImports],
  template: `
    <div z-field class="mx-auto w-60">
      <label z-field-label for="color-picker-alpha">Overlay</label>
      <z-color-picker zId="color-picker-alpha" zFormat="rgb" zAlpha zShowValue [(value)]="color" />
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ZardDemoColorPickerAlphaComponent {
  readonly color = signal<string | null>('rgba(15, 23, 42, 0.6)');
}
