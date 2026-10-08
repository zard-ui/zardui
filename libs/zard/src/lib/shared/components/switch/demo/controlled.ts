import { ChangeDetectionStrategy, Component, signal } from '@angular/core';

import { ZardButtonComponent } from '@/shared/components/button';
import { ZardFieldImports } from '@/shared/components/field/field.imports';
import { ZardSwitchComponent } from '@/shared/components/switch/switch.component';

@Component({
  selector: 'z-demo-switch-controlled',
  imports: [ZardSwitchComponent, ZardButtonComponent, ...ZardFieldImports],
  template: `
    <div z-field-group class="mx-auto w-64">
      <div z-field zOrientation="horizontal">
        <z-switch
          zId="notifications-controlled"
          [zChecked]="notifications()"
          (zCheckedChange)="notifications.set($event)"
        />
        <label z-field-label for="notifications-controlled">Enable notifications</label>
      </div>
      <p class="text-muted-foreground text-sm">Notifications are {{ notifications() ? 'on' : 'off' }}.</p>
      <button type="button" z-button zType="outline" zSize="sm" (click)="notifications.set(!notifications())">
        Toggle from outside
      </button>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ZardDemoSwitchControlledComponent {
  protected readonly notifications = signal(true);
}
