import { ChangeDetectionStrategy, Component } from '@angular/core';

import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideArrowUpRight, lucideChevronRight, lucideFileText, lucideGlobe } from '@ng-icons/lucide';

import { ZardTraceImports } from '@/shared/components/trace/trace.imports';

@Component({
  selector: 'z-demo-trace-link',
  imports: [NgIcon, ...ZardTraceImports],
  template: `
    <z-trace class="max-w-sm">
      <a href="#link">
        <z-trace-line>
          <z-trace-icon><ng-icon name="lucideFileText" /></z-trace-icon>
          <z-trace-title>Read apps/v4/lib/docs.ts</z-trace-title>
          <z-trace-icon><ng-icon name="lucideChevronRight" class="rtl:-scale-x-100" /></z-trace-icon>
        </z-trace-line>
      </a>
      <a href="https://docs.astro.build/en/install-and-setup/" target="_blank" rel="noreferrer">
        <z-trace-line>
          <z-trace-icon><ng-icon name="lucideGlobe" /></z-trace-icon>
          <z-trace-title>
            Install Astro | docs.astro.build
            <span class="sr-only">(opens in a new tab)</span>
          </z-trace-title>
          <z-trace-icon><ng-icon name="lucideArrowUpRight" /></z-trace-icon>
        </z-trace-line>
      </a>
    </z-trace>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  viewProviders: [provideIcons({ lucideArrowUpRight, lucideChevronRight, lucideFileText, lucideGlobe })],
  host: { class: 'contents' },
})
export class ZardDemoTraceLinkComponent {}
