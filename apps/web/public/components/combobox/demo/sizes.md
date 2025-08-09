```angular-ts showLineNumbers
import { Component } from '@angular/core';

import { ZardComboboxComponent, ZardComboboxOption } from '../combobox.component';

@Component({
  selector: 'zard-demo-combobox-sizes',
  standalone: true,
  imports: [ZardComboboxComponent],
  template: `
    <div class="flex flex-col gap-4">
      <z-combobox
        [options]="frameworks"
        [placeholder]="'Small (150px)'"
        [zWidth]="'sm'"
      />
      
      <z-combobox
        [options]="frameworks"
        [placeholder]="'Default (200px)'"
        [zWidth]="'default'"
      />
      
      <z-combobox
        [options]="frameworks"
        [placeholder]="'Medium (250px)'"
        [zWidth]="'md'"
      />
      
      <z-combobox
        [options]="frameworks"
        [placeholder]="'Large (350px)'"
        [zWidth]="'lg'"
      />
      
      <z-combobox
        [options]="frameworks"
        [placeholder]="'Full width'"
        [zWidth]="'full'"
      />
    </div>
  `,
})
export class ZardDemoComboboxSizesComponent {
  frameworks: ZardComboboxOption[] = [
    { value: 'angular', label: 'Angular' },
    { value: 'react', label: 'React' },
    { value: 'vue', label: 'Vue.js' },
    { value: 'svelte', label: 'Svelte' },
    { value: 'ember', label: 'Ember.js' },
  ];
}
```