import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { ZardButtonComponent } from '@zard/components/button/button.component';
import { ZardCardImports } from '@zard/components/card/card.imports';
import { ZardCheckboxComponent } from '@zard/components/checkbox/checkbox.component';

interface NotificationOption {
  readonly id: string;
  readonly label: string;
  readonly description: string;
  readonly checked: boolean;
}

/**
 * Uma lista de checkboxes com descrição — o formato de preferências.
 *
 * O rótulo e a descrição ficam dentro do `label` do próprio checkbox, e não ao
 * lado dele: assim a área clicável cobre as duas linhas, que é o que a pessoa
 * espera ao mirar num item de lista.
 */
@Component({
  selector: 'z-card-notification-settings',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ZardCardImports, ZardCheckboxComponent, ZardButtonComponent, FormsModule],
  host: { class: 'block w-full' },
  template: `
    <z-card>
      <z-card-header>
        <h3 z-card-title zTitle="Notifications"></h3>
        <p z-card-description zDescription="Choose which email and push alerts you want to receive."></p>
      </z-card-header>

      <z-card-content>
        <div class="flex flex-col gap-4">
          @for (option of options; track option.id) {
            <z-checkbox [zId]="'notify-' + option.id" [ngModel]="option.checked" class="items-start">
              <span class="flex flex-col gap-1">
                <span class="text-sm leading-none font-medium">{{ option.label }}</span>
                <span class="text-muted-foreground text-sm font-normal">{{ option.description }}</span>
              </span>
            </z-checkbox>
          }
        </div>
      </z-card-content>

      <z-card-footer>
        <button type="button" z-button class="w-full">Save Preferences</button>
      </z-card-footer>
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
