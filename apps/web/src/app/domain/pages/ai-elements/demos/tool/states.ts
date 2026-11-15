import { ChangeDetectionStrategy, Component } from '@angular/core';

import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideTerminal } from '@ng-icons/lucide';

import { ZardCodeBlockImports } from '@/shared/components/code-block/code-block.imports';
import { ZardTraceImports } from '@/shared/components/trace/trace.imports';

@Component({
  selector: 'z-ai-elements-tool-states',
  imports: [NgIcon, ...ZardCodeBlockImports, ...ZardTraceImports],
  template: `
    <z-trace class="max-w-sm">
      <z-trace-collapsible>
        <z-trace-collapsible-trigger>
          <z-trace-line>
            <z-trace-icon><ng-icon name="lucideTerminal" /></z-trace-icon>
            <z-trace-title>Ran git status --short</z-trace-title>
          </z-trace-line>
        </z-trace-collapsible-trigger>
        <z-trace-collapsible-content>
          <z-code-block zSize="sm">
            <z-code-block-content zWrap class="max-h-64">{{ status }}</z-code-block-content>
          </z-code-block>
        </z-trace-collapsible-content>
      </z-trace-collapsible>

      <z-trace-collapsible>
        <z-trace-collapsible-trigger>
          <z-trace-line zStatus="error">
            <z-trace-icon><ng-icon name="lucideTerminal" /></z-trace-icon>
            <z-trace-title>Failed to run ng serve</z-trace-title>
          </z-trace-line>
        </z-trace-collapsible-trigger>
        <z-trace-collapsible-content>
          <z-code-block zSize="sm">
            <z-code-block-content zWrap class="max-h-64">Command timed out after 120 seconds.</z-code-block-content>
          </z-code-block>
        </z-trace-collapsible-content>
      </z-trace-collapsible>

      <z-trace-line>
        <z-trace-icon><ng-icon name="lucideTerminal" /></z-trace-icon>
        <z-trace-title>Denied rm -rf dist</z-trace-title>
      </z-trace-line>

      <z-trace-line zStatus="running">
        <z-trace-icon><ng-icon name="lucideTerminal" /></z-trace-icon>
        <z-trace-title>Running ng test</z-trace-title>
      </z-trace-line>
    </z-trace>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  viewProviders: [provideIcons({ lucideTerminal })],
})
export class ZardAiElementsToolStatesComponent {
  protected readonly status = ' M src/app/app.routes.ts\n M src/app/chat/chat.ts';
}
