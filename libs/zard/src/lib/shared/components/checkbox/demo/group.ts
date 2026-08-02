import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { ZardCheckboxComponent } from '@/shared/components/checkbox/checkbox.component';
import { ZardFieldImports } from '@/shared/components/field/field.imports';

@Component({
  selector: 'z-demo-checkbox-group',
  imports: [ZardCheckboxComponent, ...ZardFieldImports, FormsModule],
  template: `
    <fieldset z-field-set>
      <legend z-field-legend zVariant="label">Show these items on the desktop:</legend>
      <p z-field-description>Select the items you want to show on the desktop.</p>
      <div z-field-group class="gap-3">
        <div z-field zOrientation="horizontal">
          <z-checkbox zId="finder-pref-9k2-hard-disks-ljj-checkbox" [(ngModel)]="hardDisks" />
          <label z-field-label for="finder-pref-9k2-hard-disks-ljj-checkbox" class="font-normal">Hard disks</label>
        </div>
        <div z-field zOrientation="horizontal">
          <z-checkbox zId="finder-pref-9k2-external-disks-1yg-checkbox" [(ngModel)]="externalDisks" />
          <label z-field-label for="finder-pref-9k2-external-disks-1yg-checkbox" class="font-normal">
            External disks
          </label>
        </div>
        <div z-field zOrientation="horizontal">
          <z-checkbox zId="finder-pref-9k2-cds-dvds-fzt-checkbox" [(ngModel)]="cds" />
          <label z-field-label for="finder-pref-9k2-cds-dvds-fzt-checkbox" class="font-normal">
            CDs, DVDs, and iPods
          </label>
        </div>
        <div z-field zOrientation="horizontal">
          <z-checkbox zId="finder-pref-9k2-connected-servers-6l2-checkbox" [(ngModel)]="connectedServers" />
          <label z-field-label for="finder-pref-9k2-connected-servers-6l2-checkbox" class="font-normal">
            Connected servers
          </label>
        </div>
      </div>
    </fieldset>
  `,
})
export class ZardDemoCheckboxGroupComponent {
  hardDisks = true;
  externalDisks = true;
  cds = false;
  connectedServers = false;
}
