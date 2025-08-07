```angular-ts showLineNumbers
import { ChangeDetectionStrategy, Component } from '@angular/core';

import { ZardButtonComponent } from '../../button/button.component';
import { ZardPopoverComponent, ZardPopoverDirective } from '../popover.component';

@Component({
  selector: 'z-popover-placement-demo',
  standalone: true,
  imports: [ZardButtonComponent, ZardPopoverComponent, ZardPopoverDirective],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="flex flex-col space-y-2">
      <button z-button zPopover [zContent]="popoverContent" zPlacement="top" zType="outline">Top</button>

      <div class="flex space-x-2">
        <button z-button zPopover [zContent]="popoverContent" zPlacement="left" zType="outline">Left</button>
        <button z-button zPopover [zContent]="popoverContent" zPlacement="right" zType="outline">Right</button>
      </div>

      <button z-button zPopover [zContent]="popoverContent" zPlacement="bottom" zType="outline">Bottom</button>
    </div>

    <ng-template #popoverContent>
      <z-popover>
        <div class="space-y-2">
          <h4 class="font-medium leading-none">Popover content</h4>
          <p class="text-sm text-muted-foreground">This is the popover content.</p>
        </div>
      </z-popover>
    </ng-template>
  `,
})
export class ZardDemoPopoverPlacementComponent {}

```