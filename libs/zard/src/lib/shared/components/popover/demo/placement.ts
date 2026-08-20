import { ChangeDetectionStrategy, Component } from '@angular/core';

import { ZardButtonComponent } from '@/shared/components/button/button.component';
import { ZardPopoverImports } from '@/shared/components/popover/popover.imports';

@Component({
  selector: 'z-demo-popover-placement',
  imports: [ZardButtonComponent, ...ZardPopoverImports],
  template: `
    <div class="flex flex-col space-y-2">
      <button type="button" z-button zPopover zPlacement="top" zType="outline" [zContent]="popoverContent">Top</button>

      <div class="flex space-x-2">
        <button type="button" z-button zPopover zPlacement="left" zType="outline" [zContent]="popoverContent">
          Left
        </button>
        <button type="button" z-button zPopover zPlacement="right" zType="outline" [zContent]="popoverContent">
          Right
        </button>
      </div>

      <button type="button" z-button zPopover zPlacement="bottom" zType="outline" [zContent]="popoverContent">
        Bottom
      </button>
    </div>

    <ng-template #popoverContent>
      <z-popover class="w-64">
        <div z-popover-header>
          <h4 z-popover-title>Placement</h4>
          <p z-popover-description>The popover flips automatically when it does not fit.</p>
        </div>
      </z-popover>
    </ng-template>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ZardDemoPopoverPlacementComponent {}
