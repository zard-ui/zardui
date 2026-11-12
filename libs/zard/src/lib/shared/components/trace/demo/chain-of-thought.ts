import { ChangeDetectionStrategy, Component } from '@angular/core';

import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideBrain, lucideCheck, lucideCircleDashed, lucideSearch } from '@ng-icons/lucide';

import { ZardTraceImports } from '@/shared/components/trace/trace.imports';

@Component({
  selector: 'z-demo-trace-chain-of-thought',
  imports: [NgIcon, ...ZardTraceImports],
  template: `
    <z-trace class="w-full max-w-sm">
      <z-trace-collapsible zOpen>
        <z-trace-collapsible-trigger>
          <z-trace-line zStatus="running">
            <z-trace-icon><ng-icon name="lucideBrain" /></z-trace-icon>
            <z-trace-title>Thinking through the migration</z-trace-title>
          </z-trace-line>
        </z-trace-collapsible-trigger>
        <z-trace-collapsible-content zKeepMounted>
          <z-trace class="gap-1.5">
            <z-trace-line>
              <z-trace-icon><ng-icon name="lucideCheck" /></z-trace-icon>
              <z-trace-title>Read the current config</z-trace-title>
            </z-trace-line>
            <z-trace-line>
              <z-trace-icon><ng-icon name="lucideSearch" /></z-trace-icon>
              <z-trace-title>Compared it with the migration guide</z-trace-title>
            </z-trace-line>
            <z-trace-line zStatus="pending">
              <z-trace-icon><ng-icon name="lucideCircleDashed" /></z-trace-icon>
              <z-trace-title>Write the new config</z-trace-title>
            </z-trace-line>
          </z-trace>
        </z-trace-collapsible-content>
      </z-trace-collapsible>
    </z-trace>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  viewProviders: [provideIcons({ lucideBrain, lucideCheck, lucideCircleDashed, lucideSearch })],
})
export class ZardDemoTraceChainOfThoughtComponent {}
