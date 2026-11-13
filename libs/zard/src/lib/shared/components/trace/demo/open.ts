import { ChangeDetectionStrategy, Component, signal } from '@angular/core';

import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideTerminal } from '@ng-icons/lucide';

import { ZardButtonComponent } from '@/shared/components/button/button.component';
import { ZardTraceImports } from '@/shared/components/trace/trace.imports';

@Component({
  selector: 'z-demo-trace-open',
  imports: [NgIcon, ZardButtonComponent, ...ZardTraceImports],
  template: `
    <div class="flex w-full max-w-sm flex-col items-start gap-4">
      <z-trace-collapsible zOpen>
        <z-trace-collapsible-trigger>
          <z-trace-line>
            <z-trace-icon><ng-icon name="lucideTerminal" /></z-trace-icon>
            <z-trace-title>Ran node --version</z-trace-title>
          </z-trace-line>
        </z-trace-collapsible-trigger>
        <z-trace-collapsible-content>
          <pre
            class="bg-muted/50 text-foreground max-h-64 overflow-auto rounded-lg border px-3 py-2.5 font-mono text-xs leading-relaxed whitespace-pre-wrap"
            >{{ nodeOutput }}</pre>
        </z-trace-collapsible-content>
      </z-trace-collapsible>

      <z-trace-collapsible [(zOpen)]="open">
        <z-trace-collapsible-trigger>
          <z-trace-line>
            <z-trace-icon><ng-icon name="lucideTerminal" /></z-trace-icon>
            <z-trace-title>Ran pnpm --version</z-trace-title>
          </z-trace-line>
        </z-trace-collapsible-trigger>
        <z-trace-collapsible-content>
          <pre
            class="bg-muted/50 text-foreground max-h-64 overflow-auto rounded-lg border px-3 py-2.5 font-mono text-xs leading-relaxed whitespace-pre-wrap"
            >{{ pnpmOutput }}</pre>
        </z-trace-collapsible-content>
      </z-trace-collapsible>

      <button type="button" z-button zType="outline" zSize="sm" (click)="open.set(!open())">
        {{ open() ? 'Hide' : 'Show' }} the pnpm output
      </button>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  viewProviders: [provideIcons({ lucideTerminal })],
  host: { class: 'contents' },
})
export class ZardDemoTraceOpenComponent {
  protected readonly open = signal(false);
  protected readonly nodeOutput = '$ node --version\nv24.18.0';
  protected readonly pnpmOutput = '$ pnpm --version\n10.33.4';
}
