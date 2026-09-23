import { ChangeDetectionStrategy, Component, signal } from '@angular/core';

import { ZardComboboxImports } from '../combobox.imports';

@Component({
  selector: 'z-demo-combobox-grouped',
  imports: [ZardComboboxImports],
  template: `
    <z-combobox zWidth="md" [(zValue)]="value">
      <z-combobox-input placeholder="Select a timezone" />

      <z-combobox-content>
        <z-combobox-empty>No timezones found.</z-combobox-empty>

        <z-combobox-list>
          @for (group of timezones; track group.label; let last = $last) {
            <z-combobox-group>
              <z-combobox-label>{{ group.label }}</z-combobox-label>

              @for (zone of group.options; track zone) {
                <z-combobox-item [zValue]="zone">{{ zone }}</z-combobox-item>
              }

              @if (!last) {
                <z-combobox-separator />
              }
            </z-combobox-group>
          }
        </z-combobox-list>
      </z-combobox-content>
    </z-combobox>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ZardDemoComboboxGroupedComponent {
  readonly value = signal<string | string[] | null>(null);

  readonly timezones = [
    {
      label: 'Americas',
      options: [
        '(GMT-5) New York',
        '(GMT-8) Los Angeles',
        '(GMT-6) Chicago',
        '(GMT-5) Toronto',
        '(GMT-8) Vancouver',
        '(GMT-3) São Paulo',
      ],
    },
    {
      label: 'Europe',
      options: [
        '(GMT+0) London',
        '(GMT+1) Paris',
        '(GMT+1) Berlin',
        '(GMT+1) Rome',
        '(GMT+1) Madrid',
        '(GMT+1) Amsterdam',
      ],
    },
    {
      label: 'Asia/Pacific',
      options: [
        '(GMT+9) Tokyo',
        '(GMT+8) Shanghai',
        '(GMT+8) Singapore',
        '(GMT+4) Dubai',
        '(GMT+11) Sydney',
        '(GMT+9) Seoul',
      ],
    },
  ];
}
