import { ChangeDetectionStrategy, Component, signal } from '@angular/core';

import { ZardFieldImports } from '@/shared/components/field/field.imports';

import { ZardColorPickerComponent } from '../color-picker.component';

@Component({
  selector: 'z-demo-color-picker-formats',
  imports: [ZardColorPickerComponent, ZardFieldImports],
  template: `
    <div z-field-group class="mx-auto w-60">
      <div z-field>
        <label z-field-label for="color-picker-format-hex">Hex</label>
        <z-color-picker zId="color-picker-format-hex" zShowValue [(value)]="hex" />
      </div>

      <div z-field>
        <label z-field-label for="color-picker-format-rgb">RGB</label>
        <z-color-picker zId="color-picker-format-rgb" zFormat="rgb" zShowValue [(value)]="rgb" />
      </div>

      <div z-field>
        <label z-field-label for="color-picker-format-hsl">HSL</label>
        <z-color-picker zId="color-picker-format-hsl" zFormat="hsl" zShowValue [(value)]="hsl" />
      </div>

      <div z-field>
        <label z-field-label for="color-picker-format-oklch">OKLCH</label>
        <z-color-picker zId="color-picker-format-oklch" zFormat="oklch" zShowValue [(value)]="oklch" />
      </div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ZardDemoColorPickerFormatsComponent {
  readonly hex = signal<string | null>('#7c3aed');
  readonly rgb = signal<string | null>('rgb(234, 88, 12)');
  readonly hsl = signal<string | null>('hsl(199, 89%, 48%)');
  readonly oklch = signal<string | null>('oklch(0.723 0.219 149.579)');
}
