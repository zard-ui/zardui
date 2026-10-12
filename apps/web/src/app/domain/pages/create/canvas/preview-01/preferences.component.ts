import { ChangeDetectionStrategy, Component } from '@angular/core';

import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideX } from '@ng-icons/lucide';

import { ZardButtonComponent } from '@zard/components/button';
import { ZardCardImports } from '@zard/components/card';
import { ZardFieldImports } from '@zard/components/field';
import { ZardSelectImports } from '@zard/components/select';
import { ZardSwitchComponent } from '@zard/components/switch';

import { CURRENCIES } from './currencies';

@Component({
  selector: 'z-preview-01-preferences',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ZardCardImports, ZardFieldImports, ZardSelectImports, ZardSwitchComponent, ZardButtonComponent, NgIcon],
  viewProviders: [provideIcons({ lucideX })],
  template: `
    <z-card>
      <z-card-header>
        <z-card-title zTitle="Preferences" />
        <z-card-description zDescription="Manage your account settings and notifications." />
        <z-card-action>
          <button type="button" z-button zType="ghost" zSize="icon-sm" class="bg-muted" aria-label="Close">
            <ng-icon name="lucideX" />
          </button>
        </z-card-action>
      </z-card-header>
      <z-card-content>
        <z-field-group>
          <z-field>
            <label z-field-label for="p01-default-currency">Default Currency</label>
            <z-select id="p01-default-currency" class="w-full" zValue="usd">
              <z-select-group>
                @for (currency of currencies; track currency.value) {
                  <z-select-item [zValue]="currency.value">{{ currency.label }}</z-select-item>
                }
              </z-select-group>
            </z-select>
          </z-field>
          <z-field-separator class="style-sera:hidden -my-4" />
          <z-field zOrientation="horizontal">
            <z-field-content>
              <label z-field-label for="p01-public-statistics">Public Statistics</label>
              <p z-field-description>Allow others to see your total stream count and listening activity</p>
            </z-field-content>
            <z-switch zId="p01-public-statistics" [zChecked]="true" />
          </z-field>
          <z-field-separator class="style-sera:hidden -my-4" />
          <z-field zOrientation="horizontal">
            <z-field-content>
              <label z-field-label for="p01-email-notifications">Email Notifications</label>
              <p z-field-description>Monthly royalty reports and distribution updates</p>
            </z-field-content>
            <z-switch zId="p01-email-notifications" [zChecked]="true" />
          </z-field>
        </z-field-group>
      </z-card-content>
      <z-card-footer>
        <button type="button" z-button zType="outline">Reset</button>
        <button type="button" z-button class="ml-auto">Save Preferences</button>
      </z-card-footer>
    </z-card>
  `,
})
export class Preview01PreferencesComponent {
  protected readonly currencies = CURRENCIES;
}
