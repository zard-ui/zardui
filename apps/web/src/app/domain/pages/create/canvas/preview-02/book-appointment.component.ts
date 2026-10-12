import { ChangeDetectionStrategy, Component } from '@angular/core';

import { ZardAlertComponent } from '@zard/components/alert/alert.component';
import { ZardButtonComponent } from '@zard/components/button/button.component';
import { ZardCardImports } from '@zard/components/card/card.imports';
import { ZardFieldImports } from '@zard/components/field/field.imports';
import { ZardToggleGroupComponent, type ZardToggleGroupItem } from '@zard/components/toggle-group';

const SLOTS: ZardToggleGroupItem[] = ['9:00 AM', '10:30 AM', '11:00 AM', '1:30 PM'].map((time, index) => ({
  value: `slot-${index}`,
  label: time,
}));

@Component({
  selector: 'z-preview-02-book-appointment',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ZardAlertComponent, ZardButtonComponent, ZardCardImports, ZardFieldImports, ZardToggleGroupComponent],
  host: { class: 'block' },
  template: `
    <z-card>
      <z-card-header>
        <z-card-title zTitle="Book Appointment" />
        <z-card-description zDescription="Dr. Sarah Chen · Cardiology" />
      </z-card-header>
      <z-card-content class="flex flex-col gap-4">
        <z-field-group>
          <z-field>
            <z-field-label>Available on March 18, 2026</z-field-label>
            <z-toggle-group zMode="multiple" [zSpacing]="2" [zDefaultValue]="defaultSlots" [zItems]="slots" />
          </z-field>
        </z-field-group>
        <z-alert zTitle="New patient?" zDescription="Please arrive 15 minutes early." />
      </z-card-content>
      <z-card-footer>
        <button type="button" z-button class="w-full">Book Appointment</button>
      </z-card-footer>
    </z-card>
  `,
})
export class Preview02BookAppointmentComponent {
  protected readonly slots = SLOTS;
  protected readonly defaultSlots = ['slot-0'];
}
