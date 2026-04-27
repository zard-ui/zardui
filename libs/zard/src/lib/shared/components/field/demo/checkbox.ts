import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { ZardCheckboxComponent } from '@/shared/components/checkbox/checkbox.component';
import { ZardFieldImports } from '@/shared/components/field/field.imports';

@Component({
  selector: 'z-demo-field-checkbox',
  imports: [...ZardFieldImports, ZardCheckboxComponent, FormsModule],
  template: `
    <div class="w-full min-w-md">
      <div z-field-group>
        <fieldset z-field-set>
          <legend z-field-legend zVariant="label">Show these items on the desktop</legend>
          <p z-field-description>Select the items you want to show on the desktop.</p>

          <div z-field-group class="gap-3">
            <div z-field zOrientation="horizontal">
              <span z-checkbox zId="finder-hard-disks" [(ngModel)]="hardDisks" name="hardDisks"></span>
              <label z-field-label for="finder-hard-disks" class="font-normal">Hard disks</label>
            </div>
            <div z-field zOrientation="horizontal">
              <span z-checkbox zId="finder-external-disks" [(ngModel)]="externalDisks" name="externalDisks"></span>
              <label z-field-label for="finder-external-disks" class="font-normal">External disks</label>
            </div>
            <div z-field zOrientation="horizontal">
              <span z-checkbox zId="finder-cds" [(ngModel)]="cds" name="cds"></span>
              <label z-field-label for="finder-cds" class="font-normal">CDs, DVDs, and iPods</label>
            </div>
            <div z-field zOrientation="horizontal">
              <span z-checkbox zId="finder-servers" [(ngModel)]="servers" name="servers"></span>
              <label z-field-label for="finder-servers" class="font-normal">Connected servers</label>
            </div>
          </div>
        </fieldset>

        <z-field-separator />

        <div z-field zOrientation="horizontal">
          <span z-checkbox zId="finder-sync-folders" [(ngModel)]="syncFolders" name="syncFolders"></span>
          <div z-field-content>
            <label z-field-label for="finder-sync-folders">Sync Desktop &amp; Documents folders</label>
            <p z-field-description>
              Your Desktop &amp; Documents folders are being synced with iCloud Drive. You can access them from other
              devices.
            </p>
          </div>
        </div>
      </div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ZardDemoFieldCheckboxComponent {
  protected hardDisks = true;
  protected externalDisks = false;
  protected cds = false;
  protected servers = false;
  protected syncFolders = true;
}
