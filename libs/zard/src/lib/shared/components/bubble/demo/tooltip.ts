import { Component } from '@angular/core';

import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideCheck } from '@ng-icons/lucide';

import { ZardBubbleImports } from '@/shared/components/bubble/bubble.imports';
import { ZardButtonComponent } from '@/shared/components/button/button.component';
import { ZardTooltipImports } from '@/shared/components/tooltip/tooltip.imports';

@Component({
  selector: 'z-demo-bubble-tooltip',
  host: { class: 'contents' },
  imports: [NgIcon, ZardButtonComponent, ZardTooltipImports, ...ZardBubbleImports],
  template: `
    <div class="flex w-full max-w-sm flex-col gap-4 py-12">
      <z-bubble zVariant="secondary">
        <z-bubble-content>Did you remove the stale route?</z-bubble-content>
      </z-bubble>
      <z-bubble zAlign="end">
        <z-bubble-content>Yes, removed it from the registry.</z-bubble-content>
        <z-bubble-reactions>
          <button
            type="button"
            z-button
            zType="ghost"
            zSize="icon-xs"
            zTooltip="Read on Jan 5, 2026 at 4:32 PM"
            aria-label="Read receipt"
          >
            <ng-icon name="lucideCheck" />
          </button>
        </z-bubble-reactions>
      </z-bubble>
    </div>
  `,
  viewProviders: [provideIcons({ lucideCheck })],
})
export class ZardDemoBubbleTooltipComponent {}
