import { Component, signal } from '@angular/core';

import { ZardComboboxComponent } from '../combobox.component';
import type { ZardComboboxOption } from '../combobox.types';

@Component({
  selector: 'z-demo-combobox-shorthand',
  imports: [ZardComboboxComponent],
  template: `
    <div class="flex flex-col gap-2">
      <z-combobox
        [options]="frameworks"
        placeholder="Select framework..."
        searchPlaceholder="Search framework..."
        emptyText="No framework found."
        (zComboSelected)="selected.set($event)"
      />

      <p class="text-muted-foreground text-sm">Selected: {{ selected()?.label ?? 'none' }}</p>
    </div>
  `,
})
export class ZardDemoComboboxShorthandComponent {
  readonly selected = signal<ZardComboboxOption | null>(null);

  frameworks: ZardComboboxOption[] = [
    { value: 'angular', label: 'Angular' },
    { value: 'react', label: 'React' },
    { value: 'vue', label: 'Vue.js' },
    { value: 'svelte', label: 'Svelte' },
    { value: 'ember', label: 'Ember.js' },
    { value: 'nextjs', label: 'Next.js' },
  ];
}
