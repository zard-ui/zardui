import { Component, ChangeDetectionStrategy } from '@angular/core';

import { ZardButtonComponent } from '@zard/components/button/button.component';

@Component({
  selector: 'z-block-item-two-factor',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ZardButtonComponent],
  template: `
    <div
      class="border-border focus-visible:border-ring focus-visible:ring-ring/50 flex flex-wrap items-center gap-4 rounded-md border p-4 text-sm transition-colors duration-100 outline-none focus-visible:ring-[3px]"
    >
      <div class="flex flex-1 flex-col gap-1">
        <div class="flex w-fit items-center gap-2 text-sm leading-snug font-medium">Two-factor authentication</div>
        <p
          class="text-muted-foreground line-clamp-2 text-sm leading-normal font-normal text-pretty xl:hidden 2xl:block"
        >
          Verify via email or phone number.
        </p>
      </div>
      <div class="flex items-center gap-2">
        <button z-button zSize="sm">Enable</button>
      </div>
    </div>
  `,
})
export class BlockItemTwoFactorComponent {}
