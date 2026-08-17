import { Component } from '@angular/core';

import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideInfo } from '@ng-icons/lucide';

import { ZardBubbleImports } from '@/shared/components/bubble/bubble.imports';
import { ZardButtonComponent } from '@/shared/components/button/button.component';
import { ZardPopoverImports } from '@/shared/components/popover/popover.imports';

@Component({
  selector: 'z-demo-bubble-popover',
  host: { class: 'contents' },
  imports: [NgIcon, ZardButtonComponent, ...ZardPopoverImports, ...ZardBubbleImports],
  template: `
    <div class="flex w-full max-w-sm flex-col gap-4 py-12">
      <z-bubble zAlign="end">
        <z-bubble-content>Run the build script.</z-bubble-content>
      </z-bubble>
      <z-bubble zVariant="destructive">
        <z-bubble-content>Failed to run the command.</z-bubble-content>
        <z-bubble-reactions>
          <button
            type="button"
            z-button
            zType="ghost"
            zSize="icon-xs"
            zPopover
            aria-label="Show error details"
            class="aria-expanded:text-destructive"
            [zContent]="errorDetails"
          >
            <ng-icon name="lucideInfo" />
          </button>
        </z-bubble-reactions>
      </z-bubble>
    </div>

    <ng-template #errorDetails>
      <z-popover>
        <div z-popover-header>
          <h4 z-popover-title class="text-sm">Command failed with exit code 1</h4>
          <p z-popover-description class="text-sm">ENOENT: no such file or directory, open pnpm-lock.yaml</p>
        </div>
      </z-popover>
    </ng-template>
  `,
  viewProviders: [provideIcons({ lucideInfo })],
})
export class ZardDemoBubblePopoverComponent {}
