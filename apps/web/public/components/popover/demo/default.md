```angular-ts showLineNumbers
import { ChangeDetectionStrategy, Component } from '@angular/core';

import { ZardButtonComponent } from '../../button/button.component';
import { ZardPopoverComponent, ZardPopoverDirective } from '../popover.component';

@Component({
  selector: 'z-popover-default-demo',
  standalone: true,
  imports: [ZardButtonComponent, ZardPopoverComponent, ZardPopoverDirective],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <button z-button zPopover [zContent]="popoverContent" zType="outline">Open popover</button>

    <ng-template #popoverContent>
      <z-popover>
        <div class="space-y-2">
          <h4 class="font-medium leading-none">Dimensions</h4>
          <p class="text-sm text-muted-foreground">Set the dimensions for the layer.</p>
        </div>
      </z-popover>
    </ng-template>
  `,
})
export class ZardDemoPopoverDefaultComponent {}

```