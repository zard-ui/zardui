import { ChangeDetectionStrategy, Component } from '@angular/core';

import { NgIcon, provideIcons } from '@ng-icons/core';
import {
  lucideArrowUpRight,
  lucideCircle,
  lucideCircleAlert,
  lucideCircleCheck,
  lucideGlobe,
  lucideLoaderCircle,
} from '@ng-icons/lucide';

import { ZardBubbleImports } from '@zard/components/bubble/bubble.imports';
import { ZardMessageImports } from '@zard/components/message/message.imports';
import { ZardTraceImports } from '@zard/components/trace/trace.imports';

import { ExampleImports } from './example.component';

const SOURCES = [
  { title: 'pnpm install | pnpm.io', url: 'https://pnpm.io/cli/install#--frozen-lockfile' },
  { title: 'Continuous Integration | pnpm.io', url: 'https://pnpm.io/continuous-integration' },
] as const;

/** The trace component's variants, in zard. */
@Component({
  selector: 'z-trace-example',
  imports: [ExampleImports, NgIcon, ZardBubbleImports, ZardMessageImports, ZardTraceImports],
  changeDetection: ChangeDetectionStrategy.OnPush,
  viewProviders: [
    provideIcons({
      lucideArrowUpRight,
      lucideCircle,
      lucideCircleAlert,
      lucideCircleCheck,
      lucideGlobe,
      lucideLoaderCircle,
    }),
  ],
  template: `
    <z-example-wrapper>
      <z-example zTitle="Status">
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
      </z-example>

      <z-example zTitle="Collapsible">
        <z-trace class="max-w-sm">
          <z-trace-collapsible zOpen>
            <z-trace-collapsible-trigger>
              <z-trace-line>
                <z-trace-icon><ng-icon name="lucideCircleCheck" /></z-trace-icon>
                <z-trace-title>Ran git diff --stat HEAD~1</z-trace-title>
              </z-trace-line>
            </z-trace-collapsible-trigger>
            <z-trace-collapsible-content>
              <pre
                class="bg-muted/50 text-foreground max-h-64 overflow-auto rounded-lg border px-3 py-2.5 font-mono text-xs leading-relaxed whitespace-pre-wrap"
                >{{ diff }}</pre>
            </z-trace-collapsible-content>
          </z-trace-collapsible>
          <z-trace-collapsible>
            <z-trace-collapsible-trigger>
              <z-trace-line zStatus="error">
                <z-trace-icon><ng-icon name="lucideCircleAlert" /></z-trace-icon>
                <z-trace-title>Failed to run pnpm install --frozen-lockfile</z-trace-title>
              </z-trace-line>
            </z-trace-collapsible-trigger>
            <z-trace-collapsible-content>
              ERR_PNPM_OUTDATED_LOCKFILE: pnpm-lock.yaml is not up to date with package.json
            </z-trace-collapsible-content>
          </z-trace-collapsible>
        </z-trace>
      </z-example>

      <z-example zTitle="Links">
        <z-trace class="max-w-sm">
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
      </z-example>

      <z-example zTitle="In a message">
        <div class="flex w-full max-w-md min-w-0 flex-col gap-6">
          <z-message zAlign="end">
            <z-message-content>
              <z-bubble zVariant="muted">
                <z-bubble-content>Why does pnpm install fail in CI?</z-bubble-content>
              </z-bubble>
            </z-message-content>
          </z-message>
          <z-message>
            <z-message-content class="gap-4">
              <z-trace>
                <z-trace-collapsible>
                  <z-trace-collapsible-trigger>
                    <z-trace-line>
                      <z-trace-icon><ng-icon name="lucideCircleCheck" /></z-trace-icon>
                      <z-trace-title>Thought for 5s</z-trace-title>
                    </z-trace-line>
                  </z-trace-collapsible-trigger>
                  <z-trace-collapsible-content>
                    CI installs with a frozen lockfile, so the install stops when package.json and pnpm-lock.yaml
                    disagree.
                  </z-trace-collapsible-content>
                </z-trace-collapsible>
                <z-trace-line zStatus="running">
                  <z-trace-icon><ng-icon name="lucideLoaderCircle" class="animate-spin" /></z-trace-icon>
                  <z-trace-title>Running pnpm install --frozen-lockfile</z-trace-title>
                </z-trace-line>
              </z-trace>
              <p>The last commit bumped a version in package.json without updating the lockfile.</p>
            </z-message-content>
          </z-message>
        </div>
      </z-example>
    </z-example-wrapper>
  `,
})
export class TraceExampleComponent {
  protected readonly sources = SOURCES;
  protected readonly diff = ' package.json | 2 +-\n 1 file changed, 1 insertion(+), 1 deletion(-)';
}
