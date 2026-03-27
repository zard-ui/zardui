import { Component, ChangeDetectionStrategy } from '@angular/core';

import { ZardDividerComponent } from '@zard/components/divider/divider.component';

@Component({
  selector: 'z-block-field-separator',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ZardDividerComponent],
  template: `
    <div class="relative my-4 h-5 text-sm">
      <z-divider class="absolute inset-0 -top-1.25" />
      <span class="bg-background text-muted-foreground relative mx-auto block w-fit px-2">
        <ng-content />
      </span>
    </div>
  `,
})
export class BlockFieldSeparatorComponent {}
