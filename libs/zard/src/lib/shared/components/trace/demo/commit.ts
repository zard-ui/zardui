import { ChangeDetectionStrategy, Component, signal } from '@angular/core';

import { NgIcon, provideIcons } from '@ng-icons/core';
import {
  lucideChevronRight,
  lucideFileMinus,
  lucideFilePen,
  lucideFilePlus,
  lucideGitCommitHorizontal,
} from '@ng-icons/lucide';

import { ZardSheetImports } from '@/shared/components/sheet/sheet.imports';
import { ZardTraceImports } from '@/shared/components/trace/trace.imports';

interface ChangedFile {
  readonly path: string;
  readonly title: string;
  readonly icon: string;
  readonly stats: string;
  readonly diff: string;
}

@Component({
  selector: 'z-demo-trace-commit',
  imports: [NgIcon, ...ZardSheetImports, ...ZardTraceImports],
  template: `
    <z-trace class="w-full max-w-sm">
      <z-trace-collapsible zOpen>
        <z-trace-collapsible-trigger>
          <z-trace-line>
            <z-trace-icon><ng-icon name="lucideGitCommitHorizontal" /></z-trace-icon>
            <z-trace-title>Committed 3 files</z-trace-title>
            <z-trace-description>+31 -9</z-trace-description>
          </z-trace-line>
        </z-trace-collapsible-trigger>
        <z-trace-collapsible-content zKeepMounted>
          <z-trace>
            @for (file of files; track file.path) {
              <button type="button" (click)="select(file)">
                <z-trace-line>
                  <z-trace-icon><ng-icon [name]="file.icon" /></z-trace-icon>
                  <z-trace-title>{{ file.title }}</z-trace-title>
                  <z-trace-description>{{ file.stats }}</z-trace-description>
                  <z-trace-icon><ng-icon name="lucideChevronRight" class="rtl:-scale-x-100" /></z-trace-icon>
                </z-trace-line>
              </button>
            }
          </z-trace>
        </z-trace-collapsible-content>
      </z-trace-collapsible>
    </z-trace>

    <z-sheet [zVisible]="sheetOpen()" (zVisibleChange)="sheetOpen.set($event)">
      <z-sheet-header>
        <z-sheet-title>{{ selected().path }}</z-sheet-title>
        <z-sheet-description>{{ selected().stats }}</z-sheet-description>
      </z-sheet-header>
      <pre class="bg-muted mx-4 rounded-lg p-3 font-mono text-xs whitespace-pre-wrap">{{ selected().diff }}</pre>
    </z-sheet>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  viewProviders: [
    provideIcons({ lucideChevronRight, lucideFileMinus, lucideFilePen, lucideFilePlus, lucideGitCommitHorizontal }),
  ],
})
export class ZardDemoTraceCommitComponent {
  protected readonly files: readonly ChangedFile[] = [
    {
      path: 'src/trace.component.ts',
      title: 'Added trace.component.ts',
      icon: 'lucideFilePlus',
      stats: '+24',
      diff: `+ @Component({ selector: 'z-trace, [z-trace]' })\n+ export class ZardTraceComponent {}`,
    },
    {
      path: 'src/index.ts',
      title: 'Edited index.ts',
      icon: 'lucideFilePen',
      stats: '+7 -1',
      diff: `- export * from './marker';\n+ export * from './marker';\n+ export * from './trace';`,
    },
    {
      path: 'src/legacy-steps.ts',
      title: 'Deleted legacy-steps.ts',
      icon: 'lucideFileMinus',
      stats: '-8',
      diff: `- export const legacySteps = [];`,
    },
  ];

  protected readonly sheetOpen = signal(false);
  protected readonly selected = signal<ChangedFile>(this.files[0]);

  protected select(file: ChangedFile): void {
    this.selected.set(file);
    this.sheetOpen.set(true);
  }
}
