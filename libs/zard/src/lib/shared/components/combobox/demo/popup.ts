import { ChangeDetectionStrategy, Component, signal } from '@angular/core';

import { ZardButtonComponent } from '../../button/button.component';
import { ZardComboboxImports } from '../combobox.imports';

@Component({
  selector: 'z-demo-combobox-popup',
  imports: [ZardButtonComponent, ZardComboboxImports],
  template: `
    <z-combobox zWidth="full" class="w-fit" [(zValue)]="value">
      <button type="button" z-button z-combobox-trigger zType="outline" class="w-64 justify-between font-normal">
        <z-combobox-value placeholder="Select country" />
      </button>

      <z-combobox-content>
        <z-combobox-input [zShowTrigger]="false" placeholder="Search" />

        <z-combobox-empty>No items found.</z-combobox-empty>

        <z-combobox-list>
          @for (country of countries; track country.code) {
            <z-combobox-item [zValue]="country.value" [zLabel]="country.label">{{ country.label }}</z-combobox-item>
          }
        </z-combobox-list>
      </z-combobox-content>
    </z-combobox>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ZardDemoComboboxPopupComponent {
  readonly value = signal<string | string[] | null>(null);

  readonly countries = [
    { code: 'ar', value: 'argentina', label: 'Argentina', continent: 'South America' },
    { code: 'au', value: 'australia', label: 'Australia', continent: 'Oceania' },
    { code: 'br', value: 'brazil', label: 'Brazil', continent: 'South America' },
    { code: 'ca', value: 'canada', label: 'Canada', continent: 'North America' },
    { code: 'cn', value: 'china', label: 'China', continent: 'Asia' },
    { code: 'co', value: 'colombia', label: 'Colombia', continent: 'South America' },
    { code: 'eg', value: 'egypt', label: 'Egypt', continent: 'Africa' },
    { code: 'fr', value: 'france', label: 'France', continent: 'Europe' },
    { code: 'de', value: 'germany', label: 'Germany', continent: 'Europe' },
    { code: 'it', value: 'italy', label: 'Italy', continent: 'Europe' },
    { code: 'jp', value: 'japan', label: 'Japan', continent: 'Asia' },
    { code: 'ke', value: 'kenya', label: 'Kenya', continent: 'Africa' },
    { code: 'mx', value: 'mexico', label: 'Mexico', continent: 'North America' },
    { code: 'nz', value: 'new-zealand', label: 'New Zealand', continent: 'Oceania' },
    { code: 'ng', value: 'nigeria', label: 'Nigeria', continent: 'Africa' },
    { code: 'za', value: 'south-africa', label: 'South Africa', continent: 'Africa' },
    { code: 'kr', value: 'south-korea', label: 'South Korea', continent: 'Asia' },
    { code: 'gb', value: 'united-kingdom', label: 'United Kingdom', continent: 'Europe' },
    { code: 'us', value: 'united-states', label: 'United States', continent: 'North America' },
  ];
}
