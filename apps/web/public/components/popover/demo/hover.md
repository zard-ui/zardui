```angular-ts showLineNumbers
import { ChangeDetectionStrategy, Component } from '@angular/core';

import { ZardButtonComponent } from '../../button/button.component';
import { ZardPopoverComponent, ZardPopoverDirective } from '../popover.component';

@Component({
  selector: 'z-popover-hover-demo',
  standalone: true,
  imports: [ZardButtonComponent, ZardPopoverComponent, ZardPopoverDirective],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <button z-button zPopover [zContent]="popoverContent" zTrigger="hover" zType="outline">Hover me</button>

    <ng-template #popoverContent>
      <z-popover>
        <div class="space-y-2">
          <h4 class="font-medium leading-none">Hover content</h4>
          <p class="text-sm text-muted-foreground">This popover appears when you hover over the button.</p>
        </div>
      </z-popover>
    </ng-template>
  `,
})
export class ZardDemoPopoverHoverComponent {}

```