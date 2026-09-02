import { ChangeDetectionStrategy, Component } from '@angular/core';

import { ZardButtonComponent } from '@/shared/components/button/button.component';
import { ZardPopoverImports } from '@/shared/components/popover/popover.imports';

@Component({
  selector: 'z-demo-popover-hover',
  imports: [ZardButtonComponent, ...ZardPopoverImports],
  template: `
    <button type="button" z-button zPopover zTrigger="hover" zType="outline" [zContent]="popoverContent">
      Hover me
    </button>

    <ng-template #popoverContent>
      <z-popover>
        <div z-popover-header>
          <h4 z-popover-title>Hover content</h4>
          <p z-popover-description>This popover appears when you hover over the button.</p>
        </div>
      </z-popover>
    </ng-template>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ZardDemoPopoverHoverComponent {}
