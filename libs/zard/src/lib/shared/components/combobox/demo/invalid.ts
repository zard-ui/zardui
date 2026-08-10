import { Component, signal } from '@angular/core';

import { ZardFieldImports } from '../../field/field.imports';
import { ZardComboboxImports } from '../combobox.imports';
import type { ZardComboboxOption } from '../combobox.types';

@Component({
  selector: 'zard-demo-combobox-invalid',
  imports: [ZardComboboxImports, ZardFieldImports],
  standalone: true,
  template: `
    <div z-field class="w-full min-w-48" data-invalid="true">
      <label z-field-label for="combobox-invalid">Framework</label>

      <z-combobox id="combobox-invalid" zInvalid [(zValue)]="value">
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

      <z-field-error>Please select a framework.</z-field-error>
    </div>
  `,
})
export class ZardDemoComboboxInvalidComponent {
  readonly value = signal<string | string[] | null>(null);

  frameworks: ZardComboboxOption[] = [
    { value: 'angular', label: 'Angular' },
    { value: 'react', label: 'React' },
    { value: 'vue', label: 'Vue.js' },
    { value: 'svelte', label: 'Svelte' },
    { value: 'ember', label: 'Ember.js' },
    { value: 'nextjs', label: 'Next.js' },
  ];
}
