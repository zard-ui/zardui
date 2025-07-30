import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { ZardButtonComponent } from '../../button/button.component';
import { ZardPopoverComponent, ZardPopoverDirective } from '../popover.component';

@Component({
  selector: 'z-popover-interactive-demo',
  standalone: true,
  imports: [FormsModule, ZardButtonComponent, ZardPopoverComponent, ZardPopoverDirective],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <button z-button zPopover [zContent]="interactiveContent" zType="outline">Settings</button>

    <ng-template #interactiveContent>
      <z-popover>
        <div class="space-y-4">
          <div class="space-y-2">
            <h4 class="font-medium leading-none">Settings</h4>
            <p class="text-sm text-muted-foreground">Manage your account settings.</p>
          </div>
          <div class="space-y-2">
            <label for="width" class="text-sm font-medium">Width</label>
            <input id="width" zInput type="text" placeholder="100%" class="w-full" />
          </div>
          <div class="space-y-2">
            <label for="height" class="text-sm font-medium">Height</label>
            <input id="height" zInput type="text" placeholder="25px" class="w-full" />
          </div>
          <button z-button class="w-full" zSize="sm">Save changes</button>
        </div>
      </z-popover>
    </ng-template>
  `,
})
export class ZardDemoPopoverInteractiveComponent {}
