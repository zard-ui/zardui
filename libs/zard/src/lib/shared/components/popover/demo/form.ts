import { ChangeDetectionStrategy, Component } from '@angular/core';

import { ZardButtonComponent } from '@/shared/components/button/button.component';
import { ZardFieldImports } from '@/shared/components/field/field.imports';
import { ZardInputComponent } from '@/shared/components/input/input.component';
import { ZardPopoverImports } from '@/shared/components/popover/popover.imports';

@Component({
  selector: 'z-demo-popover-form',
  imports: [ZardButtonComponent, ZardInputComponent, ...ZardFieldImports, ...ZardPopoverImports],
  template: `
    <button type="button" z-button zPopover zAlign="start" zType="outline" [zContent]="popoverContent">
      Open Popover
    </button>

    <ng-template #popoverContent>
      <z-popover class="w-64">
        <div z-popover-header>
          <h4 z-popover-title>Dimensions</h4>
          <p z-popover-description>Set the dimensions for the layer.</p>
        </div>

        <div z-field-group class="gap-4">
          <div z-field zOrientation="horizontal">
            <label z-field-label for="form-width" class="w-1/2">Width</label>
            <input z-input type="text" id="form-width" value="100%" />
          </div>

          <div z-field zOrientation="horizontal">
            <label z-field-label for="form-height" class="w-1/2">Height</label>
            <input z-input type="text" id="form-height" value="25px" />
          </div>
        </div>
      </z-popover>
    </ng-template>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ZardDemoPopoverFormComponent {}
