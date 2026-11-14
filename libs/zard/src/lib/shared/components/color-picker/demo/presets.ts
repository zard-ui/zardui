import { ChangeDetectionStrategy, Component, signal } from '@angular/core';

import { ZardFieldImports } from '@/shared/components/field/field.imports';

import { ZardColorPickerComponent } from '../color-picker.component';

@Component({
  selector: 'z-demo-color-picker-presets',
  imports: [ZardColorPickerComponent, ZardFieldImports],
  template: `
    <div z-field class="mx-auto w-60">
      <label z-field-label for="color-picker-presets">Label color</label>
      <z-color-picker zId="color-picker-presets" zShowValue [zPresets]="presets" [(value)]="color" />
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ZardDemoColorPickerPresetsComponent {
  protected readonly presets = [
    '#0f172a',
    '#dc2626',
    '#ea580c',
    '#f59e0b',
    '#16a34a',
    '#0d9488',
    '#2563eb',
    '#7c3aed',
    '#db2777',
  ];

  readonly color = signal<string | null>(null);
}
