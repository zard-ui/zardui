import { ChangeDetectionStrategy, Component } from '@angular/core';

import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideFilePen, lucideSearch, lucideTerminal } from '@ng-icons/lucide';

import { ZardTraceImports } from '@/shared/components/trace/trace.imports';

@Component({
  selector: 'z-demo-trace-description',
  imports: [NgIcon, ...ZardTraceImports],
  template: `
    <z-trace class="max-w-sm">
      <z-trace-line>
        <z-trace-icon><ng-icon name="lucideFilePen" /></z-trace-icon>
        <z-trace-title>Edited src/app/settings/notification-preferences.component.ts</z-trace-title>
        <z-trace-description class="font-mono">+48 −12</z-trace-description>
      </z-trace-line>
      <z-trace-line>
        <z-trace-icon><ng-icon name="lucideTerminal" /></z-trace-icon>
        <z-trace-title>Ran pnpm test</z-trace-title>
        <z-trace-description>14s</z-trace-description>
      </z-trace-line>
      <z-trace-line>
        <z-trace-icon><ng-icon name="lucideSearch" /></z-trace-icon>
        <z-trace-title>Searched for provideHttpClient</z-trace-title>
        <z-trace-description>8 results</z-trace-description>
      </z-trace-line>
    </z-trace>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  viewProviders: [provideIcons({ lucideFilePen, lucideSearch, lucideTerminal })],
  host: { class: 'contents' },
})
export class ZardDemoTraceDescriptionComponent {}
