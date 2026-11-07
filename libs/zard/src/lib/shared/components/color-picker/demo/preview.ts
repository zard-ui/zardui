import { ChangeDetectionStrategy, Component, signal } from '@angular/core';

import { ZardColorPickerComponent } from '../color-picker.component';

@Component({
  selector: 'z-demo-color-picker-preview',
  imports: [ZardColorPickerComponent],
  template: `
    <z-color-picker class="mx-auto" zShowValue [(value)]="color" />
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ZardDemoColorPickerPreviewComponent {
  readonly color = signal<string | null>('#2563eb');
}
