import { ChangeDetectionStrategy, Component } from '@angular/core';

import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideCircleCheck } from '@ng-icons/lucide';

import { ZardBadgeComponent } from '@/shared/components/badge/badge.component';
import { ZardTraceImports } from '@/shared/components/trace/trace.imports';

@Component({
  selector: 'z-ai-elements-subagent-details',
  imports: [NgIcon, ZardBadgeComponent, ...ZardTraceImports],
  template: `
    <z-trace class="max-w-sm">
      <z-trace-collapsible zOpen>
        <z-trace-collapsible-trigger>
          <z-trace-line>
            <z-trace-icon><ng-icon name="lucideCircleCheck" /></z-trace-icon>
            <z-trace-title>Ran the research agent</z-trace-title>
            <z-trace-description>48s</z-trace-description>
          </z-trace-line>
        </z-trace-collapsible-trigger>
        <z-trace-collapsible-content zKeepMounted class="flex flex-col gap-3">
          <div class="flex flex-wrap gap-1.5">
            <z-badge zType="secondary">anthropic/claude-sonnet-4.5</z-badge>
            <z-badge zType="outline" class="font-mono">runCommand</z-badge>
          </div>
          <p>Find out why image optimization reruns on every deploy.</p>
          <z-trace>
            <z-trace-line>
              <z-trace-icon><ng-icon name="lucideCircleCheck" /></z-trace-icon>
              <z-trace-title>Ran grep -rn cacheKey scripts</z-trace-title>
            </z-trace-line>
            <z-trace-line>
              <z-trace-icon><ng-icon name="lucideCircleCheck" /></z-trace-icon>
              <z-trace-title>Ran sed -n 13,15p scripts/optimize-images.ts</z-trace-title>
            </z-trace-line>
          </z-trace>
          <p>The cache is keyed on the commit SHA.</p>
        </z-trace-collapsible-content>
      </z-trace-collapsible>
    </z-trace>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  viewProviders: [provideIcons({ lucideCircleCheck })],
})
export class ZardAiElementsSubagentDetailsComponent {}
