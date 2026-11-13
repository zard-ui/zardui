import { ChangeDetectionStrategy, Component } from '@angular/core';

import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideChevronRight, lucideFileText, lucideSearch } from '@ng-icons/lucide';

import { ZardBadgeComponent } from '@/shared/components/badge/badge.component';
import { ZardTraceImports } from '@/shared/components/trace/trace.imports';

@Component({
  selector: 'z-demo-trace-chain-of-thought',
  imports: [NgIcon, ZardBadgeComponent, ...ZardTraceImports],
  template: `
    <div class="w-full max-w-sm">
      <z-trace-collapsible zOpen>
        <z-trace-collapsible-trigger>
          <z-trace-line zStatus="running">
            <z-trace-title>Looking into the slow deploy</z-trace-title>
          </z-trace-line>
        </z-trace-collapsible-trigger>
        <z-trace-collapsible-content zKeepMounted>
          <z-trace>
            <z-trace-collapsible>
              <z-trace-collapsible-trigger>
                <z-trace-line>
                  <z-trace-icon><ng-icon name="lucideSearch" /></z-trace-icon>
                  <z-trace-title>Searched for the checkout build log</z-trace-title>
                </z-trace-line>
              </z-trace-collapsible-trigger>
              <z-trace-collapsible-content class="flex flex-wrap gap-1.5">
                <z-badge zType="secondary">angular.dev</z-badge>
                <z-badge zType="secondary">github.com</z-badge>
              </z-trace-collapsible-content>
            </z-trace-collapsible>

            <a href="#chain-of-thought">
              <z-trace-line>
                <z-trace-icon><ng-icon name="lucideFileText" /></z-trace-icon>
                <z-trace-title>Read the last twelve deploys</z-trace-title>
                <z-trace-icon><ng-icon name="lucideChevronRight" class="rtl:-scale-x-100" /></z-trace-icon>
              </z-trace-line>
            </a>

            <z-trace-collapsible>
              <z-trace-collapsible-trigger>
                <z-trace-line zStatus="running">
                  <z-trace-icon><ng-icon name="lucideSearch" /></z-trace-icon>
                  <z-trace-title>Searching for the cache key</z-trace-title>
                </z-trace-line>
              </z-trace-collapsible-trigger>
              <z-trace-collapsible-content>
                <pre
                  class="bg-muted/50 text-foreground max-h-64 overflow-auto rounded-lg border px-3 py-2.5 font-mono text-xs leading-relaxed whitespace-pre-wrap"
                >
cache key image optimization</pre>
              </z-trace-collapsible-content>
            </z-trace-collapsible>
          </z-trace>
        </z-trace-collapsible-content>
      </z-trace-collapsible>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  viewProviders: [provideIcons({ lucideChevronRight, lucideFileText, lucideSearch })],
  host: { class: 'contents' },
})
export class ZardDemoTraceChainOfThoughtComponent {}
