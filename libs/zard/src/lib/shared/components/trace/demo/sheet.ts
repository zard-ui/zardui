import { ChangeDetectionStrategy, Component, signal } from '@angular/core';

import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideChevronRight, lucideFolderSearch } from '@ng-icons/lucide';

import { ZardSheetImports } from '@/shared/components/sheet/sheet.imports';
import { ZardTraceImports } from '@/shared/components/trace/trace.imports';

@Component({
  selector: 'z-demo-trace-sheet',
  imports: [NgIcon, ...ZardSheetImports, ...ZardTraceImports],
  template: `
    <z-trace class="max-w-sm">
      <button type="button" (click)="open.set(true)">
        <z-trace-line>
          <z-trace-icon><ng-icon name="lucideFolderSearch" /></z-trace-icon>
          <z-trace-title>Explored {{ files.length }} files</z-trace-title>
          <z-trace-icon><ng-icon name="lucideChevronRight" class="rtl:-scale-x-100" /></z-trace-icon>
        </z-trace-line>
      </button>
    </z-trace>

    <z-sheet [(zVisible)]="open">
      <z-sheet-header>
        <z-sheet-title>Explored {{ files.length }} files</z-sheet-title>
        <z-sheet-description>Files read while preparing the response.</z-sheet-description>
      </z-sheet-header>
      <ul class="flex flex-col gap-2 px-6 font-mono text-xs">
        @for (file of files; track file) {
          <li>{{ file }}</li>
        }
      </ul>
    </z-sheet>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  viewProviders: [provideIcons({ lucideChevronRight, lucideFolderSearch })],
  host: { class: 'contents' },
})
export class ZardDemoTraceSheetComponent {
  protected readonly open = signal(false);

  protected readonly files = [
    'apps/v4/lib/docs.ts',
    'apps/v4/lib/components.ts',
    'apps/v4/next.config.mjs',
    'apps/v4/package.json',
  ];
}
