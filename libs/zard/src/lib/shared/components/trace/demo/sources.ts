import { ChangeDetectionStrategy, Component } from '@angular/core';

import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideArrowUpRight, lucideBookOpen, lucideGlobe } from '@ng-icons/lucide';

import { ZardTraceImports } from '@/shared/components/trace/trace.imports';

@Component({
  selector: 'z-demo-trace-sources',
  imports: [NgIcon, ...ZardTraceImports],
  template: `
    <z-trace class="w-full max-w-sm">
      <z-trace-collapsible>
        <z-trace-collapsible-trigger>
          <z-trace-line>
            <z-trace-icon><ng-icon name="lucideBookOpen" /></z-trace-icon>
            <z-trace-title>Used 3 sources</z-trace-title>
          </z-trace-line>
        </z-trace-collapsible-trigger>
        <z-trace-collapsible-content>
          <z-trace>
            @for (source of sources; track source.url) {
              <a [href]="source.url" target="_blank" rel="noreferrer">
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
    </z-trace>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  viewProviders: [provideIcons({ lucideArrowUpRight, lucideBookOpen, lucideGlobe })],
})
export class ZardDemoTraceSourcesComponent {
  protected readonly sources = [
    { title: 'Install Astro', url: 'https://docs.astro.build/en/install-and-setup/' },
    { title: 'Project structure', url: 'https://docs.astro.build/en/basics/project-structure/' },
    { title: 'Deploy your site', url: 'https://docs.astro.build/en/guides/deploy/' },
  ];
}
