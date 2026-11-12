import { ChangeDetectionStrategy, Component } from '@angular/core';

import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideFilePen, lucideSearch, lucideTerminal } from '@ng-icons/lucide';

import { ZardTraceImports } from '@/shared/components/trace/trace.imports';

@Component({
  selector: 'z-demo-trace-description',
  imports: [NgIcon, ...ZardTraceImports],
  template: `
    <z-trace class="w-full max-w-sm">
      <z-trace-line>
        <z-trace-icon><ng-icon name="lucideTerminal" /></z-trace-icon>
        <z-trace-title>Ran pnpm install</z-trace-title>
        <z-trace-description>12s</z-trace-description>
      </z-trace-line>
      <z-trace-line>
        <z-trace-icon><ng-icon name="lucideSearch" /></z-trace-icon>
        <z-trace-title>Searched the codebase</z-trace-title>
        <z-trace-description>3 results</z-trace-description>
      </z-trace-line>
      <z-trace-line>
        <z-trace-icon><ng-icon name="lucideFilePen" /></z-trace-icon>
        <z-trace-title>Edited trace.component.ts</z-trace-title>
        <z-trace-description>+24 -6</z-trace-description>
      </z-trace-line>
    </z-trace>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  viewProviders: [provideIcons({ lucideFilePen, lucideSearch, lucideTerminal })],
})
export class ZardDemoTraceDescriptionComponent {}
