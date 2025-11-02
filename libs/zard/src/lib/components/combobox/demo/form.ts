import { Component } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';

import { ZardButtonComponent } from '../../button/button.component';
import { ZardComboboxComponent, type ZardComboboxOption } from '../combobox.component';

@Component({
  selector: 'zard-demo-combobox-form',
  standalone: true,
  imports: [ReactiveFormsModule, ZardComboboxComponent, ZardButtonComponent],
  template: `
    <div class="flex flex-col gap-4">
      <z-combobox
        [options]="frameworks"
        [placeholder]="'Select framework...'"
        [searchPlaceholder]="'Search framework...'"
        [emptyText]="'No framework found.'"
        [formControl]="frameworkControl"
      />

      <div class="flex gap-2">
        <button z-button variant="outline" (click)="setValue()">Set to Vue.js</button>
        <button z-button variant="outline" (click)="clearValue()">Clear</button>
        <button z-button variant="outline" (click)="logValue()">Log Value</button>
      </div>

      <div class="text-muted-foreground text-sm">Current value: {{ frameworkControl.value ?? 'None' }}</div>
    </div>
  `,
})
export class ZardDemoComboboxFormComponent {
  frameworkControl = new FormControl<string | null>(null);

  frameworks: ZardComboboxOption[] = [
    { value: 'angular', label: 'Angular' },
    { value: 'react', label: 'React' },
    { value: 'vue', label: 'Vue.js' },
    { value: 'svelte', label: 'Svelte' },
    { value: 'ember', label: 'Ember.js' },
  ];

  setValue() {
    this.frameworkControl.setValue('vue');
  }

  clearValue() {
    this.frameworkControl.setValue(null);
  }

  logValue() {
    console.log('Form Control Value:', this.frameworkControl.value);
  }
}
