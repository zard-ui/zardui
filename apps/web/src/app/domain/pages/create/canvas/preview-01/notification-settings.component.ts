import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { ZardButtonComponent } from '@zard/components/button';
import { ZardCardImports } from '@zard/components/card';
import { ZardCheckboxComponent } from '@zard/components/checkbox';
import { ZardFieldImports } from '@zard/components/field';

const NOTIFICATIONS = [
  {
    id: 'transactions',
    label: 'Transaction alerts',
    description: 'Deposits, withdrawals, and transfers.',
    defaultChecked: true,
  },
  {
    id: 'security',
    label: 'Security alerts',
    description: 'Login attempts and account changes.',
    defaultChecked: true,
  },
  {
    id: 'goals',
    label: 'Goal milestones',
    description: 'Updates at 25%, 50%, 75%, and 100%.',
    defaultChecked: false,
  },
  {
    id: 'market',
    label: 'Market updates',
    description: 'Daily portfolio summary and price alerts.',
    defaultChecked: false,
  },
] as const;

/** zard's checkbox has no indeterminate state, so "Select all" reads unchecked until every option is on. */
@Component({
  selector: 'z-preview-01-notification-settings',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [FormsModule, ZardCardImports, ZardFieldImports, ZardCheckboxComponent, ZardButtonComponent],
  template: `
    <z-card>
      <z-card-header>
        <z-card-title zTitle="Notifications" />
        <z-card-description zDescription="Choose what you want to be notified about." />
      </z-card-header>
      <z-card-content>
        <z-field-group>
          <z-field zOrientation="horizontal">
            <z-checkbox zId="p01-notify-all" [ngModel]="allChecked()" (checkChange)="selectAll($event)" />
            <z-field-content>
              <label z-field-label for="p01-notify-all">Select all</label>
            </z-field-content>
          </z-field>
          @for (notification of notifications; track notification.id) {
            <z-field zOrientation="horizontal">
              <z-checkbox
                [zId]="'p01-notify-' + notification.id"
                [ngModel]="checked()[notification.id]"
                (checkChange)="toggle(notification.id, $event)"
              />
              <z-field-content>
                <label z-field-label [for]="'p01-notify-' + notification.id">{{ notification.label }}</label>
                <p z-field-description>{{ notification.description }}</p>
              </z-field-content>
            </z-field>
          }
        </z-field-group>
      </z-card-content>
      <z-card-footer>
        <button type="button" z-button class="w-full">Save Preferences</button>
      </z-card-footer>
    </z-card>
  `,
})
export class Preview01NotificationSettingsComponent {
  protected readonly notifications = NOTIFICATIONS;
  protected readonly checked = signal<Record<string, boolean>>(
    Object.fromEntries(NOTIFICATIONS.map(notification => [notification.id, notification.defaultChecked])),
  );

  protected readonly allChecked = computed(() => NOTIFICATIONS.every(notification => this.checked()[notification.id]));

  protected selectAll(value: boolean): void {
    this.checked.set(Object.fromEntries(NOTIFICATIONS.map(notification => [notification.id, value])));
  }

  protected toggle(id: string, value: boolean): void {
    this.checked.update(checked => ({ ...checked, [id]: value }));
  }
}
