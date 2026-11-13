import { ChangeDetectionStrategy, Component } from '@angular/core';

import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideArrowUpRight, lucideGlobe } from '@ng-icons/lucide';

import { ZardTraceImports } from '@/shared/components/trace/trace.imports';

@Component({
  selector: 'z-demo-trace-sources',
  imports: [NgIcon, ...ZardTraceImports],
  template: `
    <div class="w-full max-w-sm">
      <z-trace-collapsible zOpen>
        <z-trace-collapsible-trigger>
          <z-trace-line>
            <z-trace-icon><ng-icon name="lucideGlobe" /></z-trace-icon>
            <z-trace-title>Used {{ sources.length }} sources</z-trace-title>
          </z-trace-line>
        </z-trace-collapsible-trigger>
        <z-trace-collapsible-content>
          <z-trace>
            @for (source of sources; track source.href) {
              <a [href]="source.href" target="_blank" rel="noreferrer">
                <z-trace-line>
                  <z-trace-icon><ng-icon name="lucideGlobe" /></z-trace-icon>
                  <z-trace-title>
                    {{ source.title }}
                    <span class="sr-only">(opens in a new tab)</span>
                  </z-trace-title>
                  <z-trace-icon><ng-icon name="lucideArrowUpRight" /></z-trace-icon>
                </z-trace-line>
              </a>
            }
          </z-trace>
        </z-trace-collapsible-content>
      </z-trace-collapsible>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  viewProviders: [provideIcons({ lucideArrowUpRight, lucideGlobe })],
  host: { class: 'contents' },
})
export class ZardDemoTraceSourcesComponent {
  protected readonly sources = [
    { title: 'Installation | angular.dev', href: 'https://angular.dev/installation' },
    { title: '@angular/cli | npmjs.com', href: 'https://www.npmjs.com/package/@angular/cli' },
    { title: 'Settings: minimumReleaseAge | pnpm.io', href: 'https://pnpm.io/settings#minimumreleaseage' },
  ];
}
