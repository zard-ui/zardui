import { Component, ChangeDetectionStrategy } from '@angular/core';

import { ZardSeparatorComponent } from '@zard/components/separator/separator.component';

@Component({
  selector: 'z-block-field-separator',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ZardSeparatorComponent],
  template: `
    <div class="relative my-4 h-5 text-sm">
      <z-separator class="absolute inset-0 -top-1.25" />
      <span class="bg-background text-muted-foreground relative mx-auto block w-fit px-2">
        <ng-content />
      </span>
    </div>
  `,
})
export class BlockFieldSeparatorComponent {}
