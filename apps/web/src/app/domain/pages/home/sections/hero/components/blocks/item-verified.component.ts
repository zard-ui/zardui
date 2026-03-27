import { Component, ChangeDetectionStrategy } from '@angular/core';

import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideBadgeCheck, lucideChevronRight } from '@ng-icons/lucide';

@Component({
  selector: 'z-block-item-verified',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgIcon],
  viewProviders: [provideIcons({ lucideBadgeCheck, lucideChevronRight })],
  template: `
    <button
      type="button"
      class="border-border hover:bg-accent/50 focus-visible:border-ring focus-visible:ring-ring/50 flex w-full flex-wrap items-center gap-2.5 rounded-md border px-4 py-3 text-sm transition-colors duration-100 outline-none focus-visible:ring-[3px]"
    >
      <div class="flex shrink-0 items-center justify-center gap-2 bg-transparent">
        <ng-icon name="lucideBadgeCheck" class="size-5" />
      </div>
      <div class="flex flex-1 flex-col gap-1">
        <div class="flex w-fit items-center gap-2 text-sm leading-snug font-medium">
          Your profile has been verified.
        </div>
      </div>
      <div class="flex items-center gap-2">
        <ng-icon name="lucideChevronRight" class="size-4" />
      </div>
    </button>
  `,
})
export class BlockItemVerifiedComponent {}
