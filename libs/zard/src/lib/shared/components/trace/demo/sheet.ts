import { ChangeDetectionStrategy, Component, signal } from '@angular/core';

import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideChevronRight, lucideFilePen } from '@ng-icons/lucide';

import { ZardSheetImports } from '@/shared/components/sheet/sheet.imports';
import { ZardTraceImports } from '@/shared/components/trace/trace.imports';

@Component({
  selector: 'z-demo-trace-sheet',
  imports: [NgIcon, ...ZardSheetImports, ...ZardTraceImports],
  template: `
    <z-trace class="w-full max-w-sm">
      <button type="button" (click)="open.set(true)">
        <z-trace-line>
          <z-trace-icon><ng-icon name="lucideFilePen" /></z-trace-icon>
          <z-trace-title>Edited trace.component.ts</z-trace-title>
          <z-trace-description>+24 -6</z-trace-description>
          <z-trace-icon><ng-icon name="lucideChevronRight" class="rtl:-scale-x-100" /></z-trace-icon>
        </z-trace-line>
      </button>
    </z-trace>

    <z-sheet [(zVisible)]="open">
      <z-sheet-header>
        <z-sheet-title>trace.component.ts</z-sheet-title>
        <z-sheet-description>24 additions and 6 deletions.</z-sheet-description>
      </z-sheet-header>
      <pre class="bg-muted mx-4 rounded-lg p-3 font-mono text-xs whitespace-pre-wrap">{{ diff }}</pre>
    </z-sheet>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  viewProviders: [provideIcons({ lucideChevronRight, lucideFilePen })],
})
export class ZardDemoTraceSheetComponent {
  protected readonly open = signal(false);

  protected readonly diff = `- readonly zOpen = input(false);
+ readonly zOpen = model(false);
+ readonly zKeepMounted = input(false, { transform: booleanAttribute });`;
}
