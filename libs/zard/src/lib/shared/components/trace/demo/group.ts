import { ChangeDetectionStrategy, Component } from '@angular/core';

import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideArrowUpRight, lucideFilePen, lucideSearch, lucideTerminal } from '@ng-icons/lucide';

import { ZardTraceImports } from '@/shared/components/trace/trace.imports';

@Component({
  selector: 'z-demo-trace-group',
  imports: [NgIcon, ...ZardTraceImports],
  template: `
    <z-trace class="w-full max-w-sm">
      <z-trace-line>
        <z-trace-icon><ng-icon name="lucideSearch" /></z-trace-icon>
        <z-trace-title>Searched for minimumReleaseAge</z-trace-title>
      </z-trace-line>

      <a href="https://pnpm.io/settings" target="_blank" rel="noreferrer">
        <z-trace-line>
          <z-trace-icon><ng-icon name="lucideSearch" /></z-trace-icon>
          <z-trace-title>
            Read the pnpm settings
            <span class="sr-only">(opens in a new tab)</span>
          </z-trace-title>
          <z-trace-icon><ng-icon name="lucideArrowUpRight" /></z-trace-icon>
        </z-trace-line>
      </a>

      <z-trace-collapsible>
        <z-trace-collapsible-trigger>
          <z-trace-line>
            <z-trace-icon><ng-icon name="lucideTerminal" /></z-trace-icon>
            <z-trace-title>Ran pnpm install</z-trace-title>
            <z-trace-description>12s</z-trace-description>
          </z-trace-line>
        </z-trace-collapsible-trigger>
        <z-trace-collapsible-content>Lockfile is up to date, resolution step is skipped.</z-trace-collapsible-content>
      </z-trace-collapsible>

      <z-trace-line>
        <z-trace-icon><ng-icon name="lucideFilePen" /></z-trace-icon>
        <z-trace-title>Edited pnpm-workspace.yaml</z-trace-title>
        <z-trace-description>+1 -0</z-trace-description>
      </z-trace-line>
    </z-trace>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  viewProviders: [provideIcons({ lucideArrowUpRight, lucideFilePen, lucideSearch, lucideTerminal })],
})
export class ZardDemoTraceGroupComponent {}
