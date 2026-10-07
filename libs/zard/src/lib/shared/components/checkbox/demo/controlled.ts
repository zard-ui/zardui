import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { ZardButtonComponent } from '@/shared/components/button';
import { ZardCheckboxComponent } from '@/shared/components/checkbox/checkbox.component';
import { ZardFieldImports } from '@/shared/components/field/field.imports';

@Component({
  selector: 'z-demo-checkbox-controlled',
  imports: [ZardCheckboxComponent, ZardButtonComponent, ...ZardFieldImports, FormsModule],
  template: `
    <div z-field-group class="mx-auto w-64">
      <div z-field zOrientation="horizontal">
        <z-checkbox
          zId="notifications-controlled"
          [ngModel]="notifications()"
          (checkChange)="notifications.set($event)"
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
export class ZardDemoCheckboxControlledComponent {
  protected readonly notifications = signal(true);
}
