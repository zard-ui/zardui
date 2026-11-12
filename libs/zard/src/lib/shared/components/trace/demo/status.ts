import { ChangeDetectionStrategy, Component } from '@angular/core';

import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideCircle, lucideCircleAlert, lucideCircleCheck, lucideLoaderCircle } from '@ng-icons/lucide';

import { ZardTraceImports } from '@/shared/components/trace/trace.imports';

@Component({
  selector: 'z-demo-trace-status',
  imports: [NgIcon, ...ZardTraceImports],
  template: `
    <z-trace class="max-w-sm">
      <z-trace-line>
        <z-trace-icon><ng-icon name="lucideCircleCheck" /></z-trace-icon>
        <z-trace-title>Ran pnpm install</z-trace-title>
      </z-trace-line>
      <z-trace-line zStatus="error">
        <z-trace-icon><ng-icon name="lucideCircleAlert" /></z-trace-icon>
        <z-trace-title>Failed to run pnpm lint</z-trace-title>
      </z-trace-line>
      <z-trace-line zStatus="running">
        <z-trace-icon><ng-icon name="lucideLoaderCircle" class="animate-spin" /></z-trace-icon>
        <z-trace-title>Running pnpm build</z-trace-title>
      </z-trace-line>
      <z-trace-line zStatus="pending">
        <z-trace-icon><ng-icon name="lucideCircle" /></z-trace-icon>
        <z-trace-title>Run pnpm test</z-trace-title>
      </z-trace-line>
    </z-trace>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  viewProviders: [provideIcons({ lucideCircle, lucideCircleAlert, lucideCircleCheck, lucideLoaderCircle })],
  host: { class: 'contents' },
})
export class ZardDemoTraceStatusComponent {}
