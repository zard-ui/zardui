import { Component, signal } from '@angular/core';

import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideGlobe } from '@ng-icons/lucide';

import { ZardInputGroupAddonComponent } from '../../input-group/input-group.component';
import { ZardComboboxImports } from '../combobox.imports';

@Component({
  selector: 'zard-demo-combobox-input-group',
  imports: [NgIcon, ZardComboboxImports, ZardInputGroupAddonComponent],
  standalone: true,
  template: `
    <z-combobox zWidth="md" [(zValue)]="value">
      <z-combobox-input placeholder="Select a timezone">
        <z-input-group-addon>
          <ng-icon name="lucideGlobe" />
        </z-input-group-addon>
      </z-combobox-input>

      <z-combobox-content>
        <z-combobox-empty>No timezones found.</z-combobox-empty>

        <z-combobox-list>
          @for (group of timezones; track group.label) {
            <z-combobox-group>
              <z-combobox-label>{{ group.label }}</z-combobox-label>

              @for (zone of group.options; track zone) {
                <z-combobox-item [zValue]="zone">{{ zone }}</z-combobox-item>
              }
            </z-combobox-group>
          }
        </z-combobox-list>
      </z-combobox-content>
    </z-combobox>
  `,
  viewProviders: [provideIcons({ lucideGlobe })],
})
export class ZardDemoComboboxInputGroupComponent {
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
