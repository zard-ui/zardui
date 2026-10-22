import { ChangeDetectionStrategy, Component, signal } from '@angular/core';

import { ZardInputComponent } from '@/shared/components/input/input.component';

import { ZardColorPickerComponent } from '../color-picker.component';

@Component({
  selector: 'z-demo-color-picker-sizes',
  imports: [ZardColorPickerComponent, ZardInputComponent],
  template: `
    <div class="mx-auto flex w-fit flex-col gap-4">
      <div class="flex items-center gap-2">
        <z-color-picker zSize="sm" [(value)]="color" />
        <z-color-picker [(value)]="color" />
        <z-color-picker zSize="lg" [(value)]="color" />
      </div>

      <div class="flex items-center gap-2">
        <input z-input aria-label="Name" placeholder="Name" class="w-40" />
        <z-color-picker zShowValue class="w-36" [(value)]="color" />
      </div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ZardDemoColorPickerSizesComponent {
  readonly color = signal<string | null>('#db2777');
}
