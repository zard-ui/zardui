import { Component, signal } from '@angular/core';

import { ZardComboboxImports } from '../combobox.imports';
import type { ZardComboboxOption } from '../combobox.types';

@Component({
  selector: 'zard-demo-combobox-disabled',
  imports: [ZardComboboxImports],
  standalone: true,
  template: `
    <div class="flex flex-wrap gap-4">
      <z-combobox zDisabled>
        <z-combobox-input placeholder="Select a framework" />

        <z-combobox-content>
          <z-combobox-empty>No items found.</z-combobox-empty>

          <z-combobox-list>
            @for (framework of frameworks; track framework.value) {
              <z-combobox-item [zValue]="framework.value">{{ framework.label }}</z-combobox-item>
            }
          </z-combobox-list>
        </z-combobox-content>
      </z-combobox>

      <z-combobox [(zValue)]="value">
        <z-combobox-input placeholder="Select a framework" />

        <z-combobox-content>
          <z-combobox-empty>No items found.</z-combobox-empty>

          <z-combobox-list>
            @for (framework of frameworksWithDisabled; track framework.value) {
              <z-combobox-item [zValue]="framework.value" [zDisabled]="framework.disabled ?? false">
                {{ framework.label }}
              </z-combobox-item>
            }
          </z-combobox-list>
        </z-combobox-content>
      </z-combobox>
    </div>
  `,
})
export class ZardDemoComboboxDisabledComponent {
  readonly value = signal<string | string[] | null>(null);

  frameworks: ZardComboboxOption[] = [
    { value: 'angular', label: 'Angular' },
    { value: 'react', label: 'React' },
    { value: 'vue', label: 'Vue.js' },
  ];

  frameworksWithDisabled: ZardComboboxOption[] = [
    { value: 'angular', label: 'Angular' },
    { value: 'react', label: 'React', disabled: true },
    { value: 'vue', label: 'Vue.js' },
    { value: 'svelte', label: 'Svelte', disabled: true },
    { value: 'ember', label: 'Ember.js' },
  ];
}
