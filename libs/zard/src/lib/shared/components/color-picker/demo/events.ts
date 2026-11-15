import { ChangeDetectionStrategy, Component, signal } from '@angular/core';

import { ZardFieldImports } from '@/shared/components/field/field.imports';

import { ZardColorPickerComponent } from '../color-picker.component';

@Component({
  selector: 'z-demo-color-picker-events',
  imports: [ZardColorPickerComponent, ZardFieldImports],
  template: `
    <div z-field class="mx-auto w-60">
      <label z-field-label for="color-picker-events">Theme color</label>
      <z-color-picker
        zId="color-picker-events"
        zShowValue
        zPlaceholder="No color yet"
        (zColorChange)="live.set($event)"
        (zColorCommit)="saved.set($event)"
      />
      <p z-field-description class="font-mono">
        Live: {{ live() ?? '—' }}
        <br />
        Saved: {{ saved() ?? '—' }}
      </p>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ZardDemoColorPickerEventsComponent {
  readonly live = signal<string | null>(null);
  readonly saved = signal<string | null>(null);
}
