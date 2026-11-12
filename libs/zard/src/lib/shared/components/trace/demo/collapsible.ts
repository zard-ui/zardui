import { ChangeDetectionStrategy, Component, signal } from '@angular/core';

import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideTerminal } from '@ng-icons/lucide';

import { ZardTraceImports } from '@/shared/components/trace/trace.imports';

@Component({
  selector: 'z-demo-trace-collapsible',
  imports: [NgIcon, ...ZardTraceImports],
  template: `
    <z-trace class="w-full max-w-sm">
      <z-trace-collapsible>
        <z-trace-collapsible-trigger>
          <z-trace-line>
            <z-trace-icon><ng-icon name="lucideTerminal" /></z-trace-icon>
            <z-trace-title>Ran node --version</z-trace-title>
          </z-trace-line>
        </z-trace-collapsible-trigger>
        <z-trace-collapsible-content>v24.18.0</z-trace-collapsible-content>
      </z-trace-collapsible>

      <z-trace-collapsible [(zOpen)]="open">
        <z-trace-collapsible-trigger>
          <z-trace-line>
            <z-trace-icon><ng-icon name="lucideTerminal" /></z-trace-icon>
            <z-trace-title>Ran pnpm install</z-trace-title>
            <z-trace-description>12s</z-trace-description>
          </z-trace-line>
        </z-trace-collapsible-trigger>
        <z-trace-collapsible-content zKeepMounted>
          <pre class="bg-muted text-foreground rounded-lg p-3 font-mono text-xs whitespace-pre-wrap">{{ output }}</pre>
        </z-trace-collapsible-content>
      </z-trace-collapsible>
    </z-trace>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  viewProviders: [provideIcons({ lucideTerminal })],
})
export class ZardDemoTraceCollapsibleComponent {
  protected readonly open = signal(true);

  protected readonly output = `Packages: +142
Progress: resolved 142, reused 142, downloaded 0
Done in 11.8s`;
}
