import { Component } from '@angular/core';

import { ZardComboboxComponent, ZardComboboxOption } from '../combobox.component';

@Component({
  selector: 'zard-demo-combobox-disabled',
  standalone: true,
  imports: [ZardComboboxComponent],
  template: `
    <div class="flex gap-4">
      <z-combobox [options]="frameworks" [placeholder]="'Disabled combobox'" [disabled]="true" />

      <z-combobox [options]="frameworksWithDisabled" [placeholder]="'Select framework...'" [searchPlaceholder]="'Search framework...'" [emptyText]="'No framework found.'" />
    </div>
  `,
})
export class ZardDemoComboboxDisabledComponent {
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
