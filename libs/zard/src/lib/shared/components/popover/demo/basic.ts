import { ChangeDetectionStrategy, Component } from '@angular/core';

import { ZardButtonComponent } from '@/shared/components/button/button.component';
import { ZardPopoverImports } from '@/shared/components/popover/popover.imports';

@Component({
  selector: 'z-demo-popover-basic',
  imports: [ZardButtonComponent, ...ZardPopoverImports],
  template: `
    <button type="button" z-button zPopover zAlign="start" zType="outline" class="w-fit" [zContent]="popoverContent">
      Open Popover
    </button>

    <ng-template #popoverContent>
      <z-popover>
        <div z-popover-header>
          <h4 z-popover-title>Dimensions</h4>
          <p z-popover-description>Set the dimensions for the layer.</p>
        </div>
      </z-popover>
    </ng-template>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ZardDemoPopoverBasicComponent {}
