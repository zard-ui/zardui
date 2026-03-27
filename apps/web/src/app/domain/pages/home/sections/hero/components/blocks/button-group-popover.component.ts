import { Component, ChangeDetectionStrategy } from '@angular/core';

import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideBot, lucideChevronDown } from '@ng-icons/lucide';

import { ZardButtonComponent } from '@zard/components/button/button.component';
import { ZardButtonGroupComponent } from '@zard/components/button-group/button-group.component';
import { ZardInputDirective } from '@zard/components/input/input.directive';
import { ZardPopoverComponent, ZardPopoverDirective } from '@zard/components/popover/popover.component';

@Component({
  selector: 'z-block-button-group-popover',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ZardButtonComponent,
    ZardButtonGroupComponent,
    NgIcon,
    ZardInputDirective,
    ZardPopoverComponent,
    ZardPopoverDirective,
  ],
  viewProviders: [provideIcons({ lucideBot, lucideChevronDown })],
  template: `
    <z-button-group>
      <button z-button zType="outline" zSize="sm">
        <ng-icon name="lucideBot" />
        Copilot
      </button>
      <button
        z-button
        zType="outline"
        zSize="sm"
        class="size-7! rounded-r-md!"
        aria-label="Open Popover"
        zPopover
        [zContent]="popoverContent"
        zAlign="end"
      >
        <ng-icon name="lucideChevronDown" />
      </button>
      <ng-template #popoverContent>
        <z-popover class="w-72 rounded-xl p-0 text-sm">
          <div class="px-4 py-3">
            <div class="text-sm font-medium">Agent Tasks</div>
          </div>
          <div class="bg-border h-px"></div>
          <div class="p-4 text-sm">
            <textarea
              z-input
              aria-label="Task description"
              placeholder="Describe your task in natural language."
              class="mb-4 resize-none"
              rows="3"
            ></textarea>
            <p class="mb-2 font-medium">Start a new task with Copilot</p>
            <p class="text-muted-foreground">
              Describe your task in natural language. Copilot will work in the background and open a pull request for
              your review.
            </p>
          </div>
        </z-popover>
      </ng-template>
    </z-button-group>
  `,
})
export class BlockButtonGroupPopoverComponent {}
