import { Component } from '@angular/core';

import { ZardComboboxComponent, type ZardComboboxOption } from '../combobox.component';

@Component({
  selector: 'zard-demo-combobox-default',
  imports: [ZardComboboxComponent],
  standalone: true,
  template: `
    <z-combobox
      [options]="frameworks"
      class="w-[200px]"
      placeholder="Select framework..."
      searchPlaceholder="Search framework..."
      emptyText="No framework found."
      (zComboSelected)="onSelect($event)"
    />
  `,
})
export class ZardDemoComboboxDefaultComponent {
  frameworks: ZardComboboxOption[] = [
    { value: 'angular', label: 'Angular' },
    { value: 'react', label: 'React' },
    { value: 'vue', label: 'Vue.js' },
    { value: 'svelte', label: 'Svelte' },
    { value: 'ember', label: 'Ember.js' },
    { value: 'nextjs', label: 'Next.js' },
  ];

  onSelect(option: ZardComboboxOption) {
    console.log('Selected:', option);
  }
}
