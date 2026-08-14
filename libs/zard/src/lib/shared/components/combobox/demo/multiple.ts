import { Component, computed, signal } from '@angular/core';

import { ZardComboboxImports } from '../combobox.imports';
import type { ZardComboboxOption } from '../combobox.types';

@Component({
  selector: 'zard-demo-combobox-multiple',
  imports: [ZardComboboxImports],
  standalone: true,
  template: `
    <z-combobox zMultiple zAutoHighlight zWidth="full" [(zValue)]="value">
      <z-combobox-chips class="w-full max-w-xs">
        @for (selected of selectedValues(); track selected) {
          <z-combobox-chip [zValue]="selected">{{ labelOf(selected) }}</z-combobox-chip>
        }

        <input z-combobox-chips-input placeholder="Add framework" />
      </z-combobox-chips>

      <z-combobox-content>
        <z-combobox-empty>No items found.</z-combobox-empty>

        <z-combobox-list>
          @for (framework of frameworks; track framework.value) {
            <z-combobox-item [zValue]="framework.value">{{ framework.label }}</z-combobox-item>
          }
        </z-combobox-list>
      </z-combobox-content>
    </z-combobox>
  `,
})
export class ZardDemoComboboxMultipleComponent {
  readonly value = signal<string | string[] | null>(['angular']);

  readonly selectedValues = computed(() => {
    const value = this.value();
    return Array.isArray(value) ? value : value ? [value] : [];
  });

  frameworks: ZardComboboxOption[] = [
    { value: 'angular', label: 'Angular' },
    { value: 'react', label: 'React' },
    { value: 'vue', label: 'Vue.js' },
    { value: 'svelte', label: 'Svelte' },
    { value: 'ember', label: 'Ember.js' },
    { value: 'nextjs', label: 'Next.js' },
  ];

  labelOf(value: string): string {
    return this.frameworks.find(framework => framework.value === value)?.label ?? value;
  }
}
