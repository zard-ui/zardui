import { ChangeDetectionStrategy, Component, signal } from '@angular/core';

import { ZardItemImports } from '../../item/item.imports';
import { ZardComboboxImports } from '../combobox.imports';

@Component({
  selector: 'z-demo-combobox-custom-items',
  imports: [ZardComboboxImports, ZardItemImports],
  template: `
    <z-combobox zWidth="md" [(zValue)]="value">
      <z-combobox-input placeholder="Search countries..." />

      <z-combobox-content>
        <z-combobox-empty>No countries found.</z-combobox-empty>

        <z-combobox-list>
          @for (country of countries; track country.code) {
            <z-combobox-item [zValue]="country.value" [zLabel]="country.label">
              <div z-item zSize="xs" class="p-0">
                <div z-item-content>
                  <div z-item-title class="whitespace-nowrap">{{ country.label }}</div>
                  <p z-item-description>{{ country.continent }} ({{ country.code }})</p>
                </div>
              </div>
            </z-combobox-item>
          }
        </z-combobox-list>
      </z-combobox-content>
    </z-combobox>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ZardDemoComboboxCustomItemsComponent {
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
