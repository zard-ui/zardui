import { ChangeDetectionStrategy, Component, signal } from '@angular/core';

import { ZardColorPickerComponent } from '@zard/components/color-picker/color-picker.component';
import { ZardFieldImports } from '@zard/components/field/field.imports';
import { ZardInputComponent } from '@zard/components/input/input.component';

import { ExampleImports } from './example.component';

/** zard's color picker demos: basic, sizes, presets, alpha and formats. shadcn/ui has no counterpart. */
@Component({
  selector: 'z-color-picker-example',
  imports: [ExampleImports, ZardColorPickerComponent, ZardFieldImports, ZardInputComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <z-example-wrapper>
      <z-example zTitle="Basic">
        <div z-field zOrientation="horizontal" class="mx-auto w-fit">
          <z-color-picker zId="color-picker-example-basic" [(value)]="basic" />
          <label z-field-label for="color-picker-example-basic">Accent color</label>
        </div>
      </z-example>

      <z-example zTitle="Sizes">
        <div class="mx-auto flex w-fit flex-col gap-4">
          <div class="flex items-center gap-2">
            <z-color-picker zSize="sm" [(value)]="sizes" />
            <z-color-picker [(value)]="sizes" />
            <z-color-picker zSize="lg" [(value)]="sizes" />
          </div>

          <div class="flex items-center gap-2">
            <input z-input aria-label="Name" placeholder="Name" class="w-40" />
            <z-color-picker zShowValue class="w-36" [(value)]="sizes" />
          </div>
        </div>
      </z-example>

      <z-example zTitle="Presets">
        <div z-field class="mx-auto w-60">
          <label z-field-label for="color-picker-example-presets">Label color</label>
          <z-color-picker zId="color-picker-example-presets" zShowValue [zPresets]="presets" [(value)]="withPresets" />
        </div>
      </z-example>

      <z-example zTitle="Alpha">
        <div z-field class="mx-auto w-60">
          <label z-field-label for="color-picker-example-alpha">Overlay</label>
          <z-color-picker zId="color-picker-example-alpha" zFormat="rgb" zAlpha zShowValue [(value)]="alpha" />
        </div>
      </z-example>
    </z-example-wrapper>
  `,
})
export class ColorPickerExampleComponent {
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

  protected readonly basic = signal<string | null>('#16a34a');
  protected readonly sizes = signal<string | null>('#db2777');
  protected readonly withPresets = signal<string | null>(null);
  protected readonly alpha = signal<string | null>('rgba(15, 23, 42, 0.6)');
}
