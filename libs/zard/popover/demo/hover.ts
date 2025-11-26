import { ChangeDetectionStrategy, Component } from '@angular/core';

import { ZardButtonComponent } from '@ngzard/ui/button';

import { ZardPopoverComponent, ZardPopoverDirective } from '../popover.component';

@Component({
  selector: 'z-popover-hover-demo',
  imports: [ZardButtonComponent, ZardPopoverComponent, ZardPopoverDirective],
  standalone: true,
  template: `
    <button z-button zPopover [zContent]="popoverContent" zTrigger="hover" zType="outline">Hover me</button>

    <ng-template #popoverContent>
      <z-popover>
        <div class="space-y-2">
          <h4 class="leading-none font-medium">Hover content</h4>
          <p class="text-muted-foreground text-sm">This popover appears when you hover over the button.</p>
        </div>
      </z-popover>
    </ng-template>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ZardDemoPopoverHoverComponent {}
