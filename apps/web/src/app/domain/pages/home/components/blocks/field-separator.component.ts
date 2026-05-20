import { Component, ChangeDetectionStrategy } from '@angular/core';

import { ZardSeparatorComponent } from '@zard/components/separator/separator.component';

@Component({
  selector: 'z-block-field-separator',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ZardSeparatorComponent],
  template: `
    <div class="flex items-center gap-3 text-sm">
      <z-separator class="flex-1" />
      <span class="text-muted-foreground whitespace-nowrap">
        <ng-content />
      </span>
      <z-separator class="flex-1" />
    </div>
  `,
})
export class BlockFieldSeparatorComponent {}
