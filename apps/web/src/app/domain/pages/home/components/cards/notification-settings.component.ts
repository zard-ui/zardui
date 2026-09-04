import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { ZardButtonComponent } from '@zard/components/button/button.component';
import { ZardCardImports } from '@zard/components/card/card.imports';
import { ZardCheckboxComponent } from '@zard/components/checkbox/checkbox.component';
import { ZardFieldImports } from '@zard/components/field/field.imports';

interface NotificationOption {
  readonly id: string;
  readonly label: string;
  readonly description: string;
  readonly checked: boolean;
}

@Component({
  selector: 'z-card-notification-settings',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ZardCardImports, ZardFieldImports, ZardCheckboxComponent, ZardButtonComponent, FormsModule],
  host: { class: 'block w-full' },
  template: `
    <z-card>
      <z-card-header>
        <h3 z-card-title zTitle="Notifications"></h3>
        <p z-card-description zDescription="Choose which email and push alerts you want to receive."></p>
      </z-card-header>

      <z-card-content>
        <div z-field-group>
          @for (option of options; track option.id) {
            <div z-field zOrientation="horizontal">
              <z-checkbox [zId]="'notify-' + option.id" [ngModel]="option.checked" class="gap-0" />
              <div z-field-content>
                <label z-field-label [for]="'notify-' + option.id">{{ option.label }}</label>
                <p z-field-description>{{ option.description }}</p>
              </div>
            </div>
          }
        </div>
      </z-card-content>

      <z-card-content class="flex items-center">
        <button type="button" z-button class="w-full">Save Preferences</button>
      </z-card-content>
    </z-card>
  `,
})
export class CardNotificationSettingsComponent {
  readonly options: readonly NotificationOption[] = [
    {
      id: 'transactions',
      label: 'Transaction alerts',
      description: 'Deposits, withdrawals, and transfers.',
      checked: true,
    },
    { id: 'security', label: 'Security alerts', description: 'Login attempts and account changes.', checked: true },
    { id: 'goals', label: 'Goal milestones', description: 'Updates at 25%, 50%, 75%, and 100%.', checked: false },
    { id: 'market', label: 'Market updates', description: 'Daily portfolio summary and price alerts.', checked: false },
  ];
}
