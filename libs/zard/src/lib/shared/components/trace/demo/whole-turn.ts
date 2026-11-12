import { ChangeDetectionStrategy, Component } from '@angular/core';

import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideBrain, lucideChevronRight, lucideFileText, lucideTerminal } from '@ng-icons/lucide';

import { ZardTraceImports } from '@/shared/components/trace/trace.imports';

@Component({
  selector: 'z-demo-trace-whole-turn',
  imports: [NgIcon, ...ZardTraceImports],
  template: `
    <div class="w-full max-w-sm">
      <z-trace-collapsible zOpen>
        <z-trace-collapsible-trigger>
          <z-trace-line zStatus="error">
            <z-trace-title>Worked for 2m 4s, 1 command failed</z-trace-title>
          </z-trace-line>
        </z-trace-collapsible-trigger>
        <z-trace-collapsible-content zKeepMounted class="flex flex-col gap-2">
          <z-trace>
            <z-trace-collapsible>
              <z-trace-collapsible-trigger>
                <z-trace-line>
                  <z-trace-icon><ng-icon name="lucideBrain" /></z-trace-icon>
                  <z-trace-title>Thought</z-trace-title>
                  <z-trace-description>12s</z-trace-description>
                </z-trace-line>
              </z-trace-collapsible-trigger>
              <z-trace-collapsible-content class="whitespace-pre-wrap">
                I should check which package managers are installed before I scaffold anything.
              </z-trace-collapsible-content>
            </z-trace-collapsible>

            <z-trace-collapsible zOpen>
              <z-trace-collapsible-trigger>
                <z-trace-line zStatus="error">
                  <z-trace-icon><ng-icon name="lucideTerminal" /></z-trace-icon>
                  <z-trace-title>Ran 2 commands, 1 failed</z-trace-title>
                </z-trace-line>
              </z-trace-collapsible-trigger>
              <z-trace-collapsible-content zKeepMounted>
                <z-trace>
                  <z-trace-line>
                    <z-trace-icon><ng-icon name="lucideTerminal" /></z-trace-icon>
                    <z-trace-title>Ran node --version</z-trace-title>
                  </z-trace-line>
                  <z-trace-collapsible>
                    <z-trace-collapsible-trigger>
                      <z-trace-line zStatus="error">
                        <z-trace-icon><ng-icon name="lucideTerminal" /></z-trace-icon>
                        <z-trace-title>Failed to run pnpm --version</z-trace-title>
                      </z-trace-line>
                    </z-trace-collapsible-trigger>
                    <z-trace-collapsible-content>
                      <pre
                        class="border-destructive/30 bg-destructive/5 text-destructive max-h-64 overflow-auto rounded-lg border px-3 py-2.5 font-mono text-xs leading-relaxed whitespace-pre-wrap"
                        >{{ error }}</pre>
                    </z-trace-collapsible-content>
                  </z-trace-collapsible>
                </z-trace>
              </z-trace-collapsible-content>
            </z-trace-collapsible>
          </z-trace>

          <p class="text-foreground">Node is installed and pnpm is not. Reading the docs config.</p>

          <z-trace>
            <a href="#whole-turn">
              <z-trace-line>
                <z-trace-icon><ng-icon name="lucideFileText" /></z-trace-icon>
                <z-trace-title>Read apps/v4/lib/docs.ts</z-trace-title>
                <z-trace-icon><ng-icon name="lucideChevronRight" class="rtl:-scale-x-100" /></z-trace-icon>
              </z-trace-line>
            </a>
          </z-trace>
        </z-trace-collapsible-content>
      </z-trace-collapsible>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  viewProviders: [provideIcons({ lucideBrain, lucideChevronRight, lucideFileText, lucideTerminal })],
  host: { class: 'contents' },
})
export class ZardDemoTraceWholeTurnComponent {
  protected readonly error = 'command not found: pnpm';
}
