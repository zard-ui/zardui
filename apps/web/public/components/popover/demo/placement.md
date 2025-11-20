```angular-ts showLineNumbers copyButton
import { ChangeDetectionStrategy, Component } from '@angular/core';

import { ZardButtonComponent } from '../../button/button.component';
import { ZardPopoverComponent, ZardPopoverDirective } from '../popover.component';

@Component({
  selector: 'z-popover-placement-demo',
  imports: [ZardButtonComponent, ZardPopoverComponent, ZardPopoverDirective],
  standalone: true,
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
          <h4 class="leading-none font-medium">Popover content</h4>
          <p class="text-muted-foreground text-sm">This is the popover content.</p>
        </div>
      </z-popover>
    </ng-template>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ZardDemoPopoverPlacementComponent {}

```