import { Component, ChangeDetectionStrategy } from '@angular/core';

import { ZardButtonComponent } from '@zard/components/button/button.component';

@Component({
  selector: 'z-block-item-two-factor',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ZardButtonComponent],
  template: `
    <div
      class="group/item focus-visible:border-ring focus-visible:ring-ring/50 [a]:hover:bg-muted border-border flex w-full flex-wrap items-center gap-2.5 rounded-lg border px-3 py-2.5 text-sm transition-colors duration-100 outline-none focus-visible:ring-[3px] [a]:transition-colors"
    >
      <div class="flex flex-1 flex-col gap-1">
        <div class="flex w-fit items-center gap-2 text-sm leading-snug font-medium">Two-factor authentication</div>
        <p
          class="text-muted-foreground [&>a:hover]:text-primary line-clamp-2 text-left text-sm leading-normal font-normal text-pretty group-data-[size=xs]/item:text-xs xl:hidden 2xl:block [&>a]:underline [&>a]:underline-offset-4"
        >
          Verify via email or phone number.
        </p>
      </div>
      <div class="flex items-center gap-2">
        <button z-button zSize="sm" type="button">Enable</button>
      </div>
    </div>
  `,
})
export class BlockItemTwoFactorComponent {}
