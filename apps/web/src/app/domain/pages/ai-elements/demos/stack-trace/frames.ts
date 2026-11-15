import { ChangeDetectionStrategy, Component } from '@angular/core';

import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideCircleX, lucideFileCode, lucideLayers } from '@ng-icons/lucide';

import { ZardTraceImports } from '@/shared/components/trace/trace.imports';

const STACK = `TypeError: Cannot read properties of undefined (reading 'total')
    at formatInvoice (src/app/billing/billing.ts:42:31)
    at InvoiceRow_Template (src/app/billing/invoice-row.ts:18:12)
    at executeTemplate (node_modules/@angular/core/fesm2022/core.mjs:12164:5)
    at refreshView (node_modules/@angular/core/fesm2022/core.mjs:13785:7)
    at detectChangesInView (node_modules/@angular/core/fesm2022/core.mjs:14019:5)
    at detectChangesInViewIfAttached (node_modules/@angular/core/fesm2022/core.mjs:13982:3)`;

/** Splits a frame like `at formatInvoice (src/app/billing/billing.ts:42:31)` into its parts. */
function parseFrame(line: string) {
  const match = line.match(/^at (.+) \((.+):(\d+):(\d+)\)$/);
  return { line, name: match?.[1], file: match?.[2], lineNumber: match?.[3], internal: line.includes('node_modules') };
}

const [ERROR, ...LINES] = STACK.split('\n').map(line => line.trim());
const FRAMES = LINES.map(parseFrame);

@Component({
  selector: 'z-ai-elements-stack-trace-frames',
  imports: [NgIcon, ...ZardTraceImports],
  template: `
    <z-trace class="max-w-sm">
      <z-trace-collapsible zOpen>
        <z-trace-collapsible-trigger>
          <z-trace-line zStatus="error">
            <z-trace-icon><ng-icon name="lucideCircleX" /></z-trace-icon>
            <z-trace-title>Failed: {{ error }}</z-trace-title>
          </z-trace-line>
        </z-trace-collapsible-trigger>
        <z-trace-collapsible-content zKeepMounted class="flex flex-col gap-2">
          <p class="text-destructive font-mono text-xs">{{ error }}</p>
          <z-trace>
            <!-- Your own frames link to the file and line. The framework frames fold away. -->
            @for (frame of appFrames; track frame.line) {
              <a [href]="'#' + frame.file + ':' + frame.lineNumber">
                <z-trace-line>
                  <z-trace-icon><ng-icon name="lucideFileCode" /></z-trace-icon>
                  <z-trace-title>{{ frame.name }} in {{ frame.file }}:{{ frame.lineNumber }}</z-trace-title>
                </z-trace-line>
              </a>
            }
            <z-trace-collapsible>
              <z-trace-collapsible-trigger>
                <z-trace-line>
                  <z-trace-icon><ng-icon name="lucideLayers" /></z-trace-icon>
                  <z-trace-title>{{ internalFrames.length }} framework frames</z-trace-title>
                </z-trace-line>
              </z-trace-collapsible-trigger>
              <z-trace-collapsible-content>
                <ol class="bg-muted flex flex-col gap-1 overflow-x-auto rounded-md p-3 font-mono text-xs">
                  @for (frame of internalFrames; track frame.line) {
                    <li class="whitespace-nowrap">{{ frame.line }}</li>
                  }
                </ol>
              </z-trace-collapsible-content>
            </z-trace-collapsible>
          </z-trace>
        </z-trace-collapsible-content>
      </z-trace-collapsible>
    </z-trace>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  viewProviders: [provideIcons({ lucideCircleX, lucideFileCode, lucideLayers })],
})
export class ZardAiElementsStackTraceFramesComponent {
  protected readonly error = ERROR;
  protected readonly appFrames = FRAMES.filter(frame => !frame.internal);
  protected readonly internalFrames = FRAMES.filter(frame => frame.internal);
}
