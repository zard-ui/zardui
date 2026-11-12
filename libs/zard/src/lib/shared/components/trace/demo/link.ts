import { ChangeDetectionStrategy, Component } from '@angular/core';

import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideArrowUpRight, lucideBookOpen } from '@ng-icons/lucide';

import { ZardTraceImports } from '@/shared/components/trace/trace.imports';

@Component({
  selector: 'z-demo-trace-link',
  imports: [NgIcon, ...ZardTraceImports],
  template: `
    <z-trace class="w-full max-w-sm">
      <a href="https://docs.astro.build" target="_blank" rel="noreferrer">
        <z-trace-line>
          <z-trace-icon><ng-icon name="lucideBookOpen" /></z-trace-icon>
          <z-trace-title>
            Read the Astro docs
            <span class="sr-only">(opens in a new tab)</span>
          </z-trace-title>
          <z-trace-icon><ng-icon name="lucideArrowUpRight" /></z-trace-icon>
        </z-trace-line>
      </a>
    </z-trace>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  viewProviders: [provideIcons({ lucideArrowUpRight, lucideBookOpen })],
})
export class ZardDemoTraceLinkComponent {}
